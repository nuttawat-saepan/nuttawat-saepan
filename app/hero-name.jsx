"use client";

import { useCallback, useEffect, useRef } from "react";
import useLetterGlow from "./letter-glow";

// The home name with the Melius-style letter glow (user, 25 Nov: "try melius in Nuttawat Saepan.").
// The glow copy sits in the same grid cell on top of the name, with the same line spans, so the
// loader's line-by-line entrance plays on both. Each line is its own glow fill (the lines animate
// separately, which would break one clip across them); letter-glow.js aligns them to one point.
export default function HeroName() {
  const nameRef = useRef(null);
  const areaRef = useRef(null);
  const glowRef = useRef(null);

  // The whole Home panel takes the pointer.
  useEffect(() => {
    areaRef.current = nameRef.current.closest("section");
  }, []);

  const targets = useCallback(() => glowRef.current.querySelectorAll(".glow-fill"), []);
  useLetterGlow({ area: areaRef, bounds: nameRef, targets, followMs: 420 });

  return (
    <>
      <h1 ref={nameRef} id="home-title" className="hero-name">
        <span><span>Nuttawat</span></span>
        <span><span>Saepan<i className="dot" aria-hidden="true">.</i></span></span>
      </h1>
      <p ref={glowRef} className="hero-name hero-glow glow-layer" aria-hidden="true">
        <span><span className="glow-fill">Nuttawat</span></span>
        <span><span className="glow-fill">Saepan<i className="dot">.</i></span></span>
      </p>
    </>
  );
}
