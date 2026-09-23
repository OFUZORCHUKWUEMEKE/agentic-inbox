import React from "react";
import { Easing, interpolate } from "remotion";
import { DRAFT, INBOUND } from "../content";
import { colors, EXPO, fonts } from "../theme";

/* The centre column: the thread, and above it the draft the agent
   writes. `draft` runs 0 to 1 and types the reply out; `actions`
   raises the Send / Edit / Discard row; `press` dips Send. */
export const ReadingPane: React.FC<{
  draft?: number;
  actions?: number;
  press?: number;
}> = ({ draft = 0, actions = 0, press = 0 }) => {
  const chars = Math.floor(
    interpolate(draft, [0, 1], [0, DRAFT.body.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const typed = DRAFT.body.slice(0, chars);
  const typing = draft > 0 && chars < DRAFT.body.length;

  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        backgroundColor: colors.base,
        fontFamily: fonts.sans,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "18px 26px",
          borderBottom: `1px solid ${colors.line}`,
          flexShrink: 0,
        }}
      >
        <div style={{ fontSize: 19, fontWeight: 600, color: colors.ink }}>
          {INBOUND.subject}
        </div>
        <div style={{ fontSize: 13, color: colors.inkMuted, marginTop: 4 }}>
          2 messages in this thread
        </div>
      </div>

      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
        {/* The draft, with the amber rule the product puts down its left */}
        {draft > 0 ? (
          <div
            style={{
              border: `1px solid ${colors.line}`,
              borderLeft: `3px solid ${colors.draft}`,
              borderRadius: 10,
              backgroundColor: colors.draftSoft,
              padding: "16px 18px",
              opacity: interpolate(draft, [0, 0.06], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              translate: `0px ${interpolate(draft, [0, 0.2], [10, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(...EXPO),
              })}px`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 600, color: colors.ink }}>
                Draft reply
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: colors.ink,
                  backgroundColor: colors.draft,
                  borderRadius: 5,
                  padding: "2px 7px",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Draft
              </span>
              <span style={{ fontSize: 13, color: colors.inkMuted }}>
                To: {DRAFT.to}
              </span>
            </div>

            <div
              style={{
                fontSize: 15,
                lineHeight: 1.6,
                color: colors.ink,
                whiteSpace: "pre-wrap",
                minHeight: 118,
              }}
            >
              {typed}
              {typing ? (
                <span
                  style={{
                    display: "inline-block",
                    width: 2,
                    height: 17,
                    marginLeft: 2,
                    verticalAlign: "-3px",
                    backgroundColor: colors.ink,
                  }}
                />
              ) : null}
            </div>

            {/* Nothing leaves without one of these being pressed. */}
            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 14,
                opacity: interpolate(actions, [0, 1], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                translate: `0px ${interpolate(actions, [0, 1], [8, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(...EXPO),
                })}px`,
              }}
            >
              <Action label="Send" primary press={press} />
              <Action label="Edit" />
              <Action label="Discard" />
            </div>
          </div>
        ) : null}

        {/* The message being replied to */}
        <div
          style={{
            border: `1px solid ${colors.line}`,
            borderRadius: 10,
            padding: "16px 18px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 600, color: colors.ink }}>
              {INBOUND.from}
            </span>
            <span style={{ fontSize: 13, color: colors.inkMuted }}>
              {INBOUND.time}
            </span>
          </div>
          {INBOUND.body.map((p) => (
            <p
              key={p}
              style={{
                fontSize: 14.5,
                lineHeight: 1.6,
                color: colors.inkMuted,
                margin: "0 0 9px",
              }}
            >
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

const Action: React.FC<{
  label: string;
  primary?: boolean;
  press?: number;
}> = ({ label, primary = false, press = 0 }) => (
  <div
    style={{
      height: 36,
      borderRadius: 8,
      padding: "0 16px",
      display: "flex",
      alignItems: "center",
      fontSize: 14,
      fontWeight: primary ? 600 : 400,
      backgroundColor: primary ? colors.accent : colors.base,
      color: primary ? colors.accentInk : colors.inkMuted,
      border: `1px solid ${primary ? colors.accent : colors.line}`,
      scale: primary ? String(1 - press * 0.05) : "1",
      boxShadow: primary
        ? `0 0 0 ${press * 10}px rgba(5,109,255,${0.18 * (1 - press)})`
        : undefined,
    }}
  >
    {label}
  </div>
);
