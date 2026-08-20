# Colourway — Project Reference

Everything built, decided, and deployed. Written to be dropped into a new chat as context so
work can resume without re-explaining anything.

**Last updated:** 20 Aug 2026 · **Rev 7** (new Team ID / bundle ID; rev 6 added the iOS app side)

---

## 1. What Colourway is

A web dashboard for a sneaker / streetwear receipt-capture and spend-tracking app, built from
an uploaded product spec PDF. It turns receipts into a picture of where money goes: spend by
category, budgets, and a log of every drop. There is now also an **iOS app** in progress —
the web side hosts its Universal Links and OAuth callback.

**Live:** https://colourwayapp.com

---

## 2. Live URLs

| URL | Role |
|---|---|
| `https://colourwayapp.com` | Primary (apex) |
| `https://www.colourwayapp.com` | 308 redirect → apex |
| `https://colourwayapp.com/auth-callback` | OAuth return leg (200, no redirect) |
| `https://colourwayapp.com/auth-callback.html` | Same page, same content (200, no redirect) |
| `https://colourwayapp.com/.well-known/apple-app-site-association` | Universal Links (200, `application/json`) |
| `https://colourwayapp.com/og-image.png` | Link-preview card, 1200×630 (200, `image/png`) |
| `https://colourway-dashboard.vercel.app` | Vercel short URL, still live |
| `https://colourway-dashboard-mzyyyz416-9124s-projects.vercel.app` | Original project URL, still live |

HTTP upgrades to HTTPS automatically. HSTS on, `max-age=63072000`.

---

## 3. Infrastructure

**GitHub:** `meezy416/colourway-dashboard` (private)

**Vercel:**
- Project: `colourway-dashboard`
- Project ID: `prj_njXEeTPWchWUwplig9HCAJGGMMPU`
- Team ID: `team_ptWZCNudSPG1Uamyzg7uiWxQ`
- Account: hobby plan, `mzyyyz416-9124`
- Git-linked → **auto-deploys on every push to `main`**. Every deployment so far is
  `target=production`; there are no preview deploys on this project.
- Deployment protection (Vercel Authentication / SSO) **disabled** — required for public access

**Domain:** `colourwayapp.com`, registered at **Cloudflare Registrar** (~$10.11/yr, at-cost,
same price on renewal, WHOIS privacy included). Nameservers `nova.ns.cloudflare.com` /
`burt.ns.cloudflare.com`.

**DNS records currently live:**

| Type | Name | Value | Proxy |
|---|---|---|---|
| A | `@` | `216.198.79.1` | DNS only (grey cloud) |
| A | `@` | `64.29.17.1` | DNS only |
| CNAME | `www` | `eb3b845a9169b8f4.vercel-dns-017.com` | DNS only |

**SSL:** Let's Encrypt, issued automatically by Vercel, separate certs for apex and www,
auto-renewing.

### Critical DNS rule
Keep the Cloudflare proxy **OFF** (grey cloud). With the orange cloud on and SSL/TLS mode at
"Flexible", Cloudflare talks HTTP to Vercel while Vercel redirects to HTTPS → infinite
redirect loop, `ERR_TOO_MANY_REDIRECTS`. If the proxy is ever wanted (for WAF/analytics), set
**SSL/TLS → Full (strict)** first, and only after the certificate has issued.

### Known future risk
The apex uses **A records**, not a CNAME. Those are Vercel's current rank-1 IPs, so it works
today — but if Vercel rotates them, the apex breaks while `www` keeps working (www is already
a CNAME and follows automatically).

**Symptom to watch for:** `colourwayapp.com` fails while `www.colourwayapp.com` loads fine.
**Fix:** delete both apex A records, create `CNAME @ → eb3b845a9169b8f4.vercel-dns-017.com`
(Cloudflare flattens CNAMEs at the apex). Offered and declined — deliberately left as A records.

---

## 4. Files in the repo

The repo root **is** the publish root. No build step, no framework, no subdirectory.

**13 files in the repo, 11 served publicly.** The split matters — see the warning below.

