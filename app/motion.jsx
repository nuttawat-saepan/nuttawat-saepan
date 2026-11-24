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
const FINAL_HOLD = 450;
const FINAL_OUT = 400;
const INK_FADE_START = 300;
const HERO_DURATION = 1650;

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

      scrollPosition += distance * (1 - Math.exp(-elapsed / 180));
      window.scrollTo({ top: scrollPosition, behavior: "instant" });
      updateScrollEffects(scrollPosition);
      scrollFrame = requestAnimationFrame(animateWheelScroll);
    }

    // Mouse wheels step in whole notches (wheelDelta in multiples of 120, or line/page deltas).
    // Trackpads send small deltas the OS has already smoothed; easing those again made the page lag
    // behind the fingers, so they move it one to one.
    function fromTrackpad(event, sideways, delta) {
      if (event.deltaMode !== 0) return false;
      const notches = sideways ? event.wheelDeltaX : event.wheelDeltaY;
      return typeof notches === "number" && notches !== 0 ? notches % 120 !== 0 : !Number.isInteger(delta);
    }

    // Mouse wheel input eases towards a target; trackpad input (vertical or sideways) follows one to
    // one. Panels that scroll inside themselves (concept copy, the example app's feed) get the wheel first.
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
        if (panel && panel.id !== "home") {
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

      if (motion.matches || fromTrackpad(event, sideways, delta)) {
        stopWheelScroll();
        window.scrollTo({ top: scrollTarget, behavior: "instant" });
      } else if (!scrollFrame) {
        scrollFrame = requestAnimationFrame(animateWheelScroll);
      }
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    // A hash in the URL on load (e.g. /#techstack): go to that panel. This must run after the wheel
    // state above exists, since scrollToHash stops any wheel glide first.
    scrollToHash(window.location.hash, "instant");
    document.addEventListener("pointerdown", stopWheelScroll);
    document.addEventListener("keydown", stopWheelScroll);
    horizontal.addEventListener("change", stopWheelScroll);
    horizontal.addEventListener("change", onResize);
    let pending = 0;
    let stopped = false;
    const running = [];

    function stopOpening() {
      stopped = true;
      running.forEach((animation) => animation.cancel());
      window.clearTimeout(pending);
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

    async function runOpening() {
      root.dataset.opening = "counting";
      const [tens, ones] = number.querySelectorAll(".digit-reel");
      const [count, final] = number.querySelectorAll(".opening-count");
      const roll = [{ transform: "translateY(0)" }, { transform: "translateY(-9em)" }];
      await Promise.all([
        play(tens, roll, { duration: REEL_DURATION, delay: REEL_DELAY, easing: REEL_EASE }),
        play(ones, roll, { duration: REEL_DURATION, delay: REEL_DELAY + REEL_STAGGER, easing: REEL_EASE }),
      ]);
      await pause(COUNT_HOLD);
      // Both rows share one grid cell (style.css): "99%" leaves upwards as "100%" arrives from below.
      play(count, [{ transform: "translateY(0)", opacity: 1 }, { transform: "translateY(-100%)", opacity: 0 }], { duration: COUNT_OUT, easing: "cubic-bezier(.5, 0, .75, 0)" });
      await play(final, [{ transform: "translateY(100%)", opacity: 0 }, { transform: "translateY(0)", opacity: 1 }], { duration: FINAL_IN, delay: FINAL_DELAY, easing: "cubic-bezier(.22, 1, .36, 1)" });
      await pause(FINAL_HOLD);
      root.dataset.opening = "exiting";
      play(final, [{ opacity: 1 }, { opacity: 0 }], { duration: FINAL_OUT, easing: "ease-out" });
      await pause(INK_FADE_START);
      root.dataset.opening = "revealing";
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

    function skipOpening(event) {
      if (event.type === "focusin" || event.key === "Escape") stopOpening();
    }

    // The loader plays once per visit (tab session): coming back from a project page skips it.
    let played = false;
    try { played = sessionStorage.getItem("ns-opened") === "1"; sessionStorage.setItem("ns-opened", "1"); } catch {}
    if (motion.matches || played) {
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
        <span className="opening-caption">Web / Apps / Robotics</span>
      </div>
    </div>
  );
}
