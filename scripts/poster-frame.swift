// Extract a JPEG poster frame from a video with AVFoundation (no ffmpeg).
//   swift scripts/poster-frame.swift <input.mp4> <output.jpg> [seconds=1]
import AVFoundation
import AppKit

let a = CommandLine.arguments
let asset = AVURLAsset(url: URL(fileURLWithPath: a[1]))
let gen = AVAssetImageGenerator(asset: asset)
gen.appliesPreferredTrackTransform = true
gen.requestedTimeToleranceBefore = .zero
gen.requestedTimeToleranceAfter = .zero
let t = CMTime(seconds: a.count > 3 ? Double(a[3])! : 1, preferredTimescale: 600)
let sem = DispatchSemaphore(value: 0)
gen.generateCGImageAsynchronously(for: t) { img, _, err in
  guard let img else { print("error: \(err?.localizedDescription ?? "no frame")"); exit(1) }
  let rep = NSBitmapImageRep(cgImage: img)
  try! rep.representation(using: .jpeg, properties: [.compressionFactor: 0.9])!.write(to: URL(fileURLWithPath: a[2]))
  print("\(img.width)x\(img.height) frame at \(t.seconds)s → \(a[2])")
  sem.signal()
}
sem.wait()
