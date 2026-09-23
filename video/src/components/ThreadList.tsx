import React from "react";
import { Easing, interpolate } from "remotion";
import { THREADS, INBOUND } from "../content";
import { colors, EXPO, fonts } from "../theme";

export const LIST_W = 430;
const ROW_H = 76;

/* The inbox column. `arrival` drives the new thread landing at the top:
   0 is before it exists, 1 is fully landed with the rows below settled
   into their new positions. `selected` highlights a row. */
export const ThreadList: React.FC<{
  arrival?: number;
  selected?: number | null;
}> = ({ arrival = 1, selected = null }) => {
  /* Rows below the new one slide down by exactly one row height. */
  const shift = interpolate(arrival, [0, 1], [0, ROW_H], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EXPO),
  });

  const rest = THREADS.slice(1);

  return (
    <div
      style={{
        width: LIST_W,
        flexShrink: 0,
        borderRight: `1px solid ${colors.line}`,
        backgroundColor: colors.base,
        fontFamily: fonts.sans,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          height: 62,
          borderBottom: `1px solid ${colors.line}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
        }}
      >
        <span style={{ fontSize: 19, fontWeight: 600, color: colors.ink }}>
          Inbox
        </span>
        <span style={{ fontSize: 13, color: colors.inkMuted }}>
          {266 + (arrival > 0.5 ? 1 : 0)} conversations
        </span>
      </div>

      {/* The rows that were already there, pushed down by the arrival */}
      <div style={{ position: "absolute", top: 62 + shift, left: 0, right: 0 }}>
        {rest.map((t, i) => (
          <Row
            key={t.subject}
            from={t.from}
            subject={t.subject}
            count={t.count}
            unread={t.unread}
            selected={selected === i + 1}
          />
        ))}
      </div>

      {/* The arriving thread, sliding in from above and fading up */}
      <div
        style={{
          position: "absolute",
          top: 62,
          left: 0,
          right: 0,
          opacity: interpolate(arrival, [0, 0.25], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: `0px ${interpolate(arrival, [0, 1], [-ROW_H, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(...EXPO),
          })}px`,
        }}
      >
        <Row
          from={THREADS[0].from}
          subject={INBOUND.subject}
          count={THREADS[0].count}
          unread
          selected={selected === 0}
          highlight={interpolate(arrival, [0.4, 1], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        />
      </div>
    </div>
  );
};

const Row: React.FC<{
  from: string;
  subject: string;
  count: number;
  unread: boolean;
  selected: boolean;
  highlight?: number;
}> = ({ from, subject, count, unread, selected, highlight = 0 }) => (
  <div
    style={{
      height: ROW_H,
      borderBottom: `1px solid ${colors.lineSoft}`,
      backgroundColor: selected ? colors.surface : colors.base,
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "0 18px",
      /* A blue wash that decays as the row settles: the "this is new"
         flash, gone by the time the scene hands over. */
      boxShadow:
        highlight > 0
          ? `inset 0 0 0 999px rgba(5, 109, 255, ${0.07 * highlight})`
          : undefined,
    }}
  >
    <div
      style={{
        width: 8,
        height: 8,
        borderRadius: 9999,
        backgroundColor: unread ? colors.accent : "transparent",
        flexShrink: 0,
      }}
    />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 15,
          fontWeight: unread ? 600 : 400,
          color: colors.ink,
        }}
      >
        <span>{from}</span>
        <span
          style={{
            fontSize: 12,
            color: colors.inkMuted,
            backgroundColor: colors.surface,
            borderRadius: 6,
            padding: "1px 6px",
          }}
        >
          {count}
        </span>
      </div>
      <div
        style={{
          fontSize: 14,
          color: colors.inkMuted,
          marginTop: 4,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {subject}
      </div>
    </div>
  </div>
);
