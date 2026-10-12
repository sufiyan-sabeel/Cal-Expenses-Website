/* ============================================================================
   Cal Expenses - interactive demo
   ----------------------------------------------------------------------------
   Two honest demos:
     1. A walkthrough of the REAL app screenshots (tap, swipe, arrows, dots).
     2. A small expense toy that shows how the app totals spending by category.
        It uses made-up numbers, stores nothing, and is not connected to the app.
   ==========================================================================*/
(function () {
  "use strict";

  var CFG = window.CAL_CONFIG || {};
  var shots = Array.isArray(CFG.screenshots) ? CFG.screenshots : [];
  var SYM = CFG.currencySymbol || "\u20B9";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function money(n) {
    return SYM + Number(n || 0).toLocaleString("en-IN");
  }

  /* ------------------------------------------------- 1. screen walkthrough */
  function initWalkthrough() {
    var img = document.getElementById("demoImg");
    var dots = document.getElementById("demoDots");
    var cap = document.getElementById("demoCaption");
    var screen = document.getElementById("demoScreen");
    var prev = document.getElementById("demoPrev");
    var next = document.getElementById("demoNext");
    if (!img || !dots || !screen || !shots.length) return;

    var idx = 0;
    var timer = null;
    var userTookOver = false;

    function render(i) {
      idx = (i + shots.length) % shots.length;
      var s = shots[idx];
      img.src = s.src;
      img.alt = s.alt || "Cal Expenses app screen";
      if (cap) cap.textContent = s.caption || "";
      Array.prototype.forEach.call(dots.children, function (b, j) {
        b.setAttribute("aria-selected", j === idx ? "true" : "false");
      });
    }

    function stopAutoplay() {
      userTookOver = true;
      if (timer) { clearInterval(timer); timer = null; }
    }

    function go(i) { render(i); stopAutoplay(); }

    // dots
    shots.forEach(function (s, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", "Show " + (s.caption || "screen " + (i + 1)));
      b.addEventListener("click", function () { go(i); });
      dots.appendChild(b);
    });

    if (prev) prev.addEventListener("click", function () { go(idx - 1); });
    if (next) next.addEventListener("click", function () { go(idx + 1); });

    // swipe on touch screens
    var startX = null;
    screen.addEventListener("touchstart", function (e) {
      startX = e.touches[0].clientX;
    }, { passive: true });
    screen.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
      startX = null;
    }, { passive: true });

    // keyboard
    screen.setAttribute("tabindex", "0");
    screen.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { go(idx + 1); }
      else if (e.key === "ArrowLeft") { go(idx - 1); }
    });

    render(0);

    // gentle autoplay until the visitor takes over
    if (!reduce) {
      timer = setInterval(function () {
        if (userTookOver) return;
        render(idx + 1);
      }, 4200);
    }
  }

  /* ------------------------------------------------ 2. expense toy (demo) */
  function initCalculator() {
    var catsWrap = document.getElementById("demoCats");
    var barsWrap = document.getElementById("demoBars");
    var amount = document.getElementById("demoAmount");
    var out = document.getElementById("demoAmountOut");
    var totalEl = document.getElementById("demoTotal");
    var addBtn = document.getElementById("demoAdd");
    var resetBtn = document.getElementById("demoReset");
    var calc = document.querySelector(".demo-calc");
    if (!catsWrap || !barsWrap || !amount || !totalEl || !addBtn) return;

    var cats = ["Food", "Transport", "Bills", "Shopping"];
    var totals = {};
    var current = cats[0];
    cats.forEach(function (c) { totals[c] = 0; });

    cats.forEach(function (c, i) {
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "demo-cat";
      chip.textContent = c;
      chip.setAttribute("aria-pressed", i === 0 ? "true" : "false");
      chip.addEventListener("click", function () {
        current = c;
        Array.prototype.forEach.call(catsWrap.children, function (b) {
          b.setAttribute("aria-pressed", b === chip ? "true" : "false");
        });
      });
      catsWrap.appendChild(chip);

      var bar = document.createElement("div");
      bar.className = "bar";
      bar.innerHTML = "<i></i><span>" + c + "</span>";
      barsWrap.appendChild(bar);
    });

    function render() {
      var total = cats.reduce(function (a, c) { return a + totals[c]; }, 0);
      totalEl.textContent = money(total);

      var max = Math.max.apply(null, cats.map(function (c) { return totals[c]; }));
      Array.prototype.forEach.call(barsWrap.children, function (bar, i) {
        var v = totals[cats[i]];
        var pct = (max > 0 && v > 0) ? Math.max(8, (v / max) * 100) : 4;
        bar.querySelector("i").style.height = pct + "%";
        bar.title = cats[i] + ": " + money(v);
      });
    }

    function syncOutput() {
      if (out) out.textContent = money(Number(amount.value) || 0);
    }

    amount.addEventListener("input", syncOutput);

    addBtn.addEventListener("click", function () {
      var amt = Number(amount.value) || 0;
      if (amt <= 0) return;
      totals[current] += amt;
      render();

      if (!reduce && calc) {
        var fly = document.createElement("div");
        fly.className = "demo-fly";
        fly.textContent = "+" + money(amt);
        calc.appendChild(fly);
        setTimeout(function () {
          if (fly.parentNode) fly.parentNode.removeChild(fly);
        }, 950);
      }
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        cats.forEach(function (c) { totals[c] = 0; });
        render();
      });
    }

    syncOutput();
    render();
  }

  function boot() {
    initWalkthrough();
    initCalculator();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