| File | Size | Served? | Purpose |
|---|---|---|---|
| `index.html` | 107,643 B | yes | The entire dashboard — single self-contained file |
| `og-image.png` | 19,024 B | yes | Link-preview card, 1200×630 |
| `brand-mark.png` | 4,040 B | yes | Sidebar logo — **transparent**, 120px for a 40px box |
| `auth-callback.html` | 4,962 B | yes | OAuth return leg, bounces to `colourway://` |
| `.well-known/apple-app-site-association` | 495 B | yes | iOS Universal Links |
| `favicon.ico` | 3,405 B | yes | Multi-size ICO: 16 / 32 / 48 |
| `icon-16.png` | 415 B | yes | 16px tier (sneaker glyph only) |
| `icon-32.png` | 554 B | yes | 32px tier (full badge) |
| `icon-192.png` | 5,311 B | yes | Android home screen |
| `apple-touch-icon.png` | 6,192 B | yes | iOS home screen, 180px, full-bleed square |
| `vercel.json` | 347 B | no | Rewrite + content-type header rule (config, never served) |
| `.vercelignore` | 245 B | no | Keeps this doc out of the deployment |
| `README.md` | 2,682 B | no | Vercel skips it by convention |
| `PROJECT-REFERENCE.md` | this file | no | Only because `.vercelignore` excludes it |

> ### ⚠ Vercel serves root markdown
> Vercel skips `README.md` by convention but **serves every other `.md` file at the root**.
> This doc went live at `/PROJECT-REFERENCE.md` returning 200 for about two minutes before
> `.vercelignore` was added. Nothing in it is a credential, but it holds the Vercel project
> and team IDs, the GitHub App installation ID, and the private repo name.
>
> **Any new `.md`, `.txt`, or note file added to the repo root is public by default.**
> Add it to `.vercelignore` in the same commit, then verify:
> ```bash
> curl -sI https://colourwayapp.com/<file> | head -n 1   # want 404
> ```
> Don't assume a file type isn't served — check it.

`.vercelignore` excludes files from the deployment upload entirely, so they stay in git and
version history while never reaching the CDN. That's the right tool here; a `headers` or
`redirects` rule in `vercel.json` would still upload the file and only mask it.

**Current live hashes (SHA-256):**

```
index.html          53b2b54e696d2036e54f7571298e97543e8bb0f2e04eace930caf38638d7f003
og-image.png        1d83f889a524d60d4086e33eae7e99b139ec3b3c9f71c97dd2585662aa8f20e6
brand-mark.png      f28e89fe116965dbfba0d676a500e949e75b937715e6ec9e55f12720067832ed
auth-callback.html  0a2e13fbed8978550cd664ec1261696c674b9fcc9d4a95721b21a907db05945e
AASA                2a93b2c4311002cc7afbd2e90ba058e7e3d51d4721097171c47a5f4eb82ed1b5
```

---

## 5. The dashboard itself

**Architecture:** one self-contained HTML file. No build step, no external dependencies, no
CDN calls. All CSS and JS inline.

**Views:** Overview · Categories · Budgets · Transactions · Sync · Settings
Plus an animated **financial health score** on the Overview, calibrated against the generated
dataset (added Aug 19).

**Title:** `Colourway — Track every drop` — set in three places: `<title>`, `og:title`,
`twitter:title`. Change all three together or the tab and shared-link previews disagree.

**Data:** realistic demo data from a seeded PRNG (mulberry32), so it's reproducible — the same
numbers on every load. Not connected to a real backend.

> **Note:** `index.html` is now shipped **unminified** (changed Aug 18). It is 2,730 lines and
> readable. Editing it directly in the repo is viable; there is no build step to re-run.

### Design system

Matches a "Donezo" dashboard reference: rounded white shell on grey, green accent, pill bars,
hatched fills, semicircle gauge, dark accent card. The Colourway badge sits in the sidebar
header (added Aug 18).

