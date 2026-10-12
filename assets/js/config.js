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
   * EMPTY ON PURPOSE. No real Cal Expenses screenshots were supplied, and the
   * reference images used for design inspiration belong to other apps, so they
   * are deliberately NOT shown as this app's UI.
   *
   * To add real screenshots: put the images in ./screenshots/ then list them
   * here. The gallery renders whatever is listed and shows a tidy placeholder
   * while the list is empty.
   *
   *   screenshots: [
   *     { src: "./screenshots/dashboard.png", alt: "Home dashboard showing balance, income and expenses", caption: "Home" },
   *     { src: "./screenshots/transactions.png", alt: "Transactions grouped by date with filter chips", caption: "Transactions" }
   *   ],
   * ----------------------------------------------------------------------*/
  screenshots: [],

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
