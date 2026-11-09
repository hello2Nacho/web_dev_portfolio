// Web-compress a showcase video with Apple's built-in AVFoundation (no ffmpeg needed).
// H.264 High profile, fixed width (height keeps aspect), target bitrate, no audio, fast-start (moov first).
//
//   swift scripts/compress-video.swift <input.mp4> <output.mp4> [width=1600] [bitsPerSecond=700000]
import AVFoundation
import Foundation

let args = CommandLine.arguments
guard args.count >= 3 else { print("usage: swift compress-video.swift in.mp4 out.mp4 [width] [bps]"); exit(1) }
let src = URL(fileURLWithPath: args[1]), dst = URL(fileURLWithPath: args[2])
let width = args.count > 3 ? Int(args[3])! : 1600
let bps = args.count > 4 ? Int(args[4])! : 700_000
try? FileManager.default.removeItem(at: dst)

let asset = AVURLAsset(url: src)
let sem = DispatchSemaphore(value: 0)
var failure: String?

Task {
  do {
    guard let track = try await asset.loadTracks(withMediaType: .video).first else { failure = "no video track"; sem.signal(); return }
    let natural = try await track.load(.naturalSize)
    let fps = try await track.load(.nominalFrameRate)
    var height = Int((Double(width) * Double(natural.height) / Double(natural.width)).rounded())
    height -= height % 2

    let reader = try AVAssetReader(asset: asset)
    let out = AVAssetReaderTrackOutput(track: track, outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_420YpCbCr8BiPlanarVideoRange])
    guard reader.canAdd(out) else { failure = "reader cannot add output"; sem.signal(); return }
    reader.add(out)

    let writer = try AVAssetWriter(outputURL: dst, fileType: .mp4)
    writer.shouldOptimizeForNetworkUse = true // fast-start
    let input = AVAssetWriterInput(mediaType: .video, outputSettings: [
      AVVideoCodecKey: AVVideoCodecType.h264,
      AVVideoWidthKey: width, AVVideoHeightKey: height,
      AVVideoScalingModeKey: AVVideoScalingModeResizeAspectFill,
      AVVideoCompressionPropertiesKey: [
        AVVideoAverageBitRateKey: bps,
        AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
        AVVideoMaxKeyFrameIntervalKey: max(30, Int(fps.rounded()) * 2),
        AVVideoAllowFrameReorderingKey: true,
      ],
    ])
    input.expectsMediaDataInRealTime = false
    writer.add(input)

    guard reader.startReading() else { failure = "reader: \(reader.error?.localizedDescription ?? "unknown") \(String(describing: reader.error))"; sem.signal(); return }
    guard writer.startWriting() else { failure = "writer: \(String(describing: writer.error))"; sem.signal(); return }
    writer.startSession(atSourceTime: .zero)
    let q = DispatchQueue(label: "encode")
    input.requestMediaDataWhenReady(on: q) {
      withExtendedLifetime(reader) {} // keep the reader alive for the whole encode
      while input.isReadyForMoreMediaData {
        if let buf = out.copyNextSampleBuffer() { input.append(buf) }
        else {
          input.markAsFinished()
          writer.finishWriting {
            if writer.status != .completed { failure = writer.error?.localizedDescription ?? "write failed" }
            print("\(width)x\(height) @ \(bps / 1000) kbps → \(dst.path)")
            sem.signal()
          }
          return
        }
      }
    }
  } catch { failure = error.localizedDescription; sem.signal() }
}
sem.wait()
if let f = failure { print("error: \(f)"); exit(1) }