```css
--plane:#ebecea; --shell:#ffffff; --content:#f7f8f7;
--surface-1:#ffffff; --surface-2:#f2f4f2; --surface-3:#e9ece9;
--ink:#101511; --ink-2:#5c6761; --ink-3:#949c97;
--g900:#0f2c1c; --g800:#153b26; --g700:#1c5335; --g600:#276b45;
--g500:#3d875a; --g400:#6ba887; --g300:#a2cab3; --g200:#cde4d6; --g100:#eaf4ee;
--brand:#1c5335; --brand-ink:#ffffff;
--hatch:#d5d9d6;
--r-shell:30px; --r-card:20px; --r-sm:14px;
```

Full parallel dark-mode block via `@media (prefers-color-scheme: dark)` and
`:root[data-theme="dark"]`.

### Category colours — why they aren't all green

Seven spend categories all in green would be indistinguishable. The hues were chosen by
running every permutation of 7 through the dataviz palette validator (lightness band, chroma
floor, colour-blind ΔE separation in OKLab, normal-vision floor, contrast vs surface), with
green forced first.

**Order:** green → blue → orange → aqua → violet → yellow → magenta
Worst adjacent colour-blind ΔE: **9.2 light / 9.4 dark** — both pass.

```css
--c1:#008300; --c2:#2a78d6; --c3:#eb6834; --c4:#1baf7a;
--c5:#4a3aa7; --c6:#eda100; --c7:#e87ba4; --c8:#e34948;
```

**Don't reorder `CATS` without re-running the validator.**

---

## 6. iOS integration

### Apple identifiers
```
Team ID    M2JPA6CM75
Bundle ID  app.colourway.Colourway     <- capital C, case-sensitive
App ID     M2JPA6CM75.app.colourway.Colourway
URL scheme colourway                    <- unchanged
```

**Changed 20 Aug 2026.** Was `7X9K2MQ4RL` / `com.colourway.app`; the old app ID is no longer
declared anywhere, so any build signed with it stops matching Universal Links. The scheme
stayed `colourway` deliberately — it is hardcoded in the live `auth-callback.html` and sits on
the Supabase redirect allow-list, so changing it would mean a web redeploy and a Supabase edit
for no gain.

Two traps in this pair of strings. The bundle ID is **case-sensitive** and ends in a capital
C — a lowercase `colourway` there fails silently, with no error on device or in the AASA. And
the AASA prefix is the **App ID Prefix**, not strictly the Team ID; they match for almost every
app, but not for an App ID created under one team and transferred to another. If links stay
dead after everything else checks out, read the prefix off the Developer portal.

### `.well-known/apple-app-site-association`

```json
{
  "applinks": {
    "details": [
      {
        "appIDs": ["M2JPA6CM75.app.colourway.Colourway"],
        "components": [
          { "/": "/auth-callback.html", "comment": "OAuth return leg - hand the callback to the app" },
          { "/": "/auth-callback",      "comment": "Extensionless variant of the same route" }
        ]
      }
    ]
  },
  "webcredentials": { "apps": ["M2JPA6CM75.app.colourway.Colourway"] }
}
```

**Scoped deliberately to the two callback paths — not `"*"`.** A wildcard would make every
colourwayapp.com link try to open the app, hijacking the dashboard itself. Widen only when
real deep-link routes exist.

Constraints that matter, all currently satisfied:
- Served at exactly `/.well-known/apple-app-site-association`, **no** `.json` extension
- `content-type: application/json` (forced by `vercel.json`; Vercel would otherwise guess)
- **Zero redirects** — Apple rejects the file if the request redirects
- No BOM, ASCII-only, valid strict JSON
- `webcredentials` included for Password AutoFill / Sign in with Apple

> **Apple caches the AASA via its CDN**, it is not fetched live. After changing the app ID,
> expect a lag before devices notice. Delete and reinstall the app to force a refresh in dev.

### `auth-callback.html`

Reads the OAuth return and forwards it to `colourway://auth-callback`, carrying **both** the
query string and the fragment — auth-code flows use the query, implicit and hash-based PKCE
flows use the fragment. Carrying only one silently breaks the other.

Behaviour, all verified:

