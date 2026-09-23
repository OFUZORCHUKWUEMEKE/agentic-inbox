import React from "react";
import { Audio } from "@remotion/media";
import { ding, uiSwitch, whoosh } from "@remotion/sfx";
import { Sequence } from "remotion";
import { useAuthoredFrames } from "./timing";

/* Global authored (30fps) frames for the teaser cut. The Arrival cues
   match the launch film exactly, because the scene does; everything
   after it is on the teaser's own boundaries. */
const TOOL_RESOLVES = [126, 162, 198];

export const TeaserSoundtrack: React.FC = () => {
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
      <Sequence from={t(72)} name="sfx: panel opens">
        <Audio src={whoosh} volume={0.4} />
      </Sequence>
      {TOOL_RESOLVES.map((at) => (
        <Sequence key={at} from={t(at)} name="sfx: tool resolves">
          <Audio src={uiSwitch} volume={0.26} />
        </Sequence>
      ))}
      <Sequence from={t(214)} name="sfx: end card">
        <Audio src={whoosh} volume={0.3} />
      </Sequence>
      <Sequence from={t(228)} name="sfx: mark">
        <Audio src={ding} volume={0.24} />
      </Sequence>
      <Sequence from={t(260)} name="sfx: address">
        <Audio src={uiSwitch} volume={0.2} />
      </Sequence>
    </>
  );
};
