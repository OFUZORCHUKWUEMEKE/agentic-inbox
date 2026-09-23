import React from "react";
import { Easing, interpolate } from "remotion";
import { AgentPanel } from "../components/AgentPanel";
import { AppStage, FOCUS } from "../components/AppStage";
import { ReadingPane } from "../components/ReadingPane";
import { Sidebar } from "../components/Sidebar";
import { ThreadList } from "../components/ThreadList";
import { EXPO, PUSH } from "../theme";
import { useAuthoredFrame } from "../timing";

/* The draft_reply call from the last scene, landed. The camera crosses
   from the panel to the reading column and the reply types itself in
   under the amber rule - then stops, with Send sitting there unpressed.

   Frame math (authored 30fps): camera crosses 0-30, the reply types
   6-76, the actions rise 78-90, Send takes a pulse 96-106, push out
   110-122. Scene is 122 frames. */
export const DraftScene: React.FC = () => {
  const frame = useAuthoredFrame();

  /* Inherits the previous scene's 1.18/0.55 and slides across. */
  const zoom = interpolate(frame, [0, 30, 110, 122], [1.42, 1.5, 1.5, 1.82], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EXPO),
  });

  const commit = interpolate(frame, [0, 30], [1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EXPO),
  });

  const draft = interpolate(frame, [6, 76], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.linear,
  });

  const actions = interpolate(frame, [78, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EXPO),
  });

  /* A pulse, not a press. The film never clicks Send - that is the
     whole point of the scene that follows. */
  const press = interpolate(frame, [96, 101, 106], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EXPO),
  });

  return (
    <AppStage
      zoom={zoom}
      focus={FOCUS.thread}
      commit={commit}
      vAnchor={-0.62}
      chromeOpacity={0}
      opacity={interpolate(frame, [112, 122], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(...PUSH),
      })}
    >
      <Sidebar />
      <ThreadList arrival={1} selected={0} />
      <ReadingPane draft={draft} actions={actions} press={press} />
      <AgentPanel open={1} run={1} />
    </AppStage>
  );
};