| Input | Result |
|---|---|
| `?code=…&state=…` | forwards verbatim |
| `#access_token=…` | fragment preserved |
| query + hash together | both preserved, correct order |
| `?error=access_denied&error_description=…` | shows decoded reason, does **not** bounce into the app |
| no params (direct visit) | "nothing to finish here", no redirect |
| `?code=a%2Bb%2Fc%3D` | percent-encoding preserved, **not** decoded |

That last row is the one that matters most — decoding would corrupt a base64 auth code before
the app ever saw it.

After ~1.6s without the app taking over, a fallback card appears with a manual "Open
Colourway" button. Styled to the brand, `noindex`.

> The redirect is wrapped in `if (!window.__noRedirect)`. Chromium cannot be driven through an
> unknown URL scheme, so without that hook the page can't be tested at all. It is inert in
> production — nothing sets that flag outside the test harness.

### `vercel.json`

```json
{
  "rewrites": [
    { "source": "/auth-callback", "destination": "/auth-callback.html" }
  ],
  "headers": [
    {
      "source": "/.well-known/apple-app-site-association",
      "headers": [
        { "key": "Content-Type", "value": "application/json" },
        { "key": "Cache-Control", "value": "public, max-age=3600" }
      ]
    }
  ]
}
```

**A rewrite, not `cleanUrls`.** `cleanUrls: true` was tried first and works, but it makes the
`.html` path non-canonical: `/auth-callback.html` becomes a **308** to `/auth-callback`, and
`/index.html` starts redirecting to `/`. A rewrite serves the file without changing the URL,
so *both* callback paths return a clean 200 and nothing else on the site is affected. Apple
and strict OAuth providers both prefer no redirect on the callback leg.

### The app side — written 20 Aug 2026

Swift + SwiftUI, Supabase auth, delivered as drop-in files rather than edits to a project
(there is no iOS repo yet). Bundle: `colourway-ios-universal-links.zip`.

| File | Role |
| --- | --- |
| `Colourway.entitlements` | `applinks:` + `webcredentials:colourwayapp.com` |
| `Info-plist-additions.xml` | `CFBundleURLTypes` registering the `colourway` scheme |
| `ColourwayLink.swift` | Recognises a callback URL; reads provider errors; redacts for logging |
| `AuthModel.swift` | The delegate handling — dedupe, error surfacing, session exchange |
| `WebAuthLauncher.swift` | `ASWebAuthenticationSession` wrapper |
| `SupabaseClient+Colourway.swift` | Shared client, pinned to the PKCE flow |
| `ColourwayApp.swift` | `@main` wiring, both inbound routes attached |
| `iOS-SETUP.md` | Xcode click-paths, Supabase config, verification checklist, gotchas |

**Two inbound routes, both wired.** `onOpenURL` takes the custom scheme (and, on current
SwiftUI, Universal Links too); `onContinueUserActivity(NSUserActivityTypeBrowsingWeb)` takes
the Universal Link on a cold launch from Safari. Attaching only one is the usual cause of
"sign-in works on my phone but not on theirs". Both funnel into `AuthModel.handle(_:)`.

**Which means a callback can arrive twice**, and a PKCE code is single-use — the second
exchange fails and would clobber the session the first one just established. `AuthModel`
keeps a `Set` of handled URLs and drops an entry again only if the exchange threw, so a
genuine retry is not swallowed.

**The URL is handed to Supabase untouched.** `ColourwayLink`'s parsing is diagnostic only —
recognition, error display, log redaction. Re-encoding a callback is how a base64url auth
code containing `+` or `/` gets corrupted. The parsing was exercised against 17 cases
(base64 codes, fragment-only errors, `error_code` vs `error`, malformed pairs, wrong host,
plain http, collision precedence) before shipping.

**Errors are read from the query *and* the fragment.** Auth-code flows report `?error=`,
implicit/hash flows report `#error=`. Checking one is how a failed sign-in becomes a spinner
that never resolves.

**PKCE, not implicit** (`flowType: .pkce`). The code comes back in the query string, so a
Universal Link carries it intact. Implicit returns tokens in the fragment, which no server
ever sees — that is the case `auth-callback.html` exists to rescue.

