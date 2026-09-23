import React from "react";
import { Easing, interpolate } from "remotion";
import { AgentPanel } from "../components/AgentPanel";
import { AppStage, FOCUS } from "../components/AppStage";
import { ReadingPane } from "../components/ReadingPane";
import { Sidebar } from "../components/Sidebar";
import { ThreadList } from "../components/ThreadList";
import { EXPO } from "../theme";
import { useAuthoredFrame } from "../timing";

/* The hero scene. Nobody asked the agent anything: the inbound mail
   woke it. The panel opens and its turn streams in - three real tools
   from workers/agent/index.ts, each resolving in place.

   Frame math (authored 30fps): panel opens 4-28, the camera commits to
   it 20-52, the run plays 18-150, camera eases back 150-168.
   Scene is 168 frames. */
export const AgentScene: React.FC = () => {
  const frame = useAuthoredFrame();

  const open = interpolate(frame, [4, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* Push in on the panel while the tools run and stay there: the
     Draft scene picks the camera up at 1.42 and carries on, so the
     cut between them has nothing to give away.

     The 1.02 start is InboxScene's drift at the moment it hands over,
     not a round number - matching it is what keeps the cut invisible. */
  const commit = interpolate(frame, [20, 52], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EXPO),
  });

  /* 1.55 is where the app stops fitting the frame and starts filling
     it, which is what lets the clamped pan reach the panel at all. */
  const zoom = interpolate(frame, [20, 52, 150, 168], [1.02, 1.55, 1.58, 1.42], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EXPO),
  });

  const run = interpolate(frame, [18, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.linear,
  });

  /* Past about 1.3 the app is taller than the frame. Anchor near its
     top so the thread header survives, and dissolve the browser chrome
     on the way in - once we are this close, we are inside the app and
     a giant set of traffic lights only says "screenshot". */
  const chromeOpacity = interpolate(frame, [20, 44], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AppStage
      zoom={zoom}
      focus={FOCUS.panel}
      commit={commit}
      vAnchor={-0.62}
      chromeOpacity={chromeOpacity}
    >
      <Sidebar />
      <ThreadList arrival={1} selected={0} />
      <ReadingPane />
      <AgentPanel open={open} run={run} />
    </AppStage>
  );
};
