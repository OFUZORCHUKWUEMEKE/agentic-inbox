import { Config } from "@remotion/cli/config";

/* PNG frames, not the default JPEG-80 pipe: the UI in these scenes is
   thin text and hairline rules, and the encoder should be the only
   thing that ever touches them. See RENDER.md. */
Config.setVideoImageFormat("png");
Config.setOverwriteOutput(true);
