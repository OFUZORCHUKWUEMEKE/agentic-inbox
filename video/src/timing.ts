import { useCurrentFrame, useVideoConfig } from "remotion";

/* Every scene in this project has its timings written as frame numbers
   tuned at 30fps, and the comment block above each scene describes them
   on that scale.

   The composition renders at 60. Rather than double sixty-odd constants
   - and re-tune whatever rounds badly - the fps is raised in Root.tsx
   alone and the frame is converted back to the authored scale here.
   Nothing happens at a different moment; there are simply twice as many
   samples of every interpolation, which is the whole point of 60fps.

   The frame arrives fractional (0, 0.5, 1, 1.5 ...). interpolate(),
   Math.floor() and Math.sin() all handle that already, so scenes need
   no knowledge of the real frame rate at all.

   To change the frame rate, change Root.tsx and nothing else. Do not
   hand-double the constants inside the scenes. */
export const AUTHORED_FPS = 30;

/** The current frame, on the 30fps scale the scenes are written in. */
export const useAuthoredFrame = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (frame * AUTHORED_FPS) / fps;
};

/**
 * Converts an authored (30fps) frame number into a real frame of this
 * composition. For `Sequence` `from` and `durationInFrames`, which are
 * counted in real frames and must be whole numbers.
 */
export const useAuthoredFrames = () => {
  const { fps } = useVideoConfig();
  return (authored: number) => Math.round((authored * fps) / AUTHORED_FPS);
};
