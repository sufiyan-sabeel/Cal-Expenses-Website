# downloads/

The site's Download button points at the verified GitHub Release asset:

```
https://github.com/sufiyan-sabeel/Cal-Expenses-Android/releases/download/v1.3/cal-expenses-1.3-debug.apk
```

That keeps one source of truth for the APK instead of a second copy here.

## To self-host the APK on this site instead

1. Copy the APK into this folder, e.g. `downloads/cal-expenses-1.3-debug.apk`.
2. In `../assets/js/config.js` set:

   ```js
   apkPath: "./downloads/cal-expenses-1.3-debug.apk",
   apkFileName: "cal-expenses-1.3-debug.apk",
   ```

3. Update `apkSizeBytes` to the new file size.

Relative paths like this keep working on a GitHub Pages project URL
(`https://<user>.github.io/<repo>/`).
