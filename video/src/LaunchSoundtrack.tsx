import React from "react";
import { Audio } from "@remotion/media";
import {
  ding,
  mouseClick,
  pageTurn,
  uiSwitch,
  whoosh,
} from "@remotion/sfx";
import { Sequence } from "remotion";
import { useAuthoredFrames } from "./timing";

/* Global authored (30fps) frames for the launch cut. Every cue is on a
   moment the picture already has: the message leaving, the Worker
   taking it, each tool resolving, the draft landing, and the address.
   Nothing is scored for its own sake.

   If you move a scene boundary in InboxLaunch.tsx, move these too -
   they are absolute, not relative to their scene. */

/* Each tool call resolving in the agent panel. Derived from the run
   slices in AgentPanel: call i resolves at run ≈ 0.303 + 0.273i, and
   the Agent scene maps run 0-1 across authored frames 190-322. */
const TOOL_RESOLVES = [230, 266, 302];

export const LaunchSoundtrack: React.FC = () => {
  const t = useAuthoredFrames();

  return (
    <>
      <Sequence from={t(30)} name="sfx: send">
        <Audio src={whoosh} volume={0.4} />
      </Sequence>
      <Sequence from={t(46)} name="sfx: routed">
        <Audio src={uiSwitch} volume={0.3} />
      </Sequence>
      <Sequence from={t(64)} name="sfx: into app">
        <Audio src={whoosh} volume={0.45} />
      </Sequence>
      <Sequence from={t(86)} name="sfx: thread lands">
        <Audio src={mouseClick} volume={0.35} />
      </Sequence>
      <Sequence from={t(176)} name="sfx: panel opens">
        <Audio src={whoosh} volume={0.4} />
      </Sequence>
      {TOOL_RESOLVES.map((at) => (
        <Sequence key={at} from={t(at)} name="sfx: tool resolves">
          <Audio src={uiSwitch} volume={0.26} />
        </Sequence>
      ))}
      <Sequence from={t(342)} name="sfx: draft lands">
        <Audio src={pageTurn} volume={0.45} />
      </Sequence>
      <Sequence from={t(414)} name="sfx: actions">
        <Audio src={uiSwitch} volume={0.24} />
      </Sequence>
      <Sequence from={t(454)} name="sfx: the line">
        <Audio src={whoosh} volume={0.3} />
      </Sequence>
      <Sequence from={t(512)} name="sfx: stack">
        <Audio src={whoosh} volume={0.26} />
      </Sequence>
      <Sequence from={t(572)} name="sfx: end card">
        <Audio src={whoosh} volume={0.3} />
      </Sequence>
      <Sequence from={t(586)} name="sfx: mark">
        <Audio src={ding} volume={0.24} />
      </Sequence>
      <Sequence from={t(618)} name="sfx: address">
        <Audio src={uiSwitch} volume={0.2} />
      </Sequence>
    </>
  );
};
