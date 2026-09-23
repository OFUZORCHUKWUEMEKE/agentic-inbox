# Agentic Inbox launch video

The source for the launch video for [Agentic Inbox](https://github.com/cloudflare/agentic-inbox) — a self-hosted email client with an AI agent, running entirely on Cloudflare Workers. Built with **React and [Remotion](https://www.remotion.dev/)**, which renders React components into video.

Run the project to scrub through the scenes, change the copy, or make your own cut.

| Composition | Duration | Resolution | Frame rate | Entry point |
| --- | --- | --- | --- | --- |
| `InboxLaunch` | 22.0s (1,320 frames) | 1920 × 1080 | 60 fps | [src/InboxLaunch.tsx](src/InboxLaunch.tsx) |
| `InboxTeaser` | 10.0s (600 frames) | 1920 × 1080 | 60 fps | [src/InboxTeaser.tsx](src/InboxTeaser.tsx) |

## The cut

**Launch film · 22 seconds.** A mail arrives on your own domain and you watch it go: sender, Email Routing, your Worker. Inside the app the thread drops into the inbox, the agent wakes *itself* — nobody typed anything — and runs three real tools. The reply writes itself under the amber rule, and then stops, with Send sitting there unpressed. Nine tools appear; sending is not one of them. It closes on where all of this runs and the address.

**Teaser · 10 seconds.** The same opening, the agent's run cut at the exact frame its third tool resolves, then the end card. It never shows the draft.

## Play and edit locally

You need **Node.js 20 or newer** and npm. This folder is a standalone Remotion project inside the Agentic Inbox repository: it has its own dependencies and lockfile, and is invisible to the Workers build and typecheck.

```bash
cd video
npm ci
npm run dev
```

Open the local URL printed in your terminal. In Remotion Studio, select **InboxLaunch** or **InboxTeaser** in the left sidebar, then press **Space**. Drag the timeline to inspect individual frames; edits to the source update the preview.

You don't need to deploy the Worker, connect a domain, or provide an API key — the film is an authored animation, not a recording, and makes no live calls. An internet connection is needed for the Google Fonts and for the Remotion sound effects, which stream from `remotion.media`.

## How it's built

### 1. The story is React scenes on a timeline

Six scenes — **Arrival → Inbox → Agent → Draft → Confirm → Stack → Outro** — each a component placed with Remotion's `Sequence`. Each starts a few frames before the last one ends, so an outgoing push and an incoming land overlap instead of butting together. The teaser reuses Arrival and Outro unchanged.

### 2. The product is rebuilt, not screenshotted

The app in the film is real React: [`AppFrame`](src/components/AppFrame.tsx), [`Sidebar`](src/components/Sidebar.tsx), [`ThreadList`](src/components/ThreadList.tsx), [`ReadingPane`](src/components/ReadingPane.tsx), [`AgentPanel`](src/components/AgentPanel.tsx). That means it stays sharp at any zoom, and the copy is editable rather than baked into a PNG.

The palette in [theme.ts](src/theme.ts) was sampled out of `demo_app.png` rather than guessed, so the film and the product are the same colours: Kumo's blue `#056dff`, the amber `#f0b100` rule down the left of a draft, `#171717` ink, and the Cloudflare orange the app sits on.

The three tool calls the agent runs are the real names from [`workers/agent/index.ts`](../workers/agent/index.ts), and the nine in the Confirm scene are the complete list. **There is deliberately no `send_*` among them** — that absence is the scene. If a send tool is ever added to the agent, [content.ts](src/content.ts) and [ConfirmScene.tsx](src/scenes/ConfirmScene.tsx) both need to change.

### 3. Every scene shares one camera

Scenes that show the product render it through [`AppStage`](src/components/AppStage.tsx), at the same size and place, so the cuts between them are invisible. A scene moves the camera, never the app.

The pan is clamped to the app's own edges, which is the whole reason that file exists: the agent panel *is* the app's right edge, so asking to centre it would swing half the frame off the app and fill it with backdrop. Clamped, the request becomes "go as far right as you can while the app still covers the screen" — which is the shot that was wanted anyway. `vAnchor` does the same job vertically, because past about 1.3× the app is taller than the frame and centring it slices the thread header in half.

### 4. Everything animates from the frame number

Typing, camera moves, the arriving row, the tool cards resolving — all `interpolate()`, easing curves and CSS transforms. One easing voice throughout: expo-out, with a separate accelerating curve for the pushes that hide the cuts.

The timings were tuned at 30 fps. [timing.ts](src/timing.ts) maps the 60 fps render back to that authored timeline, so the pacing is preserved while fast movement gets twice the samples. **To change the frame rate, change [Root.tsx](src/Root.tsx) and nothing else** — do not hand-double the constants inside the scenes.

### 5. Sound is a table of frame numbers

Clicks, whooshes, page turns and the closing ding come from `@remotion/sfx`, played with `@remotion/media`. Each cut has its own soundtrack component holding absolute authored frames. If you move a scene boundary, move these with it.

## Where to make changes

| Change | File |
| --- | --- |
| All copy — the email, the draft, the tool calls, the end card | [src/content.ts](src/content.ts) |
| Colours, fonts, easing, the backdrop | [src/theme.ts](src/theme.ts) |
| Camera framing and its clamps | [src/components/AppStage.tsx](src/components/AppStage.tsx) |
| The app's own UI | [src/components/](src/components) |
| A single scene's frame math | [src/scenes/](src/scenes) |
| Scene order and duration | [src/InboxLaunch.tsx](src/InboxLaunch.tsx), [src/InboxTeaser.tsx](src/InboxTeaser.tsx) |
| Sound cues | [src/LaunchSoundtrack.tsx](src/LaunchSoundtrack.tsx), [src/TeaserSoundtrack.tsx](src/TeaserSoundtrack.tsx) |
| Resolution, fps, total frames | [src/Root.tsx](src/Root.tsx) |

Start with `content.ts` — the mailbox, the sender and the closing address are all there. If you change a scene's length, update the composition's sequence boundaries, the soundtrack cues and the total duration in `Root.tsx` together. Arrival and Outro are shared by both cuts, so check both after editing either.

## Render an MP4

From `video/`:

```bash
npm run render          # launch film → out/agentic-inbox-launch.mp4
npm run render:teaser   # teaser     → out/agentic-inbox-teaser.mp4
```

`out/` is ignored by Git. Remotion downloads a headless browser on the first render if one isn't already available. For the higher-quality export and the colour-tagging step, see [RENDER.md](RENDER.md).

## Checks

```bash
npm run lint   # eslint + tsc
```
