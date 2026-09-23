---
name: launch-video
description: Build a launch or demo video for a product as a standalone Remotion project (React components rendered to MP4) under video/. Use this whenever someone wants a launch film, teaser, trailer, demo video, product video, promo clip, announcement video, or an animated walkthrough of an app — including indirect phrasings like "make a video for this", "we need something for the launch post", "can you animate the demo", or pointing at a repo and asking for a trailer. Also use when re-cutting, retiming, or restyling an existing Remotion project. Carries the scene structure, the clamped camera, the 30/60fps authoring trick, a palette sampler, the verification loop, and the environment gotchas that otherwise cost an hour of rediscovery.
---

# Launch video

A launch video is a React app that happens to be rendered one frame at a time.
Everything animates from the frame number, so the whole film is deterministic
and re-renderable — which is why it belongs in the repo next to the thing it
advertises, not in a video editor.

The reference implementation is `video/` in this repository. Read it when you
want to see any of this working; it renders, and its comments explain the
reasoning behind the non-obvious parts.

## The shape of the deliverable

```
video/
├── package.json          # own deps and lockfile, standalone
├── tsconfig.json         # scoped to video/ only
├── remotion.config.ts
├── README.md  RENDER.md
└── src/
    ├── Root.tsx          # compositions; fps and duration live HERE and nowhere else
    ├── timing.ts         # 30fps authoring → 60fps render
    ├── theme.ts          # sampled colours, fonts, easing
    ├── content.ts        # every word the film says
    ├── <Cut>.tsx         # scenes placed on a timeline with <Sequence>
    ├── <Cut>Soundtrack.tsx
    ├── components/       # the product's UI, rebuilt
    └── scenes/           # one file per beat
```

Keep it standalone: its own `package.json` and lockfile, and a `tsconfig.json`
that the host project's typecheck does not include. Check the host's tsconfig
`include` globs before you start — if `video/` falls inside one, the host build
starts compiling Remotion and you have broken someone's CI to make a video.

## 1. Find something true before you animate anything

The best moment in a launch film is usually a fact you found in the source, not
a claim marketing wrote. Go read the code first.

In this repo's film, the strongest beat came from reading the agent's tool
registry and noticing it has nine tools and **none of them send email**. The
agent structurally cannot send — so the film puts all nine names on screen and
lands on "Nine tools. Sending isn't one of them." That beat is unarguable
because it is a property of the code.

Go looking for the equivalent: a constraint, a guarantee, a number, an absence.
Grep the actual registries, schemas, and route tables rather than the README —
READMEs describe intentions, code describes behaviour. Then note in
`content.ts` which source file the claim came from, so that if the code changes
someone knows the film is now lying.

Do not invent a claim to fit a nice shot.

## 2. Sample the palette, never guess it

```bash
python3 scripts/sample_palette.py screenshot.png                    # what dominates
python3 scripts/sample_palette.py screenshot.png 200,310 851,600 \
        --displayed 2000x1301                                       # exact points
```

Pure stdlib, because these containers generally have no Pillow, no ImageMagick
and no ffmpeg. The "most saturated" list is the useful one: flat UI is mostly
white, and the brand lives in the few vivid pixels — the primary button, the
unread dot, the one amber rule.

Guessing gets you a colour that looks subtly wrong beside the real product, and
a gradient has no single value to guess anyway. Sample it, then write the hex
into `theme.ts` with a comment saying where it came from.

## 3. Rebuild the UI in React; do not screenshot it

Screenshots go soft the moment the camera pushes past 1.0, and their copy is
frozen. Rebuilt components stay sharp at any zoom and their text stays editable,
which matters because the copy *will* change after the first watch-through.

Screenshots are the right call only for things you do not own — someone else's
site, a third-party dashboard.

## 4. Put every word in `content.ts` first

Write the whole script into one file before building a single scene. It makes
the film reviewable by someone who will not read TSX, it stops copy from being
buried in three layers of JSX, and it is the file people actually edit later.

Scenes import from it and lay it out. If a scene renders a list, keep the item
count stable or adjust that scene's frame maths deliberately.

## 5. One camera, clamped

Copy `templates/Stage.tsx`. Every scene that shows the product renders through
it, at the same size and place, so cuts line up for free.

