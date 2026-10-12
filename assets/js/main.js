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
    setText('[data-text="creatorName"]', CFG.creatorName);
    setText('[data-text="creatorInitials"]', CFG.creatorInitials);
    setText('[data-text="creatorRole"]', CFG.creatorRole);
    setText('[data-text="creatorBio"]', CFG.creatorBio);

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

    // Canonical + social metadata follow the configured site URL, so the domain
    // lives in exactly one place. Note that social crawlers do not run
    // JavaScript: the values hard-coded in the HTML are what they actually
    // read, and these lines only keep them in step if the domain changes here.
    if (CFG.siteUrl) {
      var canon = document.querySelector('link[rel="canonical"]');
      if (canon) canon.setAttribute("href", CFG.siteUrl);

      var ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) ogUrl.setAttribute("content", CFG.siteUrl);

      if (CFG.ogImagePath) {
        var abs = CFG.siteUrl.replace(/\/?$/, "/") + CFG.ogImagePath.replace(/^\//, "");
        ["og:image", "og:image:secure_url"].forEach(function (prop) {
          var m = document.querySelector('meta[property="' + prop + '"]');
          if (m) m.setAttribute("content", abs);
        });
        var tw = document.querySelector('meta[name="twitter:image"]');
        if (tw) tw.setAttribute("content", abs);
      }
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
      img.decoding = "async";
      img.width = 720;
      img.height = 1608;

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

    // ---- 3D scroll ------------------------------------------------------
    // Sections rise out of the page and straighten as they enter the viewport,
    // the hero device drifts with the scroll and tilts toward the pointer, and
    // gallery cards lean toward the centre. Everything is written as inline
    // transforms from JS, so with no scripting the page renders flat and fully
    // visible. Skipped entirely under prefers-reduced-motion.
    var items3d = Array.prototype.slice.call(document.querySelectorAll("[data-3d]"));
    var device = document.querySelector(".hero .device");
    var shots = Array.prototype.slice.call(document.querySelectorAll(".shot"));
    var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    var pointer = { x: 0, y: 0 };

    function clamp01(v) { return v < 0 ? 0 : (v > 1 ? 1 : v); }

    function paint() {
      var vh = window.innerHeight;

      // sections: rise + straighten
      for (var i = 0; i < items3d.length; i++) {
        var el = items3d[i];
        var r = el.getBoundingClientRect();
        if (r.bottom < -240 || r.top > vh + 240) continue;
        var p = clamp01((vh - r.top) / (vh - vh * 0.45));
        var e = 1 - p;
        el.style.transform =
          "perspective(1000px) rotateX(" + (e * 13).toFixed(2) + "deg)" +
          " translateY(" + (e * 58).toFixed(1) + "px)" +
          " scale(" + (0.94 + p * 0.06).toFixed(4) + ")";
        el.style.opacity = (0.15 + p * 0.85).toFixed(3);
      }

      // hero device: parallax + pointer tilt
      if (device) {
        var dy = Math.min(window.scrollY, 900) * -0.075;
        device.style.transform =
          "perspective(1000px)" +
          " rotateX(" + (-pointer.y * 5).toFixed(2) + "deg)" +
          " rotateY(" + (pointer.x * 7).toFixed(2) + "deg)" +
          " translateY(" + dy.toFixed(1) + "px)";
      }

      // gallery cards lean toward the centre of the viewport
      if (finePointer) {
        var cx = window.innerWidth / 2;
        for (var j = 0; j < shots.length; j++) {
          var s = shots[j];
          var sr = s.getBoundingClientRect();
          if (sr.bottom < -120 || sr.top > vh + 120) continue;
          var dx = ((sr.left + sr.width / 2) - cx) / window.innerWidth;
          s.style.transform = "perspective(800px) rotateY(" + (dx * 11).toFixed(2) + "deg)";
        }
      }
    }

    var ticking = false;
    function onFrame() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () { ticking = false; paint(); });
    }

    if (!reduce) {
      window.addEventListener("scroll", onFrame, { passive: true });
      window.addEventListener("resize", onFrame);
      window.addEventListener("pointermove", function (ev) {
        pointer.x = (ev.clientX / window.innerWidth) - 0.5;
        pointer.y = (ev.clientY / window.innerHeight) - 0.5;
        onFrame();
      }, { passive: true });

      // pointer tilt on feature cards, desktop pointers only
      if (finePointer) {
        Array.prototype.forEach.call(document.querySelectorAll(".card"), function (card) {
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

      paint();
    }
  }

  /* ------------------------------------------------------ smooth scrolling */
  /* A small, dependency-free momentum scroller.
   *
   * - Wheel scrolling on desktop is eased toward the target with a
   *   frame-rate independent exponential curve, which gives the page the
   *   "glide" feel of a premium product site.
   * - In-page anchor links ease to their target on every device, instead of
   *   the browser's abrupt jump.
   * - Touch dragging is deliberately NOT hijacked: phones already have native
   *   momentum, and intercepting it makes scrolling feel worse, not better.
   * - Skipped entirely under prefers-reduced-motion, and if this script never
   *   runs the stylesheet's own scroll-behavior:smooth still applies.
   */
  function initSmoothScroll() {
    var reduce = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    // Our own scrollTo() calls must be instant, otherwise the stylesheet's
    // scroll-behavior:smooth would animate each step and fight this loop.
    document.documentElement.style.scrollBehavior = "auto";

    var maxY = function () {
      return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    };

    var target = window.scrollY;
    var current = target;
    var running = false;
    var last = 0;

    function loop(ts) {
      if (!last) last = ts;
      var dt = Math.min(0.05, (ts - last) / 1000);   // clamp after a tab switch
      last = ts;

      var k = 1 - Math.exp(-dt * 8.5);               // frame-rate independent
      current += (target - current) * k;

      if (Math.abs(target - current) < 0.5) {
        current = target;
        window.scrollTo(0, Math.round(current));
        running = false;
        last = 0;
        return;
      }
      window.scrollTo(0, current);
      window.requestAnimationFrame(loop);
    }

    function glide(y) {
      target = Math.max(0, Math.min(y, maxY()));
      if (!running) {
        current = window.scrollY;
        running = true;
        last = 0;
        window.requestAnimationFrame(loop);
      }
    }

    // stay in sync when something else scrolls (keyboard, scrollbar, browser)
    window.addEventListener("scroll", function () {
      if (!running) { target = window.scrollY; current = window.scrollY; }
    }, { passive: true });

    // ---- eased wheel scrolling ----
    // No pointer-type gate is needed: touch dragging never emits wheel events,
    // so phone scrolling keeps its native momentum either way.
    window.addEventListener("wheel", function (ev) {
      // let the browser handle pinch-zoom and horizontal-only gestures
      if (ev.ctrlKey) return;
      if (Math.abs(ev.deltaX) > Math.abs(ev.deltaY)) return;
      ev.preventDefault();
      glide(target + ev.deltaY);
    }, { passive: false });

    // ---- eased anchor navigation (all devices) ----
    Array.prototype.forEach.call(document.querySelectorAll('a[href^="#"]'), function (a) {
      a.addEventListener("click", function (ev) {
        var id = (a.getAttribute("href") || "").slice(1);
        var el = id ? document.getElementById(id) : null;
        if (!el) return;

        ev.preventDefault();
        var nav = document.querySelector(".nav");
        var offset = (nav ? nav.offsetHeight : 0) + 10;
        glide(el.getBoundingClientRect().top + window.scrollY - offset);

        if (window.history && window.history.pushState) {
          window.history.pushState(null, "", "#" + id);
        }
        // keep keyboard focus in step with the scroll, without moving the view
        el.setAttribute("tabindex", "-1");
        el.focus({ preventScroll: true });
      });
    });
  }

  /* --------------------------------------------------------------- boot */
  function boot() {
    applyConfig();
    initMenu();
    renderGallery();
    applyHeroShot();
    initMotion();
    initSmoothScroll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
