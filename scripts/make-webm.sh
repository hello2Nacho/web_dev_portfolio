#!/bin/sh
# Requires ffmpeg (brew install ffmpeg). Writes assets/projects/<slug>/showcase.webm, then run: node scripts/media.mjs
for d in assets/projects/*/; do
  ffmpeg -y -i "$d/showcase.mp4" -c:v libvpx-vp9 -crf 36 -b:v 0 -row-mt 1 -an "$d/showcase.webm"
done
