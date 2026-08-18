# Colourway — Spend Dashboard

Web dashboard for **Colourway**, the sneaker & streetwear receipt-capture and spend-tracking product.
Built from the product spec (`colourwayproduct.pdf`).

**Live:** https://colourwayapp.com

## What's here

`index.html` — the entire app. One self-contained file: no build step, no dependencies, no network calls.
Open it locally or serve it from any static host.

Icon files (`favicon.ico`, `icon-16.png`, `icon-32.png`, `icon-192.png`, `apple-touch-icon.png`) are the
only other assets. `icon-192.png` doubles as the sidebar brand mark.

## Views

| View | Spec section |
|---|---|
| Overview | 4.4 — total spend by range, KPIs, spend over time, category split, recent receipts |
| Categories | 4.2 — the seven default categories, share of spend, 6-month stacked trend |
| Budgets | 4.4 / 5 — overall + per-category budgets, budget vs. actual, over-budget alerts, pace projection |
| Transactions | 4.4 — search / filter / sort, receipt detail drawer, CSV export |
| QuickBooks sync | 4.3 — per-transaction sync status, error reasons, retry and resync |
| Settings | 4.3 — category to chart-of-accounts mapping, connection, preferences |

## Demo data

~400 days of seeded transactions (deterministic — every load is identical). Edits made in the
browser live for the session only; there is no backend. The real product reads from the API layer
described in spec section 7.

## Editing

`index.html` is committed **unminified** — ~2,500 lines, formatted, one statement per line. Edit it
directly (GitHub's web editor works fine) and push; Vercel redeploys in seconds. There is deliberately
no build step and no `src/` directory, so what you read is exactly what ships and the two can never
drift apart.

Minifying would save about 2 KB gzipped (24 KB vs 26 KB) — not worth a build step you have to remember
to run.

One caveat: this file was originally generated minified, so while the structure and CSS are readable,
the JavaScript identifiers are still single letters (`function t(e, i, o)`) and there are no comments.
Formatting was verified lossless — the JS token stream (14,242 tokens), the normalized CSS, and the
body markup are all byte-for-byte identical to the previously deployed minified build. Renaming the
identifiers to something meaningful is a separate job.

## Notes

- Chart palette validated for colorblind separation in both light and dark modes; every chart has a table view.
- Responsive down to 390px. Light/dark theme toggle in the header.

## Deploys

Pushes to `main` deploy automatically to Vercel — this repo is linked to the `colourway-dashboard`
Vercel project (production branch: `main`).
