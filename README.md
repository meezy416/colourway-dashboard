# Colourway — Spend Dashboard

Web dashboard for **Colourway**, the sneaker & streetwear receipt-capture and spend-tracking product.
Built from the product spec (`colourwayproduct.pdf`).

**Live:** https://colourway-dashboard-mzyyyz416-9124s-projects.vercel.app

## What's here

`index.html` — the entire app. One self-contained file: no build step, no dependencies, no network calls.
Open it locally or serve it from any static host.

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

## Notes

- Chart palette validated for colorblind separation in both light and dark modes; every chart has a table view.
- Responsive down to 390px. Light/dark theme toggle in the header.

## Deploys

Pushes to `main` deploy automatically to Vercel — this repo is linked to the `colourway-dashboard`
Vercel project (production branch: `main`).