**Redirect allow-list.** All three of `colourway://auth-callback`,
`https://colourwayapp.com/auth-callback`, `https://colourwayapp.com/auth-callback.html` must
be on Supabase → Authentication → URL Configuration. A `redirectTo` that is not on the list
does not error — Supabase falls back to the Site URL, and the callback never reaches the app.
"Sign-in just goes to the website" is nearly always this.

Providers redirect to **Supabase**, not to Colourway: the provider consoles get
`https://<project>.supabase.co/auth/v1/callback`.

**Verified so far:** the live AASA (re-fetched after the rev 7 identifier change) is
byte-identical to the tested build — 495 B, `2a93b2c4…`, HTTP 200, `application/json`, zero
redirects — and matches the entitlement, the new bundle ID, and both claimed paths; the Swift
passes a bracket/import lint and the callback parsing passes its case suite. Apple's CDN copy
lags the origin by up to a day, so the first device test after an identifier change should use
`?mode=developer`. **Not** verified: a real `swiftc` compile — there is no Swift
toolchain in this environment. Treat first build as the compile check, and see the last row
of the gotchas table in `iOS-SETUP.md` about `signInWithOAuth` overloads shifting between
supabase-swift minor versions.

If Universal Links don't fire on the first attempt, delete and reinstall the app. A stale
cached AASA is the usual culprit, not the file — or use `applinks:colourwayapp.com?mode=developer`
with Settings → Developer → Associated Domains Development to bypass Apple's CDN entirely.
Remove the flag before archiving.

---

## 7. Metadata in `<head>`

- `description` — "Colourway turns sneaker and streetwear receipts into a clear picture of where your money goes…"
- `theme-color` — `#f3f4ed` light / `#101511` dark (light value matches the favicon plate)
- `color-scheme: light dark`
- `application-name` / `apple-mobile-web-app-title` — "Colourway"
- Open Graph: `og:type`, `og:site_name`, `og:title`, `og:description`, `og:url`,
  `og:image` (+ `:type`, `:width`, `:height`, `:alt`)
- Twitter: `summary_large_image` card, title, description, `twitter:image`

### The link-preview card

`og-image.png` — 1200×630, the standard size Facebook, LinkedIn, Slack, iMessage, and X all
expect. Badge on the left, "Colourway" in Poppins Bold brand green, "Track every drop"
beneath it in neutral grey, a short brand rule and the domain, with a green bar down the
left edge. Verified legible down to 160px wide, since previews often render small.

**`twitter:card` must stay `summary_large_image`.** It was `summary` before, which renders a
small square thumbnail and ignores a 1200×630 image entirely. Adding the image without
changing the card type does nothing on X.

Two build details worth keeping:

- **The badge needed background removal, not just cropping.** The source PNG's off-white
  background differs slightly from the brand plate and isn't uniform across the image, so a
  straight paste left a faint square outline. A soft alpha ramp keyed to the background
  colour fixes it.
- **Use octree quantization, not median-cut.** The palette is green-dominated, so median-cut
  snapped the neutral grey tagline toward green at 24 colours. Octree holds the grey at its
  exact source value *and* compresses better — 19 KB versus 124 KB, max per-channel
  difference of 7 against the full-colour original.

To force a re-scrape after changing it, use Facebook's Sharing Debugger or X's Card
Validator — both cache aggressively.

---

## 8. Favicon

Built from the lace-ring badge: a green shoelace looped into a circle with a knot and aglet,
high-top sneaker in the centre, off-white plate.

**Tiered by size, on purpose.** Rendered to 16px, the lace braid becomes noise and the sneaker
collapses into a smudge — two nested shapes can't survive 16 pixels.

| Size | What it shows |
|---|---|
| 16px | Sneaker silhouette only — one bold shape, reads instantly |
| 32 / 48px | Full lace-ring badge |
| 180px (iOS) / 192px (Android) | Full badge, full detail |

Most people see the 32px tier — a Retina display renders a 16px tab slot at 32 physical px.
Icons are real files, not inlined data URIs.

### The sidebar mark is a different file, on purpose

