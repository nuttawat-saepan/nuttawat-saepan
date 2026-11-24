"use client";

import { useEffect, useRef } from "react";

// Slot-machine counter, timed to the user's reference video (2026-11-23 23-40-10.mp4): two digit
// wheels each slide 0 → 9 in one ease-in-out move, the ones wheel a beat after the tens; "99%" holds,
// then slides up and fades as "100%" rises in; "100%" fades out and the ink fades off the page.
const REEL_DELAY = 1000;
const REEL_DURATION = 1300;
const REEL_STAGGER = 250;
const REEL_EASE = "cubic-bezier(.65, 0, .35, 1)";
const COUNT_HOLD = 1000;
const COUNT_OUT = 300;
const FINAL_DELAY = 150;
const FINAL_IN = 400;
const FINAL_OUT = 400;
const INK_FADE_START = 300;
const HERO_DURATION = 1650;
const SCROLL_EASE_MS = 240;
// Hairline under the counter (concept B, timed to the reference 2026-11-24 19-42-49.mp4): the rule
// draws in, a fill runs to 97% with the wheels, then completes at "100%"; afterwards the fill clears
// off to the right and the rule retracts. The tag at the fill's tip names the stage it has reached.
const RULE_IN = 420;
const RULE_DELAY = 300;
const LINE_EASE = "cubic-bezier(.7, 0, .15, 1)";
const FILL_CLEAR = 140;
const RULE_GAP = 150;
const RULE_OUT = 300;
const STAGES = [[0, "fetching web"], [.34, "building apps"], [.67, "booting robotics"]];

// The loader plays on every full load of home (a reload included) but not when home is reached by
// navigating inside the site: this module outlives client-side navigation, a reload starts it fresh.
let openedInThisDocument = false;

