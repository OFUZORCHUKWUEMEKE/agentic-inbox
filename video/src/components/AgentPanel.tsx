import React from "react";
import { Easing, interpolate } from "remotion";
import { INBOUND, TOOL_CALLS } from "../content";
import { colors, EXPO, fonts } from "../theme";
import { ToolCard } from "./ToolCard";

export const PANEL_W = 400;

/* The right-hand agent panel. `open` slides it in from the edge;
   `run` is the progress of the agent's turn, 0 to 1, which the panel
   splits across its tool calls. */
export const AgentPanel: React.FC<{ open: number; run: number }> = ({
  open,
  run,
}) => {
  /* Each call owns a slice of the run, overlapping slightly so the
     stack reads as a stream rather than a queue. */
  const slice = 1 / TOOL_CALLS.length;

  return (
    <div
      style={{
        width: PANEL_W,
        flexShrink: 0,
        borderLeft: `1px solid ${colors.line}`,
        backgroundColor: colors.surface,
        fontFamily: fonts.sans,
        display: "flex",
        flexDirection: "column",
        translate: `${interpolate(open, [0, 1], [PANEL_W, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(...EXPO),
        })}px 0px`,
      }}
    >
      <div
        style={{
          height: 54,
          borderBottom: `1px solid ${colors.line}`,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 18px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: 9999,
            backgroundColor: colors.accentSoft,
            color: colors.accent,
            fontSize: 11,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          AI
        </div>
        <span style={{ fontSize: 15, fontWeight: 600, color: colors.ink }}>
          Email Agent
        </span>
      </div>

      <div
        style={{
          flex: 1,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 11,
          minHeight: 0,
        }}
      >
        {/* The auto-trigger. The agent is woken by the inbound email,
            not by a person typing - that is the product. */}
        <div
          style={{
            alignSelf: "flex-end",
            maxWidth: "94%",
            backgroundColor: colors.accent,
            color: colors.accentInk,
            borderRadius: 12,
            padding: "11px 13px",
            fontSize: 13.5,
            lineHeight: 1.45,
            opacity: interpolate(run, [0, 0.06], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          [Auto-triggered] New email from {INBOUND.from}: “{INBOUND.subject}”
        </div>

        {TOOL_CALLS.map((t, i) => {
          /* -0.06 overlap: the next card starts rising while the last
             one is still resolving. */
          const start = 0.12 + i * (slice - 0.06);
          const p = interpolate(run, [start, start + slice], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <ToolCard
              key={t.name}
              name={t.name}
              arg={t.arg}
              result={t.result}
              p={p}
            />
          );
        })}
      </div>

      <div
        style={{
          padding: 16,
          borderTop: `1px solid ${colors.line}`,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            height: 40,
            borderRadius: 10,
            border: `1px solid ${colors.line}`,
            backgroundColor: colors.base,
            display: "flex",
            alignItems: "center",
            paddingLeft: 13,
            fontSize: 13.5,
            color: colors.inkFaint,
          }}
        >
          Ask your email agent…
        </div>
      </div>
    </div>
  );
};
