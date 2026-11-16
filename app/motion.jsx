"use client";

import { useEffect, useRef } from "react";

const COUNT_DURATION = 1000;
const HOLD_DURATION = 120;
const HERO_DURATION = 710;

export default function Opening() {
  const overlay = useRef(null);
  const counter = useRef(null);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;
    const intro = overlay.current;
    const number = counter.current;
    const viewport = document.querySelector(".portfolio-viewport");
    const horizontal = window.matchMedia("(min-width: 900px) and (min-height: 600px)");

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

      const panel = event.target.closest(".project, section, footer");
      if (panel) {
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

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        if (!motion.matches) entry.target.classList.add("reveal-in");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.15 });

    document.querySelectorAll("[data-reveal]").forEach((node) => observer.observe(node));

    function updatePreference(event) {
      if (event.matches) {
        stopOpening();
        stopWheelScroll();
      }
    }

    function skipOpening(event) {
      if (event.type === "focusin" || event.key === "Escape") stopOpening();
    }

    if (!motion.matches && !window.location.hash && window.scrollY === 0 && viewport.scrollLeft === 0) {
      intro.hidden = false;
      root.dataset.opening = "counting";
      const started = performance.now();

      function count(now) {
        const progress = Math.min((now - started) / COUNT_DURATION, 1);
        number.textContent = Math.floor(progress * 100);
        if (progress < 1) {
          frame = requestAnimationFrame(count);
        } else {
          transition = window.setTimeout(() => {
            root.dataset.opening = "revealing";
            cleanup = window.setTimeout(stopOpening, HERO_DURATION);
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
      stopWheelScroll();
      viewport.removeEventListener("wheel", onWheel);
      document.removeEventListener("pointerdown", stopWheelScroll);
      document.removeEventListener("keydown", stopWheelScroll);
      horizontal.removeEventListener("change", stopWheelScroll);
      motion.removeEventListener("change", updatePreference);
      document.removeEventListener("focusin", skipOpening);
      document.removeEventListener("keydown", skipOpening);
    };
  }, []);

  return (
    <div ref={overlay} className="opening" aria-hidden="true" hidden>
      <div className="frame opening-inner">
        <span className="eyebrow">Nuttawat Saepan</span>
        <div className="opening-count"><span ref={counter}>0</span><span>%</span></div>
        <span className="eyebrow">Portfolio</span>
      </div>
    </div>
  );
}
