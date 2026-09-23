import React from "react";
import { Easing, interpolate } from "remotion";
import { AgentPanel } from "../components/AgentPanel";
import { AppStage } from "../components/AppStage";
import { ReadingPane } from "../components/ReadingPane";
import { Sidebar } from "../components/Sidebar";
import { ThreadList } from "../components/ThreadList";
import { EXPO } from "../theme";
import { useAuthoredFrame } from "../timing";

/* We land inside the app still carrying the push from the wire, and
   the thread the last scene delivered drops into the top of the list
   with a blue wash that decays as it settles.

   Frame math (authored 30fps): land 0-16, the thread arrives 18-46,
   it is opened 50-64, then a slow drift so the hold is not dead.
   Scene is 108 frames. */
export const InboxScene: React.FC = () => {
  const frame = useAuthoredFrame();

  /* Continues the Arrival push rather than starting from rest. */
  const land = interpolate(frame, [0, 16], [1.14, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 0.8, 0.2, 1),
  });

  /* A hair of drift across the hold: 1.0 to 1.02 over 60 frames. */
  const drift = interpolate(frame, [16, 108], [1, 1.02], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.linear,
  });

  const arrival = interpolate(frame, [18, 46], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EXPO),
  });

  const opened = frame >= 52;

  return (
    <AppStage
      zoom={land * drift}
      opacity={interpolate(frame, [0, 8], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })}
    >
      <Sidebar />
      <ThreadList arrival={arrival} selected={opened ? 0 : null} />
      <ReadingPane />
      {/* Closed, but mounted: the panel must not pop into existence
          when the next scene opens it. */}
      <AgentPanel open={0} run={0} />
    </AppStage>
  );
};
