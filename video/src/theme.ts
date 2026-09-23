import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

const inter = loadInter("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const mono = loadMono("normal", {
  weights: ["400", "500"],
  subsets: ["latin"],
});

export const fonts = {
  sans: inter.fontFamily,
  mono: mono.fontFamily,
};

/* Sampled straight out of demo_app.png, so the film and the product
   are the same colours rather than approximately the same colours.
   The neutrals are Tailwind's neutral scale, which is what Kumo
   resolves to; `accent` is Kumo's primary blue (the Compose button,
   the unread dot, the agent's own bubbles) and `draft` is the amber
   rule down the left of a draft reply. */
export const colors = {
  /* App surfaces */
  base: "#ffffff",
  surface: "#f7f7f7",
  line: "#e5e5e5",
  lineSoft: "#f0f0f0",

  /* Type */
  ink: "#171717",
  inkMuted: "#737373",
  inkFaint: "#a3a3a3",

  /* Brand */
  accent: "#056dff",
  accentSoft: "#e0edff",
  accentInk: "#ffffff",
  draft: "#f0b100",
  draftSoft: "#fffbeb",
  orange: "#f6821f",
  orangeDeep: "#c96327",

  /* Signals */
  sent: "#16a34a",
};

/* The backdrop the app sits on: the Cloudflare orange wash from the
   README screenshot, top-left lighter than bottom-right. */
export const BACKDROP = `linear-gradient(140deg, ${colors.orange} 0%, ${colors.orangeDeep} 100%)`;

/* One easing voice for the whole film: expo-out. Everything that
   moves uses this unless it is a press (which wants symmetry) or a
   camera push (which wants to accelerate into the cut). */
export const EXPO = [0.16, 1, 0.3, 1] as const;

/* The push-through used at scene handoffs: slow to leave, fast to
   arrive, so the cut lands on the fast part and hides itself. */
export const PUSH = [0.5, 0, 0.9, 0.4] as const;

export const shadow = {
  app: "0 40px 100px rgba(23, 23, 23, 0.28), 0 8px 24px rgba(23, 23, 23, 0.12)",
  card: "0 8px 24px rgba(23, 23, 23, 0.08)",
  lift: "0 18px 40px rgba(23, 23, 23, 0.14)",
};
