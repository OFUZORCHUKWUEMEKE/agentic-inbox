# Rendering

Both compositions run at **60fps**, which is where most social platforms cap.

```bash
npx remotion render InboxLaunch out/agentic-inbox-launch.mp4 \
  --codec h264 --image-format png --crf 12 --x264-preset slow \
  --color-space bt709 --pixel-format yuv420p --audio-bitrate 320k
```

Then tag the colour flags the encoder leaves unset. This is a stream copy, so it costs nothing:

```bash
ffmpeg -i out/agentic-inbox-launch.mp4 -c copy -movflags +faststart \
  -bsf:v "h264_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1:video_full_range_flag=0" \
  out/tagged.mp4 && mv out/tagged.mp4 out/agentic-inbox-launch.mp4
```

Why each flag:

- `--image-format png` is the one that matters most, and it is already the
  default in `remotion.config.ts`. Remotion otherwise pipes JPEG frames at
  quality 80, which puts artefacts on the hairline rules and 13px UI text in
  every scene before h264 ever sees them.
- `--crf 12` is the practical ceiling for this material. Most of the frame is
  flat white panels and thin type, where the visible loss is 4:2:0 chroma
  subsampling rather than bitrate — and 4:2:0 is not negotiable, it is what
  plays everywhere.
- `--color-space bt709` sets the matrix but leaves primaries and transfer
  unset, hence the bitstream filter above. Without it the orange backdrop
  shifts between players.
- Remotion already writes `moov` ahead of `mdat`, so the file streams
  progressively without a faststart pass. The remux keeps it that way.

## Frame rate

Every scene's timings are written as frame numbers tuned at 30fps.
`src/timing.ts` converts the real frame back to that scale, so the fps lives
in `Root.tsx` alone. To change it, change `Root.tsx` and nothing else. Do not
hand-double the constants inside the scenes.

## Rendering without audio

`@remotion/sfx` streams its clips from `remotion.media` at render time. On a
machine or CI runner that cannot reach that host, the video render fails while
downloading the first cue — stills still render, with a warning. If you need a
picture-only proof on such a machine, render a composition with its
soundtrack component detached rather than disabling TLS or proxying around it.

## A quick proof render

Full quality takes a while. For checking pacing and continuity:

```bash
npx remotion render InboxLaunch out/proof.mp4 --codec h264 --scale=0.4
```

At 0.4 scale the whole 1,320-frame film renders in well under two minutes.
