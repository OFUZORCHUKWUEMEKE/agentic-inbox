import React from "react";
import { colors, fonts, shadow } from "../theme";

/* The browser window the whole film lives inside. Scenes move the
   camera by wrapping this in a transform; the frame itself never
   animates, so every scene's chrome lines up across a cut. */

export const APP_W = 1560;
export const APP_H = 920;
const CHROME_H = 64;

export const AppFrame: React.FC<{
  url?: string;
  children: React.ReactNode;
  /* Lets a scene fade the chrome out when it pushes into the UI. */
  chromeOpacity?: number;
}> = ({ url = "agentic-inbox.workers.dev", children, chromeOpacity = 1 }) => {
  return (
    <div
      style={{
        width: APP_W,
        height: APP_H,
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: colors.base,
        boxShadow: shadow.app,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          height: CHROME_H,
          flexShrink: 0,
          backgroundColor: colors.surface,
          borderBottom: `1px solid ${colors.line}`,
          display: "flex",
          alignItems: "center",
          gap: 18,
          paddingLeft: 22,
          paddingRight: 22,
          opacity: chromeOpacity,
        }}
      >
        <div style={{ display: "flex", gap: 9 }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <div
              key={c}
              style={{
                width: 13,
                height: 13,
                borderRadius: 9999,
                backgroundColor: c,
              }}
            />
          ))}
        </div>
        <div
          style={{
            flex: 1,
            height: 34,
            borderRadius: 9999,
            backgroundColor: colors.base,
            border: `1px solid ${colors.line}`,
            display: "flex",
            alignItems: "center",
            paddingLeft: 16,
            fontFamily: fonts.mono,
            fontSize: 15,
            color: colors.inkMuted,
          }}
        >
          {url}
        </div>
      </div>

      {/* App body */}
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>{children}</div>
    </div>
  );
};