export default function Opening() {
  const overlay = useRef(null);
  const counter = useRef(null);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;
    const intro = overlay.current;
    const number = counter.current;
    const viewport = document.querySelector(".portfolio-viewport");
    const sidebar = document.querySelector(".site-header");
    const work = document.querySelector("#work");
    const workVideo = work.querySelector(".tw-video");
    const themedPanels = [...viewport.querySelectorAll(":scope > main > [data-theme], :scope > footer[data-theme]")];
    const panels = [...viewport.querySelectorAll(":scope > main > section, :scope > footer")];
    // Written every scroll frame, so they go straight onto the elements that use them: an inherited
    // custom property on an ancestor would re-style every panel beneath it each frame.
    const row = [...viewport.querySelectorAll(":scope > main, :scope > footer")];
    const diveTargets = [work.querySelector(".tw-film"), ...work.querySelectorAll(".tw-words span")];
    let shownX = null;
    let shownDive = null;
    const horizontal = window.matchMedia("(min-width: 900px) and (min-height: 600px)");
    const clamp = (value, min, max) => Math.max(min, Math.min(value, max));
    let videoVisible = false;
    let dive = 0;
    // Desktop: the page scrolls vertically and that scroll slides a pinned row of panels sideways,
    // as on the reference. At THE WORK the row holds still for `pause` px of scroll while the film
    // grows to fill the screen, then carries on.
    let layout = { pauseAt: 0, pause: 0, maxX: 0, lefts: new Map() };

    function measureTrack() {
      const width = viewport.clientWidth;
      dive = (parseFloat(getComputedStyle(work).getPropertyValue("--dive-len")) || 0) * width;
      if (!horizontal.matches) {
        layout = { pauseAt: 0, pause: 0, maxX: 0, lefts: new Map() };
        root.style.removeProperty("--travel");
        setRowOffset(null);
        setDive(null);
        return;
      }
      const lefts = new Map();
      let left = 0;
      for (const panel of panels) {
        lefts.set(panel, left);
        left += panel.offsetWidth;
      }
      layout = { pauseAt: lefts.get(work), pause: dive, maxX: Math.max(0, left - width), lefts };
      root.style.setProperty("--travel", `${Math.round(layout.maxX + dive)}px`);
    }

    const rowOffset = (y) => clamp(y <= layout.pauseAt ? y : y <= layout.pauseAt + layout.pause ? layout.pauseAt : y - layout.pause, 0, layout.maxX);
    const scrollTopFor = (panel) => {
      const left = layout.lefts.get(panel) ?? 0;
      return left <= layout.pauseAt ? left : left + layout.pause;
    };
    const scrollBehavior = () => (motion.matches ? "instant" : "smooth");

    // null clears the inline value (phone layout, unmount).
    function setRowOffset(x) {
      if (x === shownX) return;
      shownX = x;
      row.forEach((element) => {
        if (x === null) element.style.removeProperty("transform");
        else element.style.transform = `translate3d(${-x}px, 0, 0)`;
      });
    }

    function setDive(value) {
      if (value === shownDive) return;
      shownDive = value;
      diveTargets.forEach((element) => {
        if (value === null) element.style.removeProperty("--dive");
        else element.style.setProperty("--dive", value);
      });
    }

    function updateScrollEffects(scrollPosition = window.scrollY) {
      if (!horizontal.matches) {
        if (sidebar.dataset.theme !== "paper") sidebar.dataset.theme = "paper";
        setDive(null);
        return;
      }

      const y = scrollPosition;
      // Rounded to device pixels: sub-pixel offsets change every frame for nothing visible.
      const x = Math.round(rowOffset(y) * window.devicePixelRatio) / window.devicePixelRatio;
      setRowOffset(x);

      let theme = "paper";
      for (const panel of themedPanels) {
        if ((layout.lefts.get(panel) ?? 0) <= x) theme = panel.dataset.theme;
      }
      if (sidebar.dataset.theme !== theme) sidebar.dataset.theme = theme;

      // THE WORK: the film's growth follows the held stretch linearly, like the reference.
      const progress = dive > 0 ? clamp((y - layout.pauseAt) / dive, 0, 1) : 1;
      setDive(progress.toFixed(4));
    }

    // In-page links: the panels all sit at the top of the document, so the browser's own anchor jump
    // would go nowhere. Translate the panel's place in the row into a scroll position instead.
    function scrollToHash(hash, behavior) {
      if (!horizontal.matches || !hash || hash === "#") return false;
      let target;
      try { target = document.querySelector(hash); } catch { return false; }
      const panel = target && panels.find((item) => item.contains(target));
      if (!panel) return false;
      stopWheelScroll();
      window.scrollTo({ top: scrollTopFor(panel), behavior });
      return true;
    }

    function onAnchorClick(event) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest?.('a[href^="#"]');
      if (!link || !scrollToHash(link.hash, scrollBehavior())) return;
      event.preventDefault();
      if (link.hash !== window.location.hash) history.pushState(null, "", link.hash);
    }

    function onPopState() {
      scrollToHash(window.location.hash, scrollBehavior());
    }

    function onResize() {
      measureTrack();
      updateScrollEffects();
    }

    const viewportResize = new ResizeObserver(onResize);
    viewportResize.observe(viewport);
    function onScroll() {
      if (!scrollFrame) updateScrollEffects();
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onAnchorClick);
    window.addEventListener("popstate", onPopState);
    measureTrack();
    updateScrollEffects();

    function updateVideo() {
      if (videoVisible && !motion.matches) {
        workVideo.play().catch(() => {});
      } else {
        workVideo.pause();
      }
    }

    const workObserver = new IntersectionObserver(([entry]) => {
      videoVisible = entry.isIntersecting;
      updateVideo();
    });
    workObserver.observe(workVideo);

    var scrollFrame = 0;
    let scrollPosition = window.scrollY;
    let scrollTarget = 0;
    let previousFrameTime = 0;

    function stopWheelScroll() {
      cancelAnimationFrame(scrollFrame);
      scrollFrame = 0;
      previousFrameTime = 0;
    }

    const maxScrollTop = () => document.documentElement.scrollHeight - window.innerHeight;

    function animateWheelScroll(now) {
      scrollTarget = Math.min(scrollTarget, maxScrollTop());
      const distance = scrollTarget - scrollPosition;
      const elapsed = previousFrameTime ? now - previousFrameTime : 16;
      previousFrameTime = now;

      if (Math.abs(distance) < 1) {
        window.scrollTo({ top: scrollTarget, behavior: "instant" });
        updateScrollEffects(scrollTarget);
        stopWheelScroll();
        return;
      }

      scrollPosition += distance * (1 - Math.exp(-elapsed / SCROLL_EASE_MS));
      window.scrollTo({ top: scrollPosition, behavior: "instant" });
      updateScrollEffects(scrollPosition);
      scrollFrame = requestAnimationFrame(animateWheelScroll);
    }

    // Ease all desktop wheel input, including precision mice and sideways trackpad gestures.
    // wheelDelta cannot reliably identify the device: the old heuristic bypassed smoothing for
    // precision wheels too. Panels that can scroll inside themselves still get the wheel first.
    function onWheel(event) {
      const opening = root.dataset.opening && root.dataset.opening !== "revealing";
      if (!horizontal.matches || event.ctrlKey || opening || event.target.closest?.(".fullscreen-menu")) {
        stopWheelScroll();
        return;
      }

      const sideways = Math.abs(event.deltaX) > Math.abs(event.deltaY);
      const delta = sideways ? event.deltaX : event.deltaY;
      if (!sideways) {
        const panel = event.target.closest("section, footer");
        // Only a panel that can scroll itself takes the wheel. A clipped panel (THE WORK) can still
        // report a taller scrollHeight from content it clips, which used to hand the wheel to the
        // browser there and drop the smoothing.
        const scrolls = panel && /auto|scroll/.test(getComputedStyle(panel).overflowY);
        if (scrolls && panel.id !== "home") {
          const remaining = panel.scrollHeight - panel.clientHeight - panel.scrollTop;
          if (delta > 0 ? remaining > 1 : panel.scrollTop > 1) {
            stopWheelScroll();
            return;
          }
        }
      }

      event.preventDefault();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
      if (!scrollFrame) scrollPosition = window.scrollY;
      const base = scrollFrame ? scrollTarget : scrollPosition;
      scrollTarget = clamp(base + delta * unit, 0, maxScrollTop());

      if (motion.matches) {
        stopWheelScroll();
        window.scrollTo({ top: scrollTarget, behavior: "instant" });
      } else if (!scrollFrame) {
        scrollFrame = requestAnimationFrame(animateWheelScroll);
      }
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    // Refresh starts Home at the first panel, even if a menu click left a section hash in the URL.
    // Keep direct section links working on a new visit. Run after the wheel state is initialized,
    // since scrollToHash stops any wheel glide first.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (performance.getEntriesByType("navigation")[0]?.type === "reload") {
      if (window.location.hash) history.replaceState(history.state, "", location.pathname + location.search);
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      updateScrollEffects(0);
    } else {
      scrollToHash(window.location.hash, "instant");
    }
    document.addEventListener("pointerdown", stopWheelScroll);
    document.addEventListener("keydown", stopWheelScroll);
    horizontal.addEventListener("change", stopWheelScroll);
    horizontal.addEventListener("change", onResize);
    let pending = 0;
    let stageFrame = 0;
    let stopped = false;
    const running = [];

    function stopOpening() {
      stopped = true;
      running.forEach((animation) => animation.cancel());
      window.clearTimeout(pending);
      cancelAnimationFrame(stageFrame);
      intro.hidden = true;
      delete root.dataset.opening;
    }

    // Each step resolves only while the opening is still playing, so a skip mid-way ends the chain.
    async function step(promise) {
      await promise;
      if (stopped) throw new Error("opening stopped");
    }

    function play(element, keyframes, options) {
      const animation = element.animate(keyframes, { fill: "forwards", ...options });
      running.push(animation);
      return step(animation.finished);
    }

    function pause(duration) {
      return step(new Promise((resolve) => { pending = window.setTimeout(resolve, duration); }));
    }

    // For moves nothing waits on: a skip cancels them, which must not surface as an unhandled rejection.
    function fire(element, keyframes, options) {
      play(element, keyframes, options).catch(() => {});
    }

    // Re-labels the tag as the fill passes each stage; --p is the fill's progress (0–1).
    function followStages(line, tag) {
      let shown = 0;
      (function check() {
        const progress = parseFloat(getComputedStyle(line).getPropertyValue("--p")) || 0;
        const stage = STAGES.findLastIndex(([from]) => progress >= from);
        if (stage !== shown) {
          shown = stage;
          tag.textContent = STAGES[stage][1];
        }
        stageFrame = requestAnimationFrame(check);
      })();
    }

    async function runOpening() {
      root.dataset.opening = "counting";
      const [tens, ones] = number.querySelectorAll(".digit-reel");
      const [count, final] = number.querySelectorAll(".opening-count");
      const line = intro.querySelector(".opening-line");
      const rule = line.querySelector(".opening-rule");
      const fill = line.querySelector(".opening-fill");
      const tag = line.querySelector(".opening-tag");
      const roll = [{ transform: "translateY(0)" }, { transform: "translateY(-9em)" }];

      fire(rule, [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { duration: RULE_IN, delay: RULE_DELAY, easing: "cubic-bezier(.16, 1, .3, 1)" });
      fire(tag, [{ opacity: 0 }, { opacity: 1 }], { duration: 150, delay: RULE_DELAY + 80 });
      // The fill spans the wheels' whole run (tens start → ones land) and stops short at 97%.
      fire(line, [{ "--p": 0 }, { "--p": .97 }], { duration: REEL_STAGGER + REEL_DURATION, delay: REEL_DELAY, easing: LINE_EASE });
      followStages(line, tag);
      await Promise.all([
        play(tens, roll, { duration: REEL_DURATION, delay: REEL_DELAY, easing: REEL_EASE }),
        play(ones, roll, { duration: REEL_DURATION, delay: REEL_DELAY + REEL_STAGGER, easing: REEL_EASE }),
      ]);
      cancelAnimationFrame(stageFrame);
      // The wait at 99: the tag owns up to the last 1% with a blinking red dot.
      tag.innerHTML = 'shipping the last 1% <b class="opening-blink">●</b>';
      await pause(COUNT_HOLD);
      tag.textContent = "ready";
      fire(line, [{ "--p": .97 }, { "--p": 1 }], { duration: 150, easing: "ease-out" });
      // Both rows share one grid cell (style.css): "99%" leaves upwards as "100%" arrives from below.
      fire(count, [{ transform: "translateY(0)", opacity: 1 }, { transform: "translateY(-100%)", opacity: 0 }], { duration: COUNT_OUT, easing: "cubic-bezier(.5, 0, .75, 0)" });
      await play(final, [{ transform: "translateY(100%)", opacity: 0 }, { transform: "translateY(0)", opacity: 1 }], { duration: FINAL_IN, delay: FINAL_DELAY, easing: "cubic-bezier(.22, 1, .36, 1)" });
      // The line leaves as in the reference: fill clears off to the right, then the rule retracts.
      fill.style.transformOrigin = "100% 50%";
      await play(fill, [{ transform: "scaleX(1)" }, { transform: "scaleX(0)" }], { duration: FILL_CLEAR, easing: "cubic-bezier(.5, 0, .75, 0)" });
      await pause(RULE_GAP);
      fire(tag, [{ opacity: 1 }, { opacity: 0 }], { duration: 120, delay: RULE_OUT - 120 });
      rule.style.transformOrigin = "100% 50%";
      await play(rule, [{ transform: "scaleX(1)" }, { transform: "scaleX(0)" }], { duration: RULE_OUT, easing: "cubic-bezier(.65, 0, .35, 1)" });
      root.dataset.opening = "exiting";
      play(final, [{ opacity: 1 }, { opacity: 0 }], { duration: FINAL_OUT, easing: "ease-out" });
      await pause(INK_FADE_START);
      root.dataset.opening = "revealing";
      markPlayed();
      await pause(HERO_DURATION);
      stopOpening();
    }

    const profile = document.querySelector("#profile");
    if (!motion.matches) root.dataset.motion = "";
    const profileObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      profile.toggleAttribute("data-entered", true);
      profileObserver.disconnect();
    }, { threshold: horizontal.matches ? 0.6 : 0.25 });
    profileObserver.observe(profile);

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        if (!motion.matches) entry.target.classList.add("reveal-in");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.15 });

    document.querySelectorAll("[data-reveal]").forEach((node) => observer.observe(node));

    function updatePreference(event) {
      onResize();
      updateVideo();
      if (event.matches) {
        stopOpening();
        stopWheelScroll();
      }
    }

    function markPlayed() {
      openedInThisDocument = true;
    }

    function skipOpening(event) {
      if (!root.dataset.opening) return;
      if (event.type === "focusin" || event.key === "Escape") {
        markPlayed();
        stopOpening();
      }
    }

    // Skip it when home is reached from inside the site: either it already played in this document,
    // or the visit began on another page (a project page) and home was reached by a link. The flag is
    // set once the loader finishes or is skipped, not on mount, so React's dev double mount still plays it.
    let enteredElsewhere = false;
    try { enteredElsewhere = new URL(performance.getEntriesByType("navigation")[0].name).pathname !== "/"; } catch {}
    if (motion.matches || openedInThisDocument || enteredElsewhere) {
      stopOpening();
    } else {
      intro.hidden = false;
      runOpening().catch(() => {});
    }

    motion.addEventListener("change", updatePreference);
    document.addEventListener("focusin", skipOpening);
    document.addEventListener("keydown", skipOpening);
    return () => {
      stopOpening();
      observer.disconnect();
      profileObserver.disconnect();
      delete root.dataset.motion;
      stopWheelScroll();
      viewportResize.disconnect();
      workObserver.disconnect();
      workVideo.pause();
      setDive(null);
      setRowOffset(null);
      root.style.removeProperty("--travel");
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onAnchorClick);
      window.removeEventListener("popstate", onPopState);
      sidebar.dataset.theme = "paper";
      window.removeEventListener("wheel", onWheel);
      document.removeEventListener("pointerdown", stopWheelScroll);
      document.removeEventListener("keydown", stopWheelScroll);
      horizontal.removeEventListener("change", stopWheelScroll);
      horizontal.removeEventListener("change", onResize);
      motion.removeEventListener("change", updatePreference);
      document.removeEventListener("focusin", skipOpening);
      document.removeEventListener("keydown", skipOpening);
    };
  }, []);

  return (
    <div ref={overlay} className="opening" aria-hidden="true">
      <div className="frame opening-inner">
        <div className="opening-head">
        <div className="opening-mask">
          <div className="opening-stack" ref={counter}>
            <div className="opening-count">
              {["tens", "ones"].map((place) => (
                <span className="digit-window" key={place}>
                  <span className="digit-reel">
                    {Array.from({ length: 10 }, (_, digit) => <span className="digit" key={digit}>{digit}</span>)}
                  </span>
                </span>
              ))}
              <span className="opening-percent">%</span>
            </div>
            <div className="opening-count">
              {[1, 0, 0].map((digit, index) => (
                <span className="digit-window" key={index}><span className="digit">{digit}</span></span>
              ))}
              <span className="opening-percent">%</span>
            </div>
          </div>
        </div>
        {/* Hairline under the counter: a fill runs with the wheels and its tag names each stage. */}
        <div className="opening-line">
          <span className="opening-rule" />
          <span className="opening-fill" />
          <span className="opening-tag">{STAGES[0][1]}</span>
        </div>
        </div>
        <span className="opening-caption">Web / Apps / Robotics</span>
      </div>
    </div>
  );
}
