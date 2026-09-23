import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { BACKDROP } from "../theme";
import { APP_H, APP_W, AppFrame } from "./AppFrame";
import { PANEL_W } from "./AgentPanel";

/* Every scene that shows the product renders it through here, at the
   same size and the same place, so the cuts between them are
   invisible. A scene moves the camera, never the app.

   `zoom` scales about the app's centre. `focus` is an x inside the app
   the camera would like centre screen, and `commit` is how much of
   that it gets.

   The pan is then clamped to the app's own edges, which is the whole
   reason this file exists: the agent panel is the app's right edge, so
   asking to centre it would swing half the frame off the app and fill
   it with backdrop. Clamped, the request becomes "go as far right as
   you can while the app still covers the screen", which is the shot
   that was wanted anyway. Below the zoom where the app covers the
   frame, maxShift is 0 and the app simply stays centred. */

export const FOCUS = {
  /* Centre of the app: the default, whole-product view. */
  whole: APP_W / 2,
  /* Centre of the agent panel, hard against the right edge. */
  panel: APP_W - PANEL_W / 2,
  /* Centre of the reading column, between the list and the panel. */
  thread: 280 + 430 + (APP_W - 280 - 430 - PANEL_W) / 2,
};

export const AppStage: React.FC<{
  zoom?: number;
  focus?: number;
  commit?: number;
  /* -1 keeps the app's top edge in frame, 0 centres, 1 keeps the
     bottom. Only bites once `zoom` makes the app taller than the
     frame. */
  vAnchor?: number;
  opacity?: number;
  chromeOpacity?: number;
  children: React.ReactNode;
}> = ({
  zoom = 1,
  focus = FOCUS.whole,
  commit = 0,
  vAnchor = 0,
  opacity = 1,
  chromeOpacity = 1,
  children,
}) => {
  const { width, height } = useVideoConfig();

  const wanted = (FOCUS.whole - focus) * zoom * commit;
  const maxShift = Math.max(0, (APP_W * zoom - width) / 2);
  const dx = Math.max(-maxShift, Math.min(maxShift, wanted));

  const maxLift = Math.max(0, (APP_H * zoom - height) / 2);
  const dy = -vAnchor * maxLift;

  return (
    <AbsoluteFill
      style={{
        background: BACKDROP,
        justifyContent: "center",
        alignItems: "center",
        opacity,
      }}
    >
      <div
        style={{
          scale: String(zoom),
          translate: `${dx}px ${dy}px`,
        }}
      >
        <AppFrame chromeOpacity={chromeOpacity}>{children}</AppFrame>
      </div>
    </AbsoluteFill>
  );
};
