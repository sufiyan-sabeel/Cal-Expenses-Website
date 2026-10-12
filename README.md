# Cal Expenses — promotional website

**Live site:** https://sufiyan-sabeel.github.io/Cal-Expenses-Website/
**Web app:** https://sufiyan-sabeel.github.io/Cal-Expenses/

A static, dependency-free promotional site for the **Cal Expenses** Android app,
built for GitHub Pages. It introduces the app, shows its real features, and offers
a direct APK download.

No frameworks, no build step, no backend. Plain HTML, CSS and JavaScript.

## Structure

```
.
├── index.html               # home page (hero, features, screenshots, demo, download, install, about, FAQ)
├── privacy.html             # privacy policy
├── LICENSE                  # MIT
├── assets/
│   ├── css/styles.css       # the whole stylesheet, including motion + demo
│   ├── js/config.js         # ← THE ONE FILE TO EDIT (see below)
│   ├── js/main.js           # applies the config, mobile menu, gallery, scroll motion
│   ├── js/demo.js           # the interactive demo
│   └── img/                 # logo, favicon, social image
├── downloads/               # the APK lives here
├── screenshots/             # put real screenshots here (see its README)
├── .nojekyll                # stop GitHub Pages running Jekyll
└── robots.txt
```

## Configuration — one place only

Everything site-wide lives in **`assets/js/config.js`**: product name, version, APK path
and filename, APK size, minimum Android version, screenshots, contact email, repository
links and the copyright year. Nothing else in the site hardcodes these values, so editing
that one object updates every page.

## Adding real screenshots

The gallery is intentionally empty: no genuine Cal Expenses screenshots were supplied, and
the reference images used for design inspiration belong to other applications, so they are
**not** shown as this app's interface.

To add real ones: drop the images in `screenshots/`, then list them in
`CAL_CONFIG.screenshots` in `assets/js/config.js`. The gallery renders whatever is listed;
until then it shows a placeholder that says exactly this. See `screenshots/README.md`.

## Where the APK comes from

By default `apkPath` in `assets/js/config.js` points at the **GitHub Release asset** on the
Android repository:

```
https://github.com/sufiyan-sabeel/Cal-Expenses-Android/releases/download/v1.3/cal-expenses-1.3-debug.apk
```

That keeps one source of truth for the APK rather than a second 6.6 MB copy in this repo
(and it is the file whose SHA-256 is printed on the download panel).

### Releasing a new version

1. Build the new APK and attach it to a new release on the Android repo.
2. Update `apkPath`, `apkFileName`, `apkSizeBytes`, `appVersion` and `releaseUrl` in
   `assets/js/config.js`.
3. Update the SHA-256 shown on the download panel in `index.html`.

### Self-hosting the APK instead

Put the file in `downloads/`, then set `apkPath: "./downloads/<filename>"`. Relative paths
keep working on a GitHub Pages project URL. See `downloads/README.md`.

## Interactive demo

The **Try it** section has two honest demos:

1. **Screen walkthrough** — the real app screenshots in a phone frame. Arrows, dots, swipe
   on touch, and left/right arrow keys all work. It auto-advances gently until the visitor
   interacts, then stops.
2. **Expense toy** — pick a category, choose an amount, add it, and watch the monthly total
   and the category bars move. It uses made-up numbers, saves nothing, and is clearly
   labelled as a demo. It does **not** touch the app or any real data.

## Smooth scrolling

A small, dependency-free momentum scroller (`initSmoothScroll` in `assets/js/main.js`):

- **Wheel scrolling** is eased toward its target with a frame-rate independent exponential
  curve, which gives the page the glide of a premium product site rather than the browser's
  stepped default.
- **In-page anchor links** ease to their target on every device, offset for the sticky nav,
  with keyboard focus moved to the target so screen-reader users land in the right place.
- **Touch dragging is deliberately not hijacked.** Phones already have native momentum;
  intercepting it makes scrolling feel worse. Since touch dragging never emits `wheel`
  events, the smoothing simply never applies there.

The stylesheet's `scroll-behavior: smooth` is switched to `auto` while the JS takes over —
otherwise the browser would animate each step of the loop and fight it. If the script never
runs, the CSS smooth scrolling still applies. Skipped entirely under
`prefers-reduced-motion: reduce`.

## 3D scroll effect

As you scroll, each section rises out of the page and straightens — it starts tilted in
perspective (`rotateX`), lifted and slightly faded, and settles flat and fully opaque as it
reaches the reading position. The hero device drifts with the scroll and tilts toward the
pointer, and gallery cards lean gently toward the centre of the viewport.

It is driven by a single `requestAnimationFrame` loop that only writes `transform` and
`opacity`, so it stays cheap on a phone. Because the values are applied as inline styles from
JavaScript, **if scripting fails the page simply renders flat and fully visible** — nothing
can be hidden. The whole thing is skipped under `prefers-reduced-motion: reduce`.

