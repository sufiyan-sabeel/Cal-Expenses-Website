/* ============================================================================
 * Cal Expenses - website configuration
 * ----------------------------------------------------------------------------
 * This is the SINGLE place to change site-wide values. Nothing else in the
 * site hardcodes the product name, URLs, APK path, version or screenshots.
 * Edit the values below and every page updates.
 * ==========================================================================*/
window.CAL_CONFIG = {
  /* ---- Product ---- */
  productName: "Cal Expenses",
  productShort: "Cal Expenses",
  tagline: "Personal expense tracker for Android",
  appVersion: "1.3",
  currencySymbol: "\u20B9",   // used by the interactive demo

  /* ---- Where the site lives (used for canonical + Open Graph URLs) ---- */
  siteUrl: "https://sufiyan-sabeel.github.io/Cal-Expenses-Website/",

  /* ---- APK download ------------------------------------------------------
   * Points at the verified GitHub Release asset for the Android repo, which is
   * the single source of truth for the APK.
   *
   * To self-host the APK on this site instead:
   *   1. drop the .apk into ./downloads/
   *   2. set apkPath to "./downloads/<filename>"
   *   3. set apkFileName to the same filename
   * The relative form keeps working on a GitHub Pages project URL.
   * ----------------------------------------------------------------------*/
  apkPath: "https://github.com/sufiyan-sabeel/Cal-Expenses-Android/releases/download/v1.3/cal-expenses-1.3-debug.apk",
  apkFileName: "cal-expenses-1.3-debug.apk",
  apkSizeBytes: 6925272,          // 6.6 MB - verified from the built APK
  apkSigned: "debug-signed",      // shown honestly in the download note
  minAndroid: "Android 7.0 (API 24) or newer",

  /* ---- Screenshots -------------------------------------------------------
   * Real captures from the Cal Expenses app running on Android. The first entry
   * is also shown inside the hero device frame.
   *
   * To replace or add: drop the image into ./screenshots/ and add an entry here.
   * Keep them around 720px wide (about 9:20) so the gallery stays light.
   * ----------------------------------------------------------------------*/
  screenshots: [
    { src: "./screenshots/home.jpg",
      alt: "Cal Expenses home screen showing the October balance, income and expenses, quick add buttons and a six-month spending chart",
      caption: "Home" },
    { src: "./screenshots/transactions.jpg",
      alt: "Transactions screen with a search field, All/Expenses/Income/Transfers filter chips and entries grouped under Today",
      caption: "Transactions" },
    { src: "./screenshots/budgets.jpg",
      alt: "Budgets screen showing the total monthly budget, the amount remaining and a per-category progress bar",
      caption: "Budgets" },
    { src: "./screenshots/reports.jpg",
      alt: "Reports screen with the month summary, a six-month trend chart and an Export PDF report button",
      caption: "Reports" },
    { src: "./screenshots/cal-ai.jpg",
      alt: "Cal AI assistant screen with suggested prompts and an optional spending-summary switch",
      caption: "Cal AI" }
  ],

  /* ---- Contact -----------------------------------------------------------
   * Leave contactEmail empty to show the GitHub issues link instead.
   * Set it (e.g. "hello@yourdomain.com") once you have an address to publish.
   * ----------------------------------------------------------------------*/
  contactEmail: "",

  /* ---- Links ---- */
  repoUrl: "https://github.com/sufiyan-sabeel/Cal-Expenses-Website",
  appRepoUrl: "https://github.com/sufiyan-sabeel/Cal-Expenses-Android",
  releaseUrl: "https://github.com/sufiyan-sabeel/Cal-Expenses-Android/releases/tag/v1.3",

  /* ---- Footer ---- */
  copyrightYear: "2026",
  creator: "Umaiz Sufiyan"
};
