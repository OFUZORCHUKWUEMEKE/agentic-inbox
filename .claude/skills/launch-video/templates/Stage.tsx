import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";

/* One camera for every scene that shows the product.
 *
 * Scenes render their content through this at the same size and the same
 * place, so the cuts between them are invisible: a scene moves the camera,
 * never the content.
 *
 * The clamp is the reason this file exists. If you ask to centre something
 * that lives at the edge of your content - a right-hand panel, a footer -
 * an unclamped camera happily swings half the frame off the content and
 * fills it with backdrop. Clamped, the request becomes "go as far that way
 * as you can while the content still covers the screen", which is the shot
 * you actually wanted. Below the zoom where the content covers the frame,
 * maxShift is 0 and it simply stays centred, so the same code gives you a
 * composed establishing shot and a committed close-up.
 *
 * Set CONTENT_W / CONTENT_H to your app frame's dimensions, then give each
 * scene a `zoom`, and a `focus`/`commit` pair when it should look somewhere
 * specific.
 */

export const CONTENT_W = 1560;
export const CONTENT_H = 920;

/** x positions inside the content the camera is ever asked to look at. */
export const FOCUS = {
  whole: CONTENT_W / 2,
  // e.g. panel: CONTENT_W - PANEL_W / 2,
};

export const Stage: React.FC<{
  /** Scale about the content's centre. */
  zoom?: number;
  /** An x inside the content the camera would like centre screen. */
  focus?: number;
  /** How much of that request it gets, 0 to 1. */
  commit?: number;
  /**
   * -1 holds the content's top edge in frame, 0 centres, 1 holds the
   * bottom. Only bites once `zoom` makes the content taller than the
   * frame - at which point centring tends to slice a header in half.
   */
  vAnchor?: number;
  opacity?: number;
  background?: string;
  children: React.ReactNode;
}> = ({
  zoom = 1,
  focus = FOCUS.whole,
  commit = 0,
  vAnchor = 0,
  opacity = 1,
  background,
  children,
}) => {
  const { width, height } = useVideoConfig();

  const wanted = (FOCUS.whole - focus) * zoom * commit;
  const maxShift = Math.max(0, (CONTENT_W * zoom - width) / 2);
  const dx = Math.max(-maxShift, Math.min(maxShift, wanted));

  const maxLift = Math.max(0, (CONTENT_H * zoom - height) / 2);
  const dy = -vAnchor * maxLift;

  return (
    <AbsoluteFill
      style={{
        background,
        justifyContent: "center",
        alignItems: "center",
        opacity,
      }}
    >
      <div style={{ scale: String(zoom), translate: `${dx}px ${dy}px` }}>
        {children}
      </div>
    </AbsoluteFill>
  );
};
