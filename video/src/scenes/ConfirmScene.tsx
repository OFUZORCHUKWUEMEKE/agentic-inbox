import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { CONFIRM, TOOLS } from "../content";
import { colors, EXPO, fonts } from "../theme";
import { useAuthoredFrame } from "../timing";

/* The claim the product is actually built on, made by showing the
   agent's whole toolbelt and letting the viewer notice what is not in
   it. Nine names land, then the line.

   Frame math (authored 30fps): names stagger 0-26 (two frames apart),
   kicker 26-38, line 32-46, sub 42-54, out 56-62. Scene is 62 frames. */
export const ConfirmScene: React.FC = () => {
  const frame = useAuthoredFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.ink,
        justifyContent: "center",
        alignItems: "center",
        gap: 56,
        fontFamily: fonts.sans,
        opacity: interpolate(frame, [0, 6, 56, 62], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      {/* The toolbelt */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 300px)",
          gap: "14px 20px",
        }}
      >
        {TOOLS.map((t, i) => {
          const at = i * 2;
          return (
            <div
              key={t}
              style={{
                fontFamily: fonts.mono,
                fontSize: 24,
                color: "rgba(255,255,255,0.82)",
                textAlign: "center",
                padding: "12px 0",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.14)",
                opacity: interpolate(frame, [at, at + 8], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                scale: String(
                  interpolate(frame, [at, at + 8], [0.96, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(...EXPO),
                  }),
                ),
              }}
            >
              {t}
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 26,
            fontWeight: 500,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: colors.orange,
            opacity: interpolate(frame, [26, 38], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {CONFIRM.kicker}
        </div>
        <div
          style={{
            fontSize: 74,
            fontWeight: 600,
            letterSpacing: "-0.03em",
            color: colors.base,
            marginTop: 14,
            opacity: interpolate(frame, [32, 46], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: `0px ${interpolate(frame, [32, 46], [12, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(...EXPO),
            })}px`,
          }}
        >
          {CONFIRM.line}
        </div>
        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.72)",
            marginTop: 16,
            opacity: interpolate(frame, [42, 54], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {CONFIRM.sub}
        </div>
      </div>
    </AbsoluteFill>
  );
};