```html
<img class="brand-mark" src="/brand-mark.png" width="40" height="40" alt="" decoding="async">
.brand-mark { width: 40px; height: 40px; flex: 0 0 40px; display: block }
```

`brand-mark.png` is **transparent**, 120px for a 40px box (3x for high-DPI), 4,040 B.

**Don't repoint this at `icon-192.png`.** The two need opposite things. The app icon wants the
opaque off-white plate so it reads as a tile on a home screen; the sidebar mark needs
transparency so it sits on whatever is behind it. The sidebar is `var(--shell)` — `#ffffff`
light, `#111412` dark — so a baked-in plate shows as a grey disc in light mode and a glaring
white one in dark.

That is exactly what shipped 18 Aug and was fixed 20 Aug: the sidebar used `icon-192.png`
with `border-radius: 50%; object-fit: cover`, which both dragged the plate into dark mode and
**clipped the knot and aglet** — a circular crop of rounded-square art cuts the corners off.

`alt=""` is correct: "Colourway" sits beside it as real text, so alt text would make a screen
reader announce the name twice.

---

## 9. Deployment workflow

The sandbox can't reach the Vercel API or write to GitHub directly, so deploys route through
**Composio** (OAuth-connected GitHub + Vercel), using `COMPOSIO_REMOTE_WORKBENCH` /
`COMPOSIO_REMOTE_BASH_TOOL` and `proxy_execute(method, endpoint, toolkit, ...)`.

Three methods, by size of change:

**A. Direct PUT (small files).** Base64 the file, verify its SHA-256 matches the tested local
copy, `PUT /repos/{owner}/{repo}/contents/{path}` with `sha` when updating. Used for all of
`vercel.json`, the AASA, and `auth-callback.html`.

**B. Delta patch (small edits to a big file).** Remote sandbox `curl`s the live file, verify
its hash, apply a string/regex replacement, **verify the result matches the locally tested
build before committing**, then PUT.

**C. Chunked transfer (large or binary).** `tar` → `xz -9e` → `base64 -w0` →
`split -b 7400` → heredoc each chunk into the remote sandbox → reassemble → verify SHA-256 at
every stage.

### Verify after every deploy
```bash
curl -sS https://colourwayapp.com -o live.html -w "status:%{http_code} bytes:%{size_download}\n"
sha256sum live.html
curl -sIL https://colourwayapp.com/.well-known/apple-app-site-association | grep -iE "^HTTP/|^content-type|^location"
curl -so /dev/null -w "redirects=%{num_redirects}\n" -L https://colourwayapp.com/.well-known/apple-app-site-association
curl -sSI https://www.colourwayapp.com | grep -i -E '^HTTP/|^location'   # expect 308
```

Hash-checking beats a 200 status — a 200 can be a stale cached build.

---

## 10. Gotchas hit along the way

