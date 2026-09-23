import "./index.css";
import { Composition } from "remotion";
import { InboxLaunch } from "./InboxLaunch";
import { InboxTeaser } from "./InboxTeaser";

/* The frame rate lives here and nowhere else. Scene timings are
   written at 30fps and converted in src/timing.ts, so changing `fps`
   below re-renders the same film at a different sample rate without
   touching a single scene. */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="InboxLaunch"
        component={InboxLaunch}
        durationInFrames={1320}
        fps={60}
        width={1920}
        height={1080}
      />
      <Composition
        id="InboxTeaser"
        component={InboxTeaser}
        durationInFrames={600}
        fps={60}
        width={1920}
        height={1080}
      />
    </>
  );
};
