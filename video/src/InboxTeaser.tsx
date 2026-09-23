import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { TEASER_OUTRO } from "./content";
import { AgentScene } from "./scenes/AgentScene";
import { ArrivalScene } from "./scenes/ArrivalScene";
import { OutroScene } from "./scenes/OutroScene";
import { TeaserSoundtrack } from "./TeaserSoundtrack";
import { colors } from "./theme";
import { useAuthoredFrames } from "./timing";

/* The short cut. 10 seconds: the mail arrives, the agent runs, the
   address. It shares the Arrival and Outro scenes with the launch
   film, so check both cuts after editing either.

   The Agent scene is cut at 150 rather than its full 168, which is
   the exact frame its third tool call resolves - the teaser ends on
   the draft being saved and never shows it. */
export const InboxTeaser: React.FC = () => {
  const t = useAuthoredFrames();

  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink }}>
      <Sequence durationInFrames={t(72)} layout="absolute-fill" name="Arrival">
        <ArrivalScene />
      </Sequence>
      <Sequence
        from={t(68)}
        durationInFrames={t(150)}
        layout="absolute-fill"
        name="Agent"
      >
        <AgentScene />
      </Sequence>
      <Sequence from={t(214)} layout="absolute-fill" name="Outro">
        <OutroScene caption={TEASER_OUTRO.caption} url={TEASER_OUTRO.url} />
      </Sequence>
      <TeaserSoundtrack />
    </AbsoluteFill>
  );
};
