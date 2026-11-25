"use client";

import { useEffect } from "react";

// Melius-style letter glow (MOTION_SPEC.md, 25 Nov): a soft glow trails the pointer and shows only
// inside the letters. `area` takes the pointer and gets `data-lit`; `bounds` is the text whose box
// (plus a quarter of its height) lights the glow; `targets()` returns the elements whose background is
// clipped to their text — each gets --gx / --gy relative to its own box, so a headline split into
// separately animated lines still shares one glow. `dots` (optional) gets the same point relative to
// `area`, for a dot grid lit around the glow.
export default function useLetterGlow({ area, bounds, targets, dots, followMs = 140 }) {
  useEffect(() => {
    const zone = area.current;
    const text = bounds.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!zone || !text || reduce.matches) return undefined;

    // Pointer in viewport coordinates; followMs sets how slowly the glow eases after it.
    let px = 0;
    let py = 0;
    let gx = null;
    let gy = null;
    let lit = false;
    let frame = 0;
    let last = 0;
    let drift = 0;

    function place(element, box) {
      element.style.setProperty("--gx", `${(gx - box.left).toFixed(1)}px`);
      element.style.setProperty("--gy", `${(gy - box.top).toFixed(1)}px`);
    }

    function paint(now) {
      const dt = Math.min(now - (last || now), 64);
      last = now;
      if (!fine.matches) {
        // Phones and tablets: no pointer to follow, so the glow wanders slowly across the letters.
        drift += dt;
        const box = text.getBoundingClientRect();
        px = box.left + box.width * (.5 + .42 * Math.sin(drift / 2600));
        py = box.top + box.height * (.5 + .38 * Math.sin(drift / 1900 + 1));
      }
      const follow = 1 - Math.exp(-dt / followMs);
      if (gx === null) { gx = px; gy = py; }
      gx += (px - gx) * follow;
      gy += (py - gy) * follow;
      for (const element of targets()) place(element, element.getBoundingClientRect());
      if (dots?.current) place(dots.current, zone.getBoundingClientRect());
      const settled = Math.abs(px - gx) < .3 && Math.abs(py - gy) < .3;
      frame = lit || !fine.matches || !settled ? requestAnimationFrame(paint) : 0;
    }
    const run = () => { if (!frame) { last = 0; frame = requestAnimationFrame(paint); } };

    function setLit(next) {
      if (next === lit) return;
      lit = next;
      zone.toggleAttribute("data-lit", next);
    }

    function onMove(event) {
      px = event.clientX;
      py = event.clientY;
      const box = text.getBoundingClientRect();
      const reach = box.height * .25;
      setLit(px > box.left - reach && px < box.right + reach && py > box.top - reach && py < box.bottom + reach);
      run();
    }
    const onLeave = () => setLit(false);

    // Without a pointer the wander runs only while the text is on screen.
    const observer = new IntersectionObserver(([entry]) => {
      if (fine.matches) return;
      lit = entry.isIntersecting;
      zone.toggleAttribute("data-lit", lit);
      if (lit) run();
      else { cancelAnimationFrame(frame); frame = 0; }
    }, { threshold: .2 });
    observer.observe(text);
    zone.addEventListener("pointermove", onMove, { passive: true });
    zone.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      zone.removeEventListener("pointermove", onMove);
      zone.removeEventListener("pointerleave", onLeave);
      zone.removeAttribute("data-lit");
    };
  }, [area, bounds, targets, dots, followMs]);
}
