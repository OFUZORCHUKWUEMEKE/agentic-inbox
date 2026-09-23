import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { OUTRO } from "../content";
import { BACKDROP, colors, EXPO, fonts } from "../theme";
import { useAuthoredFrame } from "../timing";

/* The end card. Both cuts share it; the caption and the address are
   passed in, because that is the only thing the teaser changes.

   The address gets the longest hold of anything in the film - it is
   the one thing a viewer has to leave with.

   Frame math (authored 30fps): mark 0-16, wordmark 14-30, tagline
   26-42, caption 38-52, address 46-64, then hold. */
export const OutroScene: React.FC<{ caption: string; url: string }> = ({
  caption,
  url,
}) => {
  const frame = useAuthoredFrame();

  const rise = (from: number) => ({
    opacity: interpolate(frame, [from, from + 14], [0, 1], {
      extrapolateLeft: "clamp" as const,
      extrapolateRight: "clamp" as const,
    }),
    translate: `0px ${interpolate(frame, [from, from + 14], [14, 0], {
      extrapolateLeft: "clamp" as const,
      extrapolateRight: "clamp" as const,
      easing: Easing.bezier(...EXPO),
    })}px`,
  });

  return (
    <AbsoluteFill
      style={{
        background: BACKDROP,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: fonts.sans,
        textAlign: "center",
      }}
    >
      {/* The product's own favicon, as the mark */}
      <svg
        width={88}
        height={88}
        viewBox="0 -960 960 960"
        fill={colors.base}
        style={{
          opacity: interpolate(frame, [0, 16], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: String(
            interpolate(frame, [0, 16], [0.86, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(...EXPO),
            }),
          ),
        }}
      >
        <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z" />
      </svg>

      <div
        style={{
          fontSize: 92,
          fontWeight: 600,
          letterSpacing: "-0.035em",
          color: colors.base,
          marginTop: 26,
          ...rise(14),
        }}
      >
        {OUTRO.wordmark}
      </div>

      <div
        style={{
          fontSize: 30,
          color: "rgba(255,255,255,0.9)",
          marginTop: 14,
          ...rise(26),
        }}
      >
        {OUTRO.tagline}
      </div>

      <div
        style={{
          fontSize: 23,
          letterSpacing: "0.06em",
          color: "rgba(255,255,255,0.8)",
          marginTop: 34,
          ...rise(38),
        }}
      >
        {caption}
      </div>

      <div
        style={{
          fontFamily: fonts.mono,
          fontSize: 27,
          color: colors.base,
          marginTop: 22,
          padding: "12px 26px",
          borderRadius: 9999,
          border: "1px solid rgba(255,255,255,0.4)",
          ...rise(46),
        }}
      >
        {url}
      </div>
    </AbsoluteFill>
  );
};
