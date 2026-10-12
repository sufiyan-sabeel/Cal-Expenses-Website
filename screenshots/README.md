# screenshots/

Real captures from the Cal Expenses app running on Android:

| File | Screen |
| --- | --- |
| `home.jpg` | Home dashboard |
| `transactions.jpg` | Transactions |
| `budgets.jpg` | Budgets |
| `reports.jpg` | Reports |
| `cal-ai.jpg` | Cal AI assistant |

They are listed in `../assets/js/config.js` under `screenshots`. The first entry is also
shown inside the hero device frame, and the captions come from each entry's `caption`.

## Replacing or adding screenshots

1. Save the new image here (roughly 720px wide, 9:20 ratio, under ~120 KB).
2. Add or edit the matching entry in `CAL_CONFIG.screenshots`:

```js
{ src: "./screenshots/goals.jpg",
  alt: "Goals screen showing savings goals with percentage progress",
  caption: "Goals" }
```

Keep the `alt` text descriptive — it is what screen-reader users hear.
