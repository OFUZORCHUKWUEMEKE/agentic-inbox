import React from "react";
import { FOLDERS, MAILBOX, OWNER } from "../content";
import { colors, fonts } from "../theme";

export const SIDEBAR_W = 280;

export const Sidebar: React.FC = () => {
  return (
    <div
      style={{
        width: SIDEBAR_W,
        flexShrink: 0,
        backgroundColor: colors.surface,
        borderRight: `1px solid ${colors.line}`,
        padding: "20px 14px",
        fontFamily: fonts.sans,
      }}
    >
      <div style={{ padding: "0 8px 16px" }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: colors.ink }}>
          {OWNER}
        </div>
        <div style={{ fontSize: 13, color: colors.inkMuted, marginTop: 3 }}>
          {MAILBOX}
        </div>
      </div>

      {/* Compose - the one filled control in the product */}
      <div
        style={{
          height: 44,
          borderRadius: 10,
          backgroundColor: colors.accent,
          color: colors.accentInk,
          display: "flex",
          alignItems: "center",
          paddingLeft: 16,
          gap: 10,
          fontSize: 15,
          fontWeight: 500,
          marginBottom: 14,
        }}
      >
        <span style={{ fontSize: 16 }}>✎</span> Compose
      </div>

      {FOLDERS.map((f) => (
        <div
          key={f.label}
          style={{
            height: 40,
            borderRadius: 8,
            backgroundColor: f.active ? colors.base : "transparent",
            border: `1px solid ${f.active ? colors.line : "transparent"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 14px",
            fontSize: 15,
            fontWeight: f.active ? 600 : 400,
            color: f.active ? colors.ink : colors.inkMuted,
          }}
        >
          <span>{f.label}</span>
          {f.count === null ? null : (
            <span style={{ fontSize: 13, color: colors.inkFaint }}>
              {f.count}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};