Tuning lives in `assets/js/main.js` (`initMotion`): the tilt angle, lift distance, scale and
opacity range.

## Social link previews

When the site is shared, the preview card comes from Open Graph metadata in the `<head>` of
each page. The image is `assets/og-cal-expenses.png` — 1200 x 630 PNG, built from the site's
own colours, logo and typography, with a **real** screenshot of the app (not a mock-up).

Everything is an **absolute HTTPS URL**. This matters: social crawlers do not run JavaScript
and will not resolve relative paths, so a relative `og:image` silently produces no preview at
all. Because this is a GitHub Pages *project* site, every path carries the
`/Cal-Expenses-Website/` segment:

```
https://sufiyan-sabeel.github.io/Cal-Expenses-Website/assets/og-cal-expenses.png
```

The domain is defined once, in `config.js` as `siteUrl`, with the image path as
`ogImagePath`; `main.js` copies them into the canonical link and the social tags. The values
are also hard-coded correctly in the HTML, since crawlers never execute that script.

### Refreshing a cached preview

Social platforms cache previews aggressively, sometimes for weeks. After deploying, force a
re-scrape with the relevant tool:

| Platform | Tool |
| --- | --- |
| Facebook / Messenger / WhatsApp | Facebook Sharing Debugger — https://developers.facebook.com/tools/debug/ |
| X (Twitter) | Card Validator — https://cards-dev.twitter.com/validator |
| LinkedIn | Post Inspector — https://www.linkedin.com/post-inspector/ |
| Telegram | Send the link to `@WebpageBot` |
| Slack / Discord | Usually re-unfurl on the next paste; Slack has `/expand` in some clients |

WhatsApp and iMessage have no public debugger — they refresh on their own schedule, so a
new URL or a short delay is the only reliable way to force it.

### Replacing the preview image

Overwrite `assets/og-cal-expenses.png` at the same 1200 x 630 size. Keep the filename the
same and no HTML needs to change.

## Your details

The About section shows a creator card. Everything on it comes from `assets/js/config.js`:

| Field | Purpose |
| --- | --- |
| `creatorName` | Displayed name |
| `creatorInitials` | The two letters in the avatar square |
| `creatorRole` | The line under the name |
| `creatorBio` | The short paragraph |
| `contactEmail` | Shown on the Contact link (set it to `""` to point at GitHub issues instead) |

## Motion and accessibility

A scroll-progress bar, nav elevation on scroll, press feedback and a subtle pointer tilt on
the feature cards, on top of the smooth scrolling and 3D scroll above. All of it is
disabled under `prefers-reduced-motion: reduce`, and every interactive control is a real
`<button>` with a label so it works from the keyboard and with a screen reader.

## Preview locally

Because everything uses relative paths, any static server works:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly from disk also works.

## Deploy to GitHub Pages

1. Push this repository to GitHub.
2. Repository → **Settings** → **Pages**.
3. Under **Build and deployment**, set **Source** to *Deploy from a branch*.
4. Choose branch **`main`** and folder **`/ (root)`**, then **Save**.
5. Wait a minute or two; the site appears at
   `https://<username>.github.io/<repository>/`.

Alternatively, from the command line with the GitHub CLI:

```bash
gh api -X POST repos/<owner>/<repo>/pages \
  -f source[branch]=main -f source[path]=/
```

The `.nojekyll` file is already present so GitHub Pages serves the files as-is.

## Before you publish — placeholders to replace

| Placeholder | Where | What to do |
| --- | --- | --- |
| `contactEmail` | `assets/js/config.js` | Empty by default, so the Contact links point at GitHub issues. Set it to a real address if you want one published. |
| `screenshots` | `assets/js/config.js` | Empty by default. Add real screenshots. |
| `siteUrl` | `assets/js/config.js` | Set to your final Pages URL so canonical and Open Graph tags are exact. |
| `repoUrl` / `appRepoUrl` / `releaseUrl` | `assets/js/config.js` | Confirm these point at your repositories. |
| `copyrightYear` | `assets/js/config.js` | Confirm the year. |
| `apkSizeBytes` | `assets/js/config.js` | Re-check after replacing the APK (the size is shown on the download panel). |

## Accuracy notes

The feature list describes only what the app actually does. Two claims are deliberately
worded with care:

- **"Offline-first"**, not "fully offline" — the optional Cal AI assistant uses the network.
- **Privacy** — the app has no analytics, ads or accounts and no server of its own, but the
  optional assistant sends your message to OpenRouter. The privacy policy says so plainly.

No ratings, user counts, certifications or awards are claimed anywhere.

## License

MIT — see [LICENSE](./LICENSE). Copyright (c) 2026 Umaiz Sufiyan.
