"use client";

import { useEffect, useRef } from "react";

const ENTRANCE_DURATION = 700;
const COUNT_DURATION = 2800;
const HOLD_DURATION = 450;
const EXIT_DURATION = 350;
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
        viewport.style.removeProperty("--x");
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
      if (!horizontal.matches) stage.querySelector(".laptop").scrollIntoView({ behavior: motion.matches ? "auto" : "smooth", block: "center" });
      if (!motion.matches) flash.animate([{ opacity: 0 }, { opacity: 0.4 }, { opacity: 0 }], { duration: 450, easing: "ease-out" });
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

    function updateScrollEffects() {
      if (!horizontal.matches) {
        sidebar.dataset.theme = "paper";
        stage.style.removeProperty("--dive");
        stageMode = "intro";
        stage.dataset.mode = stageMode;
        return;
      }

      const y = window.scrollY;
      const x = Math.round(rowOffset(y));
      viewport.style.setProperty("--x", `${-x}px`);

      let theme = "paper";
      for (const panel of themedPanels) {
        if ((layout.lefts.get(panel) ?? 0) <= x) theme = panel.dataset.theme;
      }
      sidebar.dataset.theme = theme;

      const distance = y - layout.pauseAt;
      const progress = metrics.dive > 0 ? clamp(distance / metrics.dive, 0, 1) : 1;
      stage.style.setProperty("--dive", (progress * progress * (3 - 2 * progress)).toFixed(4));

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
      item.querySelectorAll(".concept").forEach((concept) => concept.setAttribute("aria-pressed", String(concept === button)));
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
      const toggle = event.target.closest(".preview-toggle");
      if (toggle) {
        setPreview(toggle.getAttribute("aria-pressed") === "true" ? -1 : Number(toggle.dataset.preview));
        return;
      }
      const button = event.target.closest(".concept");
      if (!button) return;
      setPreview(-1);
      selectConcept(button);
    }

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
    window.addEventListener("scroll", updateScrollEffects, { passive: true });
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
      if (videoVisible && !motion.matches && stageMode !== "case") {
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

    let scrollFrame = 0;
    let scrollTarget = 0;
    let previousFrameTime = 0;

    function stopWheelScroll() {
      cancelAnimationFrame(scrollFrame);
      scrollFrame = 0;
      previousFrameTime = 0;
    }

    const maxScrollTop = () => document.documentElement.scrollHeight - window.innerHeight;

    function animateWheelScroll(now) {
      const position = window.scrollY;
      scrollTarget = Math.min(scrollTarget, maxScrollTop());
      const distance = scrollTarget - position;
      const elapsed = previousFrameTime ? now - previousFrameTime : 16;
      previousFrameTime = now;

      if (Math.abs(distance) < 1) {
        window.scrollTo({ top: scrollTarget, behavior: "instant" });
        stopWheelScroll();
        return;
      }

      const step = distance * (1 - Math.exp(-elapsed / 180));
      window.scrollTo({ top: position + Math.sign(step) * Math.max(1, Math.abs(step)), behavior: "instant" });
      scrollFrame = requestAnimationFrame(animateWheelScroll);
    }

    // Wheel input is eased towards its target (180 ms time constant). A sideways trackpad swipe moves
    // the page one to one, since the row runs sideways anyway. Panels that scroll inside themselves
    // (concept copy, the example app's feed) get the wheel first.
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
      const base = scrollFrame ? scrollTarget : window.scrollY;
      scrollTarget = clamp(base + delta * unit, 0, maxScrollTop());

      if (motion.matches || sideways) {
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
    let frame = 0;
    let transition = 0;
    let cleanup = 0;

    function stopOpening() {
      cancelAnimationFrame(frame);
      window.clearTimeout(transition);
      window.clearTimeout(cleanup);
      intro.hidden = true;
      delete root.dataset.opening;
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
      root.dataset.opening = "counting";
      const started = performance.now() + ENTRANCE_DURATION;

      function count(now) {
        const progress = Math.min(Math.max((now - started) / COUNT_DURATION, 0), 1);
        const eased = progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
        const value = 100 * eased;
        for (const reel of number.querySelectorAll("[data-place]")) {
          const place = Number(reel.dataset.place);
          const base = Math.floor(value / place);
          const carry = Math.max(0, (value % place - (place - 1)));
          const position = place === 1 ? value : base + carry;
          reel.firstElementChild.style.transform = `translateY(-${position}em)`;
          reel.style.opacity = place === 1 || value >= place - 1 ? "1" : "0";
        }
        if (progress < 1) {
          frame = requestAnimationFrame(count);
        } else {
          transition = window.setTimeout(() => {
            root.dataset.opening = "exiting";
            transition = window.setTimeout(() => {
              root.dataset.opening = "revealing";
              cleanup = window.setTimeout(stopOpening, HERO_DURATION);
            }, EXIT_DURATION);
          }, HOLD_DURATION);
        }
      }

      frame = requestAnimationFrame(count);
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
      stage.style.removeProperty("--dive");
      viewport.style.removeProperty("--x");
      root.style.removeProperty("--travel");
      window.removeEventListener("scroll", updateScrollEffects);
      document.removeEventListener("click", onAnchorClick);
      window.removeEventListener("popstate", onPopState);
      caseButtons.forEach((button) => button.removeEventListener("click", stepCase));
      stage.removeEventListener("click", onConceptClick);
      modeButtons.forEach((button) => button.removeEventListener("click", onModeClick));
      window.removeEventListener("concept:used", onConceptUsed);
      screenResize.disconnect();
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
        <div className="opening-count" ref={counter}>
          {[100, 10, 1].map((place) => (
            <span className="digit-window" data-place={place} key={place}>
              <span className="digit-reel">
                {Array.from({ length: 100 / place + 1 }, (_, index) => (
                  <span className="digit" key={index}>{index % 10}</span>
                ))}
              </span>
            </span>
          ))}
          <span className="opening-percent">%</span>
        </div>
        </div>
        <span className="opening-caption">Web / Apps / Robotics</span>
      </div>
    </div>
  );
}
