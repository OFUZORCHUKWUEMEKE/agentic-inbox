import React from "react";
import { Easing, interpolate } from "remotion";
import { colors, EXPO, fonts, shadow } from "../theme";

/* One tool call in the agent panel. `p` runs 0 to 1 across the card's
   whole life: it rises in, the name lands, then the result replaces
   the running state. Mirrors the product, where a call shows as
   pending and then resolves in place. */
export const ToolCard: React.FC<{
  name: string;
  arg: string;
  result: string;
  p: number;
}> = ({ name, arg, result, p }) => {
  const resolved = p > 0.55;

  return (
    <div
      style={{
        border: `1px solid ${colors.line}`,
        borderRadius: 12,
        backgroundColor: colors.base,
        padding: "13px 15px",
        boxShadow: shadow.card,
        fontFamily: fonts.sans,
        opacity: interpolate(p, [0, 0.18], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        translate: `0px ${interpolate(p, [0, 0.35], [14, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(...EXPO),
        })}px`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: 9999,
            backgroundColor: resolved ? colors.sent : colors.draft,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: fonts.mono,
            fontSize: 14,
            fontWeight: 500,
            color: colors.ink,
          }}
        >
          {name}
        </span>
        <span
          style={{
            fontFamily: fonts.mono,
            fontSize: 12.5,
            color: colors.inkFaint,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {arg}
        </span>
      </div>

      <div
        style={{
          fontSize: 13.5,
          color: resolved ? colors.inkMuted : colors.inkFaint,
          marginTop: 7,
          paddingLeft: 16,
        }}
      >
        {resolved ? result : "running…"}
      </div>
    </div>
  );
};
