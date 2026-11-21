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
    const themedPanels = [...viewport.querySelectorAll(":scope > main > [data-theme], :scope > footer[data-theme]")];
    const horizontal = window.matchMedia("(min-width: 900px) and (min-height: 600px)");
    const clamp = (value, min, max) => Math.max(min, Math.min(value, max));
    let videoVisible = false;
    let stageMode = "intro";
    let activeCase = -1;
    let metrics = { dive: 0, step: 1 };

    function measureTrack() {
      const style = getComputedStyle(track);
      const width = viewport.clientWidth;
      metrics = {
        dive: (parseFloat(style.getPropertyValue("--dive-len")) || 0) * width,
        step: Math.max(1, (parseFloat(style.getPropertyValue("--case-len")) || 0) * width),
      };
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

    function setPreview(index) {
      const target = String(index);
      previews.forEach((preview) => { preview.hidden = preview.dataset.previewFor !== target; });
      previewToggles.forEach((toggle) => toggle.setAttribute("aria-pressed", String(toggle.dataset.preview === target)));
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
      if (stageMode === "case" && !motion.matches) playCaseIn(index, first);
    }

    function updateScrollEffects() {
      if (!horizontal.matches) {
        sidebar.dataset.theme = "paper";
        stage.style.removeProperty("--dive");
        stageMode = "intro";
        stage.dataset.mode = stageMode;
        return;
      }

      const edge = viewport.getBoundingClientRect().left + 1;
      let theme = "paper";
      for (const panel of themedPanels) {
        if (panel.getBoundingClientRect().left <= edge) theme = panel.dataset.theme;
      }
      sidebar.dataset.theme = theme;

      const distance = edge - 1 - track.getBoundingClientRect().left;
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

    function selectConcept(button) {
      const item = button.closest(".case");
      const screen = screens[cases.indexOf(item)];
      const order = button.dataset.concept;
      item.querySelectorAll(".concept").forEach((concept) => concept.setAttribute("aria-pressed", String(concept === button)));
      let shown;
      item.querySelectorAll("[data-concept-detail]").forEach((detail) => {
        detail.hidden = detail.dataset.conceptDetail !== order;
        if (!detail.hidden) shown = detail;
      });
      if (button.dataset.demo) screen.dataset.demo = button.dataset.demo;
      const chip = screen.querySelector(".screen-chip");
      if (chip) chip.textContent = button.getAttribute("aria-label");
      if (motion.matches) return;
      shown.animate([{ opacity: 0, transform: "translateY(.5rem)" }, { opacity: 1, transform: "none" }], { duration: 320, easing: "cubic-bezier(.2, .8, .2, 1)" });
      if (stageMode === "case") flash.animate([{ opacity: 0 }, { opacity: 0.2 }, { opacity: 0 }], { duration: 320, easing: "ease-out" });
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
      const trackStart = viewport.scrollLeft + track.getBoundingClientRect().left - viewport.getBoundingClientRect().left;
      let target = trackStart + metrics.dive + next * metrics.step + metrics.step * 0.35;
      if (next < 0) target = trackStart;
      if (next >= cases.length) target = trackStart + track.offsetWidth;
      stopWheelScroll();
      viewport.scrollTo({ left: target, behavior: motion.matches ? "instant" : "smooth" });
    }

    function onResize() {
      measureTrack();
      updateScrollEffects();
    }

    const viewportResize = new ResizeObserver(onResize);
    viewportResize.observe(viewport);
    viewport.addEventListener("scroll", updateScrollEffects, { passive: true });
    caseButtons.forEach((button) => button.addEventListener("click", stepCase));
    stage.addEventListener("click", onConceptClick);
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

    function animateWheelScroll(now) {
      const position = viewport.scrollLeft;
      scrollTarget = Math.min(scrollTarget, viewport.scrollWidth - viewport.clientWidth);
      const distance = scrollTarget - position;
      const elapsed = previousFrameTime ? now - previousFrameTime : 16;
      previousFrameTime = now;

      if (Math.abs(distance) < 1) {
        viewport.scrollTo({ left: scrollTarget, behavior: "instant" });
        stopWheelScroll();
        return;
      }

      const step = distance * (1 - Math.exp(-elapsed / 105));
      viewport.scrollTo({ left: position + Math.sign(step) * Math.max(1, Math.abs(step)), behavior: "instant" });
      scrollFrame = requestAnimationFrame(animateWheelScroll);
    }

    function onWheel(event) {
      if (!horizontal.matches || event.ctrlKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) {
        stopWheelScroll();
        return;
      }

      const panel = event.target.closest(".case-copy, .app-feed, section, footer");
      if (panel && panel.id !== "home") {
        const remaining = panel.scrollHeight - panel.clientHeight - panel.scrollTop;
        if (event.deltaY > 0 ? remaining > 1 : panel.scrollTop > 1) {
          stopWheelScroll();
          return;
        }
      }

      event.preventDefault();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport.clientWidth : 1;
      const base = scrollFrame ? scrollTarget : viewport.scrollLeft;
      const maxScroll = viewport.scrollWidth - viewport.clientWidth;
      scrollTarget = Math.max(0, Math.min(base + event.deltaY * unit, maxScroll));

      if (motion.matches) {
        viewport.scrollTo({ left: scrollTarget, behavior: "instant" });
      } else if (!scrollFrame) {
        scrollFrame = requestAnimationFrame(animateWheelScroll);
      }
    }

    viewport.addEventListener("wheel", onWheel, { passive: false });
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
          reel.style.width = place === 1 || value >= place - 1 ? ".56em" : "0";
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
      viewport.removeEventListener("scroll", updateScrollEffects);
      caseButtons.forEach((button) => button.removeEventListener("click", stepCase));
      stage.removeEventListener("click", onConceptClick);
      sidebar.dataset.theme = "paper";
      viewport.removeEventListener("wheel", onWheel);
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
