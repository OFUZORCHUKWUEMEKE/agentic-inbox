import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { STACK } from "../content";
import { BACKDROP, colors, EXPO, fonts, shadow } from "../theme";
import { useAuthoredFrame } from "../timing";

/* Where all of that runs. Three cards, staggered, no narration - the
   viewer only needs to leave knowing it is their own account.

   Frame math (authored 30fps): cards at 0, 7, 14, each taking 16
   frames to land; hold; out 56-64. Scene is 64 frames. */
export const StackScene: React.FC = () => {
  const frame = useAuthoredFrame();

  return (
    <AbsoluteFill
      style={{
        background: BACKDROP,
        justifyContent: "center",
        alignItems: "center",
        gap: 28,
        flexDirection: "row",
        fontFamily: fonts.sans,
        opacity: interpolate(frame, [0, 6, 56, 64], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      {STACK.map((s, i) => {
        const at = i * 7;
        return (
          <div
            key={s.title}
            style={{
              width: 420,
              minHeight: 260,
              borderRadius: 16,
              backgroundColor: colors.base,
              boxShadow: shadow.lift,
              padding: 32,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              opacity: interpolate(frame, [at, at + 16], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              translate: `0px ${interpolate(frame, [at, at + 16], [26, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(...EXPO),
              })}px`,
            }}
          >
            <div
              style={{
                width: 34,
                height: 4,
                borderRadius: 9999,
                backgroundColor: colors.accent,
              }}
            />
            <div>
              <div
                style={{
                  fontSize: 30,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: colors.ink,
                  lineHeight: 1.2,
                }}
              >
                {s.title}
              </div>
              <div
                style={{
                  fontSize: 19,
                  lineHeight: 1.5,
                  color: colors.inkMuted,
                  marginTop: 14,
                }}
              >
                {s.body}
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
