# Screenshots

This folder is empty on purpose.

No real Cal Expenses screenshots were available when the site was built, and the
reference images used for visual inspiration belong to other applications, so
they are deliberately **not** presented as this app's interface.

## How to add real screenshots

1. Take screenshots on your device (Power + Volume Down) or from an emulator.
2. Save them here, e.g. `dashboard.png`, `transactions.png`, `budgets.png`.
3. Open `../assets/js/config.js` and fill in the `screenshots` array:

```js
screenshots: [
  { src: "./screenshots/dashboard.png",    alt: "Home dashboard showing balance, income and expenses", caption: "Home" },
  { src: "./screenshots/transactions.png", alt: "Transactions grouped by date with filter chips",     caption: "Transactions" },
  { src: "./screenshots/budgets.png",      alt: "Monthly budget with per-category progress bars",     caption: "Budgets" }
]
```

That is the only change needed - the gallery on the home page renders whatever is
listed there. Keep images around 1080x2160 (or any 9:19.5 ratio) and under ~300 KB each.