| Problem | Cause / fix |
|---|---|
| **A linter's own bug read as a code defect** | A crude brace-balance script stripped `//` as a comment — inside `"https://…"` — and reported a real file as unbalanced. Two files were "wrong" before the tool was. **When a check fails on code you have reason to trust, suspect the check first**; a correct scanner then found the files clean |
| `.xcconfig` value silently truncated | `//` starts a comment in xcconfig, so `SUPABASE_URL = https://x.supabase.co` stores `https:`. Write `https:/$()/x.supabase.co` |
| **Files "missing from the deploy"** | They had never been committed. Before debugging a pipeline, run `git ls-files` or list the repo tree via the API. Tell: if a dotfolder *and* a normal file are both missing, it isn't a dot-pattern `.gitignore` and it isn't the deploy |
| GitHub "session bound to configured repositories" | Sandbox's native token is repo-scoped → use Composio's OAuth GitHub connection |
| Vercel API unreachable from sandbox (curl exit 56) | No outbound route → use the Composio remote sandbox |
| Site returned redirects, not 200 | Vercel SSO/deployment protection is **on by default** → `PATCH /v9/projects/{id}` with `{"ssoProtection": null}` (raw proxy_execute; the wrapped tool rejects `null`) |
| GitHub Pages 422 | Private repos need GitHub Pro → use Vercel |
| Vercel project-link `repo_not_found` | Vercel's GitHub App scoped to selected repos. **User must fix manually** at `github.com/settings/installations/137592170` — cannot be granted via API |
| OAuth links expired unused | 10-minute TTL → regenerate with a fresh alias |
| `/v4/domains/status` returns 400 | Sunsetted 9 Nov 2025; the replacement registrar API isn't in the public docs → use **RDAP** (`rdap.verisign.com/com/v1/domain/{name}`): 404 = genuinely unregistered |
| A committed `.md` went live at a public URL | Vercel skips `README.md` but serves any other root markdown. Add internal files to `.vercelignore` in the same commit and `curl -sI` the path to confirm 404. **Verify what a new commit exposes — don't reason about it from convention** |
| Chunked binary transfer arrived corrupt | An end-to-end hash tells you *that* it broke, not *where*. Hash **every chunk** against the local split before reassembling, and re-send only the bad ones. A boundary can shift silently and still decode into a valid-looking file. Corruption can also preserve byte count — a single wrong character gives the right length and the wrong hash, so bisect by segment rather than re-sending blind |
| An asset "already done" looked wrong | The sidebar badge shipped, then rendered clipped and mis-toned for two days. Re-check a shipped visual against the surfaces it actually sits on — both themes — instead of trusting the commit message |
| `pkill -f "http.server 8123"` kills its own shell | The pattern matches the invoking shell's command line → capture the PID and `kill $PID` |
| Playwright hangs on `colourway://` | Chromium can't navigate an unknown scheme; the page dies mid-test → gate the redirect behind a test-only flag |
| Mobile row overflow | Grid children need `min-width: 0` |
| CSS clip-path pseudo-icons rendered wrong | Replaced with real inline SVG |

---

## 11. Domain research (17 Aug 2026)

`colourway.com` is **taken** — registered 2002 via Alibaba Cloud / Hichina, parked. Buyable
only as a paid acquisition.

Verified unregistered at the time of checking, via RDAP:

- **colourwayapp.com** ← registered, now live
- usecolourway.com · getcolourway.com · colourwayhq.com · mycolourway.com
- colourwaykicks.com · spendcolourway.com · colourwaylabs.com

A trademark exists for "Colorway LLC" (American spelling, unrelated industry). Unlikely to
conflict with a UK-spelling app domain, but worth knowing before filing.

**Registrar pricing (Aug 2026):** Cloudflare $10.11/yr flat. Cheapest first-year deals
(Spaceship ~$3.92) renew around $10.18 — a one-time saving of roughly $6.

---

## 12. Open items

1. **Build the iOS app files into a real Xcode project** — the drop-in files are written and
   linted but have never been compiled (see §6). First build is the compile check.
2. **Native Sign in with Apple** — `ASAuthorizationController` + `auth.signInWithIdToken`.
   The current `signIn(with: .apple)` uses the web flow, which reviewers accept but dislike.
   App Store guideline 4.8 requires offering it at all if Google sign-in is offered.
3. **Supabase redirect allow-list** — three URLs to add before any sign-in can work (§6).
4. **Apex A → CNAME swap** — optional hardening, see §3
5. **Full badge at 16px** — if the tiered favicon approach isn't wanted

Closed: iOS entitlement / URL scheme / delegate handling (rev 6), og:image (rev 3),
sidebar badge (Aug 18), custom domain (Aug 17).

---

## 13. Fast resume

1. The repo is the source of truth. Any local build directory is ephemeral and gone.
   This doc lives at `PROJECT-REFERENCE.md` in the repo root — keep it updated in place.
2. `index.html` is a single self-contained, **unminified** file — edit it directly.
3. Push to `main` → Vercel auto-deploys → verify with the block in §9.
4. Adding any non-asset file to the repo root? Add it to `.vercelignore` too, then curl the
   path and confirm 404 — see the warning in §4.
5. Re-read §3's proxy warning before touching DNS.
6. Re-run the palette validator before touching category colours.
7. Don't switch `vercel.json` to `cleanUrls` — see §6 for why the rewrite is preferred.
