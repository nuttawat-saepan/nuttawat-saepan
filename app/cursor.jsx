"use client";

import { useEffect, useRef } from "react";

// Custom cursor (desktop pointers only), modelled on the user's reference (bennet.clapat.com) and
// specified in MOTION_SPEC.md. One ring follows the pointer with a short lag and changes state by
// what is under it; the first matching rule wins.
const LOADING = ["loading", "counting", "exiting"];
// Text buttons that lean towards the pointer; the ring hides and their underline relays (style.css).
const MAGNETIC = ".profile-link, .work-link, .wl-all";
// Links the cursor leaves alone: just the plain ring (user: no interaction on Home's "Scroll", and
// the menu (hamburger) buttons are plain again — 25 Nov: "ring default ปกติเลย").
const PLAIN = ".hero-scroll, .sidebar-toggle, .mobile-menu-toggle, .menu-close";
// Links that open a project route, and the menu's big chapter links: the ring becomes a viewfinder.
const OPEN = ".wl-item, .wl-inside, .what-seen a, .pj-card, .pj-next, .menu-links a";
// Top bar and side rail controls.
const BAR = ".site-header :is(a, button)";
// The name: a red badge with "HELLO • สวัสดี" turning around its edge.
const NAME = ".hero-name";
const INTERACTIVE = "a, button, [role='button'], summary, label[for]";
const OPEN_LABEL = "[ Open ]";
const LOADING_LABEL = "[ Loading ]";

export default function Cursor() {
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return undefined;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;
    const ring = ringRef.current;
    const label = labelRef.current;
    root.dataset.cursor = "";

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let ringX = x;
    let ringY = y;
    let moved = false;
    let inside = true;
    let dirty = true;
    let frame = 0;
    let last = performance.now();
    let state = "";
    let theme = "";
    let magnet = null;
    let magnetX = 0;
    let magnetY = 0;
    // Buttons let go of, easing back to rest.
    const settling = [];

    function resolve(element) {
      if (LOADING.includes(root.dataset.opening)) return ["loading", LOADING_LABEL, null];
      if (!element || element.closest(PLAIN)) return ["default", "", null];
      const magnetic = element.closest(MAGNETIC);
      if (magnetic) return ["magnet", "", magnetic];
      if (element.closest(OPEN)) return ["open", OPEN_LABEL, null];
      if (element.closest(BAR)) return ["bar", "", null];
      if (element.closest(NAME)) return ["hello", "", null];
      if (element.closest(INTERACTIVE)) return ["hover", "", null];
      return ["default", "", null];
    }

    function releaseMagnet() {
      if (!magnet) return;
      const element = magnet;
      magnet = null;
      element.removeAttribute("data-magnet");
      // Ease it back from wherever it is (the loop keeps writing until it settles).
      settling.push({ element, x: magnetX, y: magnetY });
      magnetX = 0;
      magnetY = 0;
    }

    function update() {
      const element = document.elementFromPoint(x, y);
      const [next, text, magnetic] = resolve(element);
      // The open menu is ink whatever theme the header carries.
      const nextTheme = LOADING.includes(root.dataset.opening) || element?.closest(".fullscreen-menu") ? "ink" : element?.closest("[data-theme]")?.dataset.theme ?? "paper";
      if (magnetic !== magnet) {
        releaseMagnet();
        if (magnetic && !reduce.matches) {
          magnet = magnetic;
          magnet.setAttribute("data-magnet", "");
          const settled = settling.findIndex((item) => item.element === magnetic);
          if (settled >= 0) {
            magnetX = settling[settled].x;
            magnetY = settling[settled].y;
            settling.splice(settled, 1);
          }
        }
      }
      if (next !== state) {
        state = next;
        ring.dataset.state = next;
        label.textContent = text;
      }
      if (nextTheme !== theme) {
        theme = nextTheme;
        ring.dataset.theme = nextTheme;
      }
    }

    function loop(now) {
      const dt = Math.min(now - last, 64);
      last = now;
      if (dirty) {
        dirty = false;
        update();
      }
      // Ring trails the pointer (about a 90 ms time constant); reduced motion follows exactly.
      const follow = reduce.matches ? 1 : 1 - Math.exp(-dt / 90);
      ringX += (x - ringX) * follow;
      ringY += (y - ringY) * follow;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;


      // Magnetic buttons lean a quarter of the way towards the pointer, at most 14 px across, 10 px down.
      const pull = Math.min(1, dt / 70);
      if (magnet) {
        const box = magnet.getBoundingClientRect();
        const centreX = box.left + box.width / 2 - magnetX;
        const centreY = box.top + box.height / 2 - magnetY;
        const targetX = Math.max(-14, Math.min(14, (x - centreX) * .25));
        const targetY = Math.max(-10, Math.min(10, (y - centreY) * .3));
        magnetX += (targetX - magnetX) * pull;
        magnetY += (targetY - magnetY) * pull;
        magnet.style.translate = `${magnetX}px ${magnetY}px`;
      }
      for (let index = settling.length - 1; index >= 0; index -= 1) {
        const item = settling[index];
        item.x -= item.x * pull * .6;
        item.y -= item.y * pull * .6;
        if (Math.abs(item.x) < .1 && Math.abs(item.y) < .1) {
          item.element.style.removeProperty("translate");
          settling.splice(index, 1);
        } else {
          item.element.style.translate = `${item.x}px ${item.y}px`;
        }
      }

      ring.toggleAttribute("data-visible", inside && (moved || LOADING.includes(root.dataset.opening)));
      frame = requestAnimationFrame(loop);
    }

    function onMove(event) {
      x = event.clientX;
      y = event.clientY;
      if (!moved) {
        moved = true;
        if (!LOADING.includes(root.dataset.opening)) {
          ringX = x;
          ringY = y;
        }
      }
      inside = true;
      dirty = true;
    }
    const markDirty = () => { dirty = true; };
    const onDown = () => ring.setAttribute("data-down", "");
    const onUp = () => ring.removeAttribute("data-down");
    function onOut(event) {
      if (event.relatedTarget) return;
      inside = false;
      releaseMagnet();
    }

    const openingObserver = new MutationObserver(markDirty);
    openingObserver.observe(root, { attributes: true, attributeFilter: ["data-opening"] });
    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("pointerup", onUp);
    document.addEventListener("pointerout", onOut);
    window.addEventListener("scroll", markDirty, { passive: true });
    window.addEventListener("wheel", markDirty, { passive: true });
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      releaseMagnet();
      settling.forEach((item) => item.element.style.removeProperty("translate"));
      openingObserver.disconnect();
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerout", onOut);
      window.removeEventListener("scroll", markDirty);
      window.removeEventListener("wheel", markDirty);
      delete root.dataset.cursor;
    };
  }, []);

  return (
    <div ref={ringRef} className="cursor" aria-hidden="true">
      <div className="cursor-ball">
        <svg className="cursor-hello" viewBox="0 0 100 100">
          <path id="cursor-hello-path" fill="none" d="M50,50 m-35,0 a35,35 0 1,1 70,0 a35,35 0 1,1 -70,0" />
          <text><textPath href="#cursor-hello-path">HELLO • สวัสดี • HELLO • สวัสดี •</textPath></text>
          <circle cx="50" cy="50" r="4" />
        </svg>
        <span className="cursor-corner" /><span className="cursor-corner" /><span className="cursor-corner" /><span className="cursor-corner" />
        <span className="cursor-dot" />
        <span ref={labelRef} className="cursor-label" />
      </div>
    </div>
  );
}
