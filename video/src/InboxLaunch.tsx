import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { OUTRO } from "./content";
import { LaunchSoundtrack } from "./LaunchSoundtrack";
import { AgentScene } from "./scenes/AgentScene";
import { ArrivalScene } from "./scenes/ArrivalScene";
import { ConfirmScene } from "./scenes/ConfirmScene";
import { DraftScene } from "./scenes/DraftScene";
import { InboxScene } from "./scenes/InboxScene";
import { OutroScene } from "./scenes/OutroScene";
import { StackScene } from "./scenes/StackScene";
import { colors } from "./theme";
import { useAuthoredFrames } from "./timing";

/* The launch film. 22 seconds. Written at 30fps and rendered at 60 -
   see src/timing.ts. Every number below is an authored frame, and each
   scene starts a few frames before the last one ends so the outgoing
   push and the incoming land overlap instead of butting together.

   0-72     A mail arrives: sender, Email Routing, your Worker
   68-176   Inside the app, the thread drops into the inbox
   172-340  The agent wakes itself and runs three real tools
   336-458  The reply writes itself under the amber rule, and stops
   454-516  Nine tools. Sending isn't one of them
   512-576  Where it runs: your Durable Object, your account
   572-660  The mark and the address, held long */
export const InboxLaunch: React.FC = () => {
  const t = useAuthoredFrames();

  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink }}>
      <Sequence durationInFrames={t(72)} layout="absolute-fill" name="Arrival">
        <ArrivalScene />
      </Sequence>
      <Sequence
        from={t(68)}
        durationInFrames={t(108)}
        layout="absolute-fill"
        name="Inbox"
      >
        <InboxScene />
      </Sequence>
      <Sequence
        from={t(172)}
        durationInFrames={t(168)}
        layout="absolute-fill"
        name="Agent"
      >
        <AgentScene />
      </Sequence>
      <Sequence
        from={t(336)}
        durationInFrames={t(122)}
        layout="absolute-fill"
        name="Draft"
      >
        <DraftScene />
      </Sequence>
      <Sequence
        from={t(454)}
        durationInFrames={t(62)}
        layout="absolute-fill"
        name="Confirm"
      >
        <ConfirmScene />
      </Sequence>
      <Sequence
        from={t(512)}
        durationInFrames={t(64)}
        layout="absolute-fill"
        name="Stack"
      >
        <StackScene />
      </Sequence>
      <Sequence from={t(572)} layout="absolute-fill" name="Outro">
        <OutroScene caption={OUTRO.caption} url={OUTRO.url} />
      </Sequence>
      <LaunchSoundtrack />
    </AbsoluteFill>
  );
};