The clamp is the part worth understanding. Asking the camera to centre something
that sits at the edge of your content — a right-hand panel, a footer — swings
half the frame off the content and fills it with backdrop. `Stage` clamps the
pan to the content's own bounds, which turns that request into "go as far that
way as you can while the content still covers the screen". That is the shot you
wanted. `vAnchor` does the same vertically, because past roughly 1.3× the
content is taller than the frame and centring slices headers in half.

This is a bug you will otherwise ship, because it typechecks perfectly.

## 6. Author at 30fps, render at 60

Copy `templates/timing.ts`. Write every scene's timings as 30fps frame numbers
and let it map the real frame back. The composition's fps then lives in
`Root.tsx` alone: raising it re-renders the same film with twice the samples
rather than a different film.

The mapped frame arrives fractional (0, 0.5, 1, 1.5…). `interpolate()`,
`Math.floor()` and `Math.sin()` all handle that, so scenes need no knowledge of
the real frame rate. Never hand-double constants inside a scene.

Give each scene a header comment listing its frame maths in authored frames, and
start each `<Sequence>` a few frames before the previous one ends — an outgoing
push and an incoming land should overlap, so the cut happens during movement and
hides itself.

## 7. Sound is a table of frame numbers

`@remotion/sfx` clips played with `@remotion/media`, inside `<Sequence from={…}>`.
Keep one soundtrack component per cut holding **absolute authored frames**, and
cue only moments the picture already has. If you move a scene boundary, move
these with it — they do not follow.

## 8. Verify by looking, not by typechecking

This is the highest-leverage habit here, so do not skip to the full render.

```bash
npx tsc && npx eslint src        # cheap, catches syntax and unused code
```

Then **render one still per scene and actually look at each one**:

```bash
CHROME=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
npx remotion still <Composition> out/f-<scene>.png --frame=<n> --scale=0.5 \
  --browser-executable="$CHROME" --ignore-certificate-errors --log=error
```

Typecheck tells you nothing about whether the camera is pointed at the right
thing. The reference project passed `tsc` and `eslint` cleanly while aiming half
the frame at empty background; one still caught it immediately.

Check each frame for: content filling the frame, no truncated text, no clipped
headers, and — across scenes — whether zoom values match at the cuts. A scene
drifting to 1.02 handing over to one starting at 1.0 is a visible pop.

Only then render the film. At `--scale=0.4` a 1,300-frame film takes under a
minute, which is cheap enough to watch for pacing before committing to full
quality.

## 9. Environment gotchas

Each of these costs 10–20 minutes to rediscover:

- **Chromium**: use `headless_shell`, not `chrome`. Old headless mode was
  removed from the Chrome binary, so the obvious path fails with
  `Failed to launch the browser process`. In these containers the shell is at
  `/opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell`.
- **`@remotion/eslint-config-flat`** exports `config`, not `flatConfig`.
- **`remotion.media`** — where `@remotion/sfx` streams its clips at render time —
  is often blocked by container egress policy. Stills still render (with
  warnings); a full video render fails while downloading the first cue. If you
  need a picture proof there, temporarily detach the soundtrack component,
  render, and restore it. Do not disable TLS verification or route around the
  proxy, and confirm the restore with `git status` before committing.
- **No Pillow, ImageMagick or ffmpeg** — hence `scripts/sample_palette.py`.
- Google Fonts and the sfx host both need network at render time. Say so in the
  project README so nobody debugs it twice.

## 10. What a good cut looks like

The arc that works: **establish the mechanism → show it working → the one true
claim → where it runs → the address.**

Open on the thing only this product does — the actual mechanism, not a logo.
Give the opening shot one line of text so it is never an unexplained diagram.
Let the product sequence run long enough to read. Put the true claim from step 1
on its own full-bleed beat with no UI competing for attention. Close on the
mark and the URL, and **hold the address longer than feels comfortable** — it is
the one thing a viewer has to leave with.

Aim for 20–25 seconds for a launch film and about 10 for a teaser, with the
teaser reusing the opening and end-card scenes unchanged so both stay in sync.

## Finishing

Write a `README.md` (the cut, how to run it, where to change things, how to
render) and a `RENDER.md` (encoder flags and why). Use `--image-format png`:
Remotion otherwise pipes JPEG at quality 80, which puts artefacts on hairline
rules and small UI text before h264 ever sees them.

Then add a short section to the host project's README pointing at `video/`, so
the next person finds it.
