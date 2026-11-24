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
    const track = document.querySelector(".work-track");
    const stage = track.querySelector(".work-stage");
    const workVideo = stage.querySelector(".screen-intro");
    const cases = [...stage.querySelectorAll(".case")];
    const screens = [...stage.querySelectorAll(".screen-case")];
    const flash = stage.querySelector(".screen-flash");
    const caseButtons = [...stage.querySelectorAll(".case-button")];
    const previews = [...stage.querySelectorAll(".app-preview")];
    const previewToggles = [...stage.querySelectorAll(".preview-toggle")];
    const laptopScreen = stage.querySelector(".laptop-screen");
    const modeBar = stage.querySelector(".screen-modes");
    const modeButtons = [...modeBar.querySelectorAll("[data-screen-mode]")];
    const modePill = modeBar.querySelector(".screen-modes-pill");
    const explored = cases.map(() => new Set([0]));
    const themedPanels = [...viewport.querySelectorAll(":scope > main > [data-theme], :scope > footer[data-theme]")];
    const panels = [...viewport.querySelectorAll(":scope > main > section, :scope > footer")];
    // Written every scroll frame, so they go straight onto the elements that use them: an inherited
    // custom property on an ancestor would re-style every panel and slide beneath it each frame.
    const row = [...viewport.querySelectorAll(":scope > main, :scope > footer")];
    const diveTargets = [stage.querySelector(".work-title"), stage.querySelector(".laptop")];
    let shownX = null;
    let shownDive = null;
    const projects = track.closest("section");
    const horizontal = window.matchMedia("(min-width: 900px) and (min-height: 600px)");
    const clamp = (value, min, max) => Math.max(min, Math.min(value, max));
    let videoVisible = false;
    let stageMode = "intro";
    let activeCase = -1;
    let metrics = { dive: 0, step: 1 };
    // Desktop: the page scrolls vertically and that scroll slides a pinned row of panels sideways,
    // as on the reference. At Projects the row holds still for `pause` px of scroll (the laptop dive,
    // then one step per case), then carries on.
    let layout = { pauseAt: 0, pause: 0, maxX: 0, lefts: new Map() };

    function measureTrack() {
      const style = getComputedStyle(track);
      const width = viewport.clientWidth;
      metrics = {
        dive: (parseFloat(style.getPropertyValue("--dive-len")) || 0) * width,
        step: Math.max(1, (parseFloat(style.getPropertyValue("--case-len")) || 0) * width),
      };
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
      const pause = metrics.dive + metrics.step * cases.length;
      layout = { pauseAt: lefts.get(projects), pause, maxX: Math.max(0, left - width), lefts };
      root.style.setProperty("--travel", `${Math.round(layout.maxX + pause)}px`);
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

    function playCaseIn(index, first) {
      const item = cases[index];
      const easing = "cubic-bezier(.2, .8, .2, 1)";
      item.querySelector(".ticket").animate([
        { opacity: 0, transform: "translateY(-3.5rem) rotate(-6deg)" },
        { offset: 0.7, opacity: 1, transform: "translateY(.4rem) rotate(1.2deg)" },
        { opacity: 1, transform: "none" },
      ], { duration: 750, delay: first ? 120 : 0, easing, fill: "backwards" });
      [...item.querySelector(".case-copy").children].forEach((child, order) => {
        child.animate([
          { opacity: 0, transform: "translateY(.8rem)" },
          { opacity: 1, transform: "none" },
        ], { duration: 550, delay: (first ? 220 : 80) + order * 70, easing, fill: "backwards" });
      });
      flash.animate([{ opacity: 0 }, { opacity: first ? 0.55 : 0.35 }, { opacity: 0 }], { duration: first ? 600 : 420, easing: "ease-out" });
    }

    // The tabs above the laptop: "What's inside" (slides) or "Preview app" for cases that have one.
    function placeModePill() {
      const on = modeButtons.find((button) => button.getAttribute("aria-pressed") === "true");
      if (!on || modeBar.hidden) return;
      modePill.style.width = `${on.offsetWidth}px`;
      modePill.style.transform = `translateX(${on.offsetLeft - modePill.offsetLeft}px)`;
    }

    function setPreview(index) {
      const target = String(index);
      previews.forEach((preview) => { preview.hidden = preview.dataset.previewFor !== target; });
      previewToggles.forEach((toggle) => toggle.setAttribute("aria-pressed", String(toggle.dataset.preview === target)));
      modeButtons.forEach((button) => button.setAttribute("aria-pressed", String((button.dataset.screenMode === "app") === index >= 0)));
      placeModePill();
      if (index < 0) return;
      // On phones the app opens full screen (CSS), so there is nothing to scroll into view.
      if (!motion.matches) flash.animate([{ opacity: 0 }, { opacity: 0.4 }, { opacity: 0 }], { duration: 450, easing: "ease-out" });
    }

    // Phones: the sticky laptop shows whichever case crosses a reading line 60% down the screen.
    // Above the first case, nothing is active and the intro montage plays.
    function setMobileCase(index) {
      stage.toggleAttribute("data-case-shown", index >= 0);
      if (index === activeCase) return;
      activeCase = index;
      cases.forEach((item, order) => item.toggleAttribute("data-active", order === index));
      screens.forEach((screen, order) => screen.toggleAttribute("data-active", order === index));
      updateVideo();
    }

    function setCase(index) {
      if (index === activeCase) return;
      setPreview(-1);
      const first = activeCase === -1;
      activeCase = index;
      cases.forEach((item, order) => item.toggleAttribute("data-active", order === index));
      screens.forEach((screen, order) => screen.toggleAttribute("data-active", order === index));
      modeBar.hidden = !cases[index].hasAttribute("data-preview");
      placeModePill();
      if (stageMode === "case" && !motion.matches) playCaseIn(index, first);
    }

    function onModeClick(event) {
      const wantsApp = event.currentTarget.dataset.screenMode === "app";
      setPreview(wantsApp && activeCase >= 0 ? Number(cases[activeCase].dataset.preview ?? -1) : -1);
    }

    // Slides are drawn on a 1200 × 750 stage; scale them to the screen's real width.
    const scaleSlides = () => laptopScreen.style.setProperty("--stage-scale", (laptopScreen.clientWidth / 1200).toFixed(4));
    const screenResize = new ResizeObserver(scaleSlides);
    screenResize.observe(laptopScreen);

    function updateScrollEffects(scrollPosition = window.scrollY) {
      if (!horizontal.matches) {
        if (sidebar.dataset.theme !== "paper") sidebar.dataset.theme = "paper";
        setDive(null);
        stageMode = "intro";
        if (stage.dataset.mode !== stageMode) stage.dataset.mode = stageMode;
        const line = window.innerHeight * 0.6;
        let reading = cases.findIndex((item) => {
          const rect = item.getBoundingClientRect();
          return rect.top <= line && rect.bottom > line;
        });
        // Past the last case (gaps between cases or below the list) keep the nearest case above.
        if (reading < 0) reading = cases.findLastIndex((item) => item.getBoundingClientRect().bottom <= line);
        setMobileCase(reading);
        return;
      }
      stage.removeAttribute("data-case-shown");

      const y = scrollPosition;
      // Rounded to device pixels: sub-pixel offsets change every frame for nothing visible.
      const x = Math.round(rowOffset(y) * window.devicePixelRatio) / window.devicePixelRatio;
      setRowOffset(x);

      let theme = "paper";
      for (const panel of themedPanels) {
        if ((layout.lefts.get(panel) ?? 0) <= x) theme = panel.dataset.theme;
      }
      if (sidebar.dataset.theme !== theme) sidebar.dataset.theme = theme;

      const distance = y - layout.pauseAt;
      const progress = metrics.dive > 0 ? clamp(distance / metrics.dive, 0, 1) : 1;
      setDive((progress * progress * (3 - 2 * progress)).toFixed(4));

      const mode = progress >= 0.999 ? "case" : "intro";
      if (mode !== stageMode) {
        stageMode = mode;
        stage.dataset.mode = mode;
        if (mode === "case") activeCase = -1;
        else setPreview(-1);
        updateVideo();
      }
      setCase(clamp(Math.floor((distance - metrics.dive) / metrics.step), 0, cases.length - 1));
    }

    // Selecting a concept updates the list, the Explored count, the detail below the list and the
    // laptop screen (the matching slide, or the sketch's demo state). `used` marks a concept that the
    // example app just exercised: the row flashes and the detail reads "Just used".
    function selectConcept(button, { used = false } = {}) {
      const item = button.closest(".case");
      const caseIndex = cases.indexOf(item);
      const screen = screens[caseIndex];
      const order = button.dataset.concept;
      item.querySelectorAll(".concept").forEach((concept) => {
        concept.setAttribute("aria-pressed", String(concept === button));
        concept.setAttribute("aria-expanded", String(concept === button));
      });
      explored[caseIndex].add(Number(order));
      item.querySelectorAll(".concept").forEach((concept) => concept.toggleAttribute("data-seen", explored[caseIndex].has(Number(concept.dataset.concept))));
      item.querySelector(".concept-explored b").textContent = explored[caseIndex].size;
      let shown;
      item.querySelectorAll("[data-concept-detail]").forEach((detail) => {
        detail.hidden = detail.dataset.conceptDetail !== order;
        detail.toggleAttribute("data-used", used && !detail.hidden);
        if (!detail.hidden) shown = detail;
      });
      if (button.dataset.demo) screen.dataset.demo = button.dataset.demo;
      const slideEls = [...screen.querySelectorAll(".sl-slide")];
      const slide = slideEls.findIndex((element) => element.dataset.slide === button.dataset.demo);
      if (slide >= 0) {
        screen.style.setProperty("--slide", slide);
        slideEls.forEach((element, index) => element.classList.toggle("is-active", index === slide));
        screen.querySelectorAll(".sl-pager span").forEach((dot, index) => dot.classList.toggle("is-on", index === slide));
      }
      const chip = screen.querySelector(".screen-chip");
      if (chip) chip.textContent = button.querySelector(".concept-title").textContent;
      if (viewer.open) renderViewer();
      if (motion.matches) return;
      shown.animate([{ opacity: 0, transform: "translateY(.5rem)" }, { opacity: 1, transform: "none" }], { duration: 320, easing: "cubic-bezier(.2, .8, .2, 1)" });
      if (used) {
        button.animate([{ backgroundColor: "rgb(255 59 31 / .32)" }, { backgroundColor: "rgb(255 59 31 / 0)" }], { duration: 900, easing: "ease-out" });
      } else if (stageMode === "case" && slide < 0) {
        flash.animate([{ opacity: 0 }, { opacity: 0.2 }, { opacity: 0 }], { duration: 320, easing: "ease-out" });
      }
    }

    // The example app reports which concept an action demonstrates (scroll, next page, like, sound).
    function onConceptUsed(event) {
      const preview = previews.find((element) => !element.hidden);
      const item = preview && cases.find((element) => element.dataset.preview === preview.dataset.previewFor);
      if (!item) return;
      const button = item.querySelector(`.concept[data-demo="${event.detail?.demo}"]`);
      if (button) selectConcept(button, { used: true });
    }

    function onConceptClick(event) {
      if (event.target.closest(".slide-viewer")) return;
      const toggle = event.target.closest(".preview-toggle");
      if (toggle) {
        setPreview(toggle.getAttribute("aria-pressed") === "true" ? -1 : Number(toggle.dataset.preview));
        return;
      }
      if (event.target.closest(".app-close")) {
        setPreview(-1);
        return;
      }
      const more = event.target.closest(".concept-more");
      if (more) {
        const open = more.getAttribute("aria-expanded") !== "true";
        more.setAttribute("aria-expanded", String(open));
        more.parentElement.querySelector(".concept-list").toggleAttribute("data-expanded", open);
        return;
      }
      // Phones: tapping the sticky screen opens the current slide full size.
      if (event.target.closest(".laptop-screen") && !horizontal.matches && activeCase >= 0 && previews.every((preview) => preview.hidden)) {
        openViewer();
        return;
      }
      const button = event.target.closest(".concept");
      if (!button) return;
      setPreview(-1);
      selectConcept(button);
    }

    // The diagram viewer clones the active slide onto a stage scaled so its text reads at ~14 px;
    // the slide is wider than the phone, so it pans sideways. Arrows step through the concepts.
    const viewer = stage.querySelector(".slide-viewer");
    const viewerTitle = viewer.querySelector(".viewer-title");
    const viewerPan = viewer.querySelector(".viewer-pan");
    const viewerSize = viewer.querySelector(".viewer-size");
    const viewerStage = viewer.querySelector(".viewer-stage");
    const viewerSteps = [...viewer.querySelectorAll("[data-viewer-step]")];
    const pad = (value) => String(value).padStart(2, "0");

    function renderViewer() {
      const item = cases[activeCase];
      const slide = item && screens[activeCase].querySelector(".sl-slide.is-active");
      if (!slide) return false;
      const buttons = [...item.querySelectorAll(".concept")];
      const current = buttons.findIndex((button) => button.getAttribute("aria-pressed") === "true");
      const scale = clamp((window.innerHeight - 200) / 750, 0.5, 0.7);
      viewerSize.style.width = `${Math.round(1200 * scale)}px`;
      viewerSize.style.height = `${Math.round(750 * scale)}px`;
      viewerStage.style.transform = `scale(${scale})`;
      viewerStage.replaceChildren(slide.cloneNode(true));
      viewerTitle.innerHTML = `<b>${pad(current + 1)} / ${pad(buttons.length)}</b> · ${buttons[current].querySelector(".concept-title").textContent}`;
      viewerSteps[0].disabled = current <= 0;
      viewerSteps[1].disabled = current >= buttons.length - 1;
      viewerPan.scrollLeft = 0;
      return true;
    }

    function openViewer() {
      if (renderViewer()) viewer.showModal();
    }

    function onViewerStep(event) {
      const buttons = [...cases[activeCase].querySelectorAll(".concept")];
      const current = buttons.findIndex((button) => button.getAttribute("aria-pressed") === "true");
      const next = buttons[clamp(current + Number(event.currentTarget.dataset.viewerStep), 0, buttons.length - 1)];
      if (next) selectConcept(next);
    }

    const closeViewer = () => viewer.close();
    // Swipe down anywhere on the viewer to close it (sideways drags pan the diagram instead).
    let swipeFrom = null;
    const onViewerDown = (event) => { swipeFrom = { x: event.clientX, y: event.clientY }; };
    const onViewerUp = (event) => {
      if (!swipeFrom) return;
      const dx = event.clientX - swipeFrom.x;
      const dy = event.clientY - swipeFrom.y;
      swipeFrom = null;
      if (dy > 90 && Math.abs(dx) < 70) viewer.close();
    };
    viewer.querySelector(".viewer-close").addEventListener("click", closeViewer);
    viewerSteps.forEach((button) => button.addEventListener("click", onViewerStep));
    viewer.addEventListener("pointerdown", onViewerDown);
    viewer.addEventListener("pointerup", onViewerUp);

    function stepCase(event) {
      const next = activeCase + Number(event.currentTarget.dataset.step);
      let target = layout.pauseAt + metrics.dive + next * metrics.step + metrics.step * 0.35;
      if (next < 0) target = layout.pauseAt;
      if (next >= cases.length) target = scrollTopFor(panels[panels.indexOf(projects) + 1]);
      stopWheelScroll();
      window.scrollTo({ top: target, behavior: scrollBehavior() });
    }

    // In-page links: the panels all sit at the top of the document, so the browser's own anchor jump
    // would go nowhere. Translate the panel's place in the row into a scroll position instead.
    function scrollToHash(hash, behavior) {
      if (!horizontal.matches || !hash || hash === "#") return false;
      let target;
      try { target = document.querySelector(hash); } catch { return false; }
      const panel = target && panels.find((item) => item.contains(target));
      if (!panel) return false;
      // A case (e.g. "Seen in" links from What I do): land inside that case's step of the hold.
      const caseIndex = cases.indexOf(target.closest(".case"));
      const top = caseIndex >= 0 ? layout.pauseAt + metrics.dive + metrics.step * (caseIndex + 0.35) : scrollTopFor(panel);
      stopWheelScroll();
      window.scrollTo({ top, behavior });
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
    caseButtons.forEach((button) => button.addEventListener("click", stepCase));
    stage.addEventListener("click", onConceptClick);
    modeButtons.forEach((button) => button.addEventListener("click", onModeClick));
    window.addEventListener("concept:used", onConceptUsed);
    document.fonts?.ready.then(placeModePill);
    measureTrack();
    updateScrollEffects();

    function updateVideo() {
      if (videoVisible && !motion.matches && stageMode !== "case" && !stage.hasAttribute("data-case-shown")) {
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
        const panel = event.target.closest(".case-copy, .app-feed, section, footer");
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

    if (motion.matches) {
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
      caseButtons.forEach((button) => button.removeEventListener("click", stepCase));
      stage.removeEventListener("click", onConceptClick);
      modeButtons.forEach((button) => button.removeEventListener("click", onModeClick));
      window.removeEventListener("concept:used", onConceptUsed);
      screenResize.disconnect();
      viewer.querySelector(".viewer-close").removeEventListener("click", closeViewer);
      viewerSteps.forEach((button) => button.removeEventListener("click", onViewerStep));
      viewer.removeEventListener("pointerdown", onViewerDown);
      viewer.removeEventListener("pointerup", onViewerUp);
      if (viewer.open) viewer.close();
      stage.removeAttribute("data-case-shown");
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
