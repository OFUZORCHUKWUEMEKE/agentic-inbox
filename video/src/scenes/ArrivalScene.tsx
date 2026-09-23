import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { ARRIVAL_TITLE, INBOUND, MAILBOX } from "../content";
import { BACKDROP, colors, EXPO, fonts, PUSH } from "../theme";
import { useAuthoredFrame } from "../timing";

/* How the mail actually gets in, which is the part nobody else can
   show: it is not an API poll, it is Cloudflare Email Routing handing
   the message to your own Worker.

   Frame math (authored 30fps): sender 0-14, routing 10-26, worker
   20-34, the packet runs the wire 30-50, the worker takes it 46-58,
   push through 58-72. Scene is 72 frames. */

const NODES = [
  { label: INBOUND.from, sub: "sends" },
  { label: "Email Routing", sub: "catch-all rule" },
  { label: MAILBOX, sub: "your Worker" },
];

const NODE_W = 452;
const GAP = 76;

export const ArrivalScene: React.FC = () => {
  const frame = useAuthoredFrame();

  /* The packet's position along the whole three-node run, 0 to 1. */
  const travel = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.5, 0, 0.3, 1),
  });

  const totalW = NODES.length * NODE_W + (NODES.length - 1) * GAP;

  return (
    <AbsoluteFill
      style={{
        background: BACKDROP,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        scale: String(
          interpolate(frame, [58, 72], [1, 1.9], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(...PUSH),
          }),
        ),
        opacity: interpolate(frame, [64, 72], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      {/* The one line of the film that is spoken rather than shown.
          It is up before the wire draws, so the shot is never three
          unexplained boxes. */}
      <div
        style={{
          fontFamily: fonts.sans,
          fontSize: 46,
          fontWeight: 600,
          letterSpacing: "-0.025em",
          color: colors.base,
          marginBottom: 64,
          opacity: interpolate(frame, [2, 16], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: `0px ${interpolate(frame, [2, 16], [10, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(...EXPO),
          })}px`,
        }}
      >
        {ARRIVAL_TITLE}
      </div>

      <div
        style={{
          position: "relative",
          width: totalW,
          display: "flex",
          alignItems: "center",
          gap: GAP,
        }}
      >
        {/* The wire, drawn behind the nodes */}
        <div
          style={{
            position: "absolute",
            left: NODE_W / 2,
            right: NODE_W / 2,
            top: "50%",
            height: 3,
            backgroundColor: "rgba(255,255,255,0.55)",
            transformOrigin: "left center",
            scale: `${interpolate(frame, [10, 34], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(...EXPO),
            })} 1`,
          }}
        />

        {/* The message itself, running the wire */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: NODE_W / 2,
            width: 18,
            height: 18,
            marginTop: -9,
            marginLeft: -9,
            borderRadius: 9999,
            backgroundColor: colors.base,
            boxShadow: "0 0 0 11px rgba(255,255,255,0.24)",
            opacity: frame >= 30 && frame <= 52 ? 1 : 0,
            translate: `${travel * (totalW - NODE_W)}px 0px`,
          }}
        />

        {NODES.map((n, i) => {
          const appear = 0 + i * 10;
          /* Each node lights when the packet reaches it. */
          const reached = travel >= i / (NODES.length - 1) - 0.02;
          const isLast = i === NODES.length - 1;
          const take = isLast
            ? interpolate(frame, [46, 52, 58], [1, 1.06, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(...EXPO),
              })
            : 1;

          return (
            <div
              key={n.label}
              style={{
                width: NODE_W,
                borderRadius: 16,
                backgroundColor: colors.base,
                border: `1px solid ${reached ? colors.accent : colors.line}`,
                padding: "26px 24px",
                fontFamily: fonts.sans,
                textAlign: "center",
                boxShadow: reached
                  ? `0 0 0 4px rgba(5,109,255,0.18)`
                  : "0 10px 30px rgba(0,0,0,0.12)",
                opacity: interpolate(frame, [appear, appear + 14], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                scale: String(
                  take *
                    interpolate(frame, [appear, appear + 14], [0.94, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                      easing: Easing.bezier(...EXPO),
                    }),
                ),
              }}
            >
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 22,
                  color: colors.ink,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {n.label}
              </div>
              <div
                style={{
                  fontSize: 15,
                  color: colors.inkMuted,
                  marginTop: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {n.sub}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
