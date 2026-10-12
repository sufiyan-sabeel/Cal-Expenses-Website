/* ============================================================================
   Cal Expenses - site behaviour
   Applies CAL_CONFIG to the page, handles the mobile menu, and renders the
   screenshot gallery (with a tidy placeholder while no screenshots exist).
   No dependencies.
   ==========================================================================*/
(function () {
  "use strict";

  var CFG = window.CAL_CONFIG || {};

  /* ------------------------------------------------------------- helpers */
  function fmtBytes(n) {
    if (!n || n <= 0) return "";
    var units = ["B", "KB", "MB", "GB"], i = 0, v = n;
    while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
    return (i === 0 ? v : v.toFixed(1)) + " " + units[i];
  }

  function setText(selector, value) {
    if (value === undefined || value === null) return;
    document.querySelectorAll(selector).forEach(function (el) {
      el.textContent = value;
    });
  }

  function contactUrl() {
    if (CFG.contactEmail) return "mailto:" + CFG.contactEmail;
    if (CFG.repoUrl) return CFG.repoUrl + "/issues";
    return "#";
  }

  /* --------------------------------------------------- apply configuration */
  function applyConfig() {
    // text nodes
    setText('[data-text="productName"]', CFG.productName);
    setText('[data-text="appVersion"]', CFG.appVersion);
    setText('[data-text="apkSize"]', fmtBytes(CFG.apkSizeBytes));
    setText('[data-text="minAndroid"]', CFG.minAndroid);
    setText('[data-text="copyrightYear"]', CFG.copyrightYear);
    setText('[data-text="creator"]', CFG.creator);

    // links
    var hrefs = {
      apkPath: CFG.apkPath,
      repoUrl: CFG.repoUrl,
      appRepoUrl: CFG.appRepoUrl,
      releaseUrl: CFG.releaseUrl,
      contactUrl: contactUrl()
    };
    document.querySelectorAll("[data-href]").forEach(function (el) {
      var key = el.getAttribute("data-href");
      var val = hrefs[key];
      if (val) el.setAttribute("href", val);
    });

    // the APK links get a download hint + the real filename
    document.querySelectorAll('[data-href="apkPath"]').forEach(function (el) {
      if (CFG.apkFileName) el.setAttribute("download", CFG.apkFileName);
    });

    // hide rows we have no verified value for
    document.querySelectorAll('[data-row="apkSize"]').forEach(function (el) {
      if (!CFG.apkSizeBytes) el.hidden = true;
    });

    // contact: show the email only when one is configured
    var emailNodes = document.querySelectorAll("[data-contact-email]");
    emailNodes.forEach(function (el) {
      if (CFG.contactEmail) {
        el.textContent = CFG.contactEmail;
        el.setAttribute("href", "mailto:" + CFG.contactEmail);
      } else {
        el.textContent = "Open an issue on GitHub";
        el.setAttribute("href", CFG.repoUrl ? CFG.repoUrl + "/issues" : "#");
      }
    });

    // canonical + social URL follow the configured site URL
    if (CFG.siteUrl) {
      var canon = document.querySelector('link[rel="canonical"]');
      if (canon) canon.setAttribute("href", CFG.siteUrl);
      var ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) ogUrl.setAttribute("content", CFG.siteUrl);
    }
  }

  /* ------------------------------------------------------- mobile nav menu */
  function initMenu() {
    var toggle = document.getElementById("navToggle");
    var menu = document.getElementById("mobileMenu");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ------------------------------------------------------------- gallery */
  var PLACEHOLDER_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<rect x="3" y="3" width="18" height="18" rx="3"/>' +
    '<path d="M3 15l4.5-4.5 3 3L15 9l6 6"/><circle cx="9" cy="8" r="1.2"/></svg>';

  function emptyTile() {
    var d = document.createElement("div");
    d.className = "shot-empty";
    d.innerHTML =
      '<div class="screen-placeholder">' + PLACEHOLDER_ICON +
      "<strong>Screenshots coming soon</strong>" +
      "Real screenshots of the app will appear here." +
      "</div>";
    return d;
  }

  /* Show the first real screenshot in the hero device frame, if one exists.
     With no screenshots configured the branded panel stays in place. */
  function applyHeroShot() {
    var host = document.getElementById("heroScreen");
    if (!host) return;
    var shots = Array.isArray(CFG.screenshots) ? CFG.screenshots : [];
    if (shots.length === 0) return;

    var img = document.createElement("img");
    img.src = shots[0].src;
    img.alt = shots[0].alt || (CFG.productName + " app screenshot");
    img.addEventListener("error", function () {
      // keep the branded panel rather than showing a broken image
      if (img.parentNode) img.parentNode.removeChild(img);
    });
    host.innerHTML = "";
    host.appendChild(img);
  }

  function renderGallery() {
    var host = document.getElementById("gallery");
    if (!host) return;

    var shots = Array.isArray(CFG.screenshots) ? CFG.screenshots : [];
    host.innerHTML = "";

    if (shots.length === 0) {
      for (var i = 0; i < 3; i++) host.appendChild(emptyTile());
      return;
    }

    shots.forEach(function (shot) {
      var fig = document.createElement("figure");
      fig.className = "shot";
      fig.style.margin = "0";

      var img = document.createElement("img");
      img.src = shot.src;
      img.alt = shot.alt || "";
      img.loading = "lazy";
      img.decoding = "async";

      var cap = document.createElement("figcaption");
      cap.innerHTML = shot.caption
        ? "<strong>" + shot.caption + "</strong>"
        : "";

      // If the image is missing, fall back to the placeholder rather than a broken icon
      img.addEventListener("error", function () {
        var replacement = emptyTile();
        if (fig.parentNode) fig.parentNode.replaceChild(replacement, fig);
      });

      fig.appendChild(img);
      if (shot.caption) fig.appendChild(cap);
      host.appendChild(fig);
    });
  }


  /* ------------------------------------------------------------- motion */
  function initMotion() {
    var reduce = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // scroll progress bar + nav elevation
    var bar = document.createElement("div");
    bar.className = "scroll-progress";
    document.body.appendChild(bar);
    var nav = document.querySelector(".nav");

    function onScroll() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.width = pct.toFixed(2) + "%";
      if (nav) nav.classList.toggle("scrolled", window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    // scroll reveal
    var targets = document.querySelectorAll("[data-reveal]");
    if (!targets.length) return;

    if (reduce || !("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(targets, function (el) { el.classList.add("reveal", "in"); });
      return;
    }

    Array.prototype.forEach.call(targets, function (el) { el.classList.add("reveal"); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = Number(el.getAttribute("data-reveal")) || 0;
        el.style.transitionDelay = delay + "ms";
        el.classList.add("in");
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });

    Array.prototype.forEach.call(targets, function (el) { io.observe(el); });

    // subtle pointer tilt on feature cards - desktop pointers only
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      Array.prototype.forEach.call(document.querySelectorAll(".card"), function (card) {
        card.classList.add("tilt");
        card.addEventListener("pointermove", function (ev) {
          var r = card.getBoundingClientRect();
          var rx = ((ev.clientY - r.top) / r.height - 0.5) * -3;
          var ry = ((ev.clientX - r.left) / r.width - 0.5) * 3;
          card.style.transform = "translateY(-2px) perspective(760px) rotateX(" +
            rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg)";
        });
        card.addEventListener("pointerleave", function () { card.style.transform = ""; });
      });
    }
  }

  /* --------------------------------------------------------------- boot */
  function boot() {
    applyConfig();
    initMenu();
    renderGallery();
    applyHeroShot();
    initMotion();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
