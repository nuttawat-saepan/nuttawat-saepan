"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ConceptSlides from "./slides";
import { OneDScreen } from "./oned-showcase";
import { BeachboyScreen, Go2Screen, LcsScreen, ThaiThaiPhone } from "./showcases";
import { projectSlug, projects } from "./projects";

// Each project's laptop plays a live mock of what the user built (oned-showcase.jsx, showcases.jsx).
// ThaiThai is a phone app: its laptop folds shut and a phone rises in front instead.
const SHOWCASE = { oneD: OneDScreen, "Unitree Go2": Go2Screen, LCS: LcsScreen, Beachboy: BeachboyScreen };
const PHONE_APP = "ThaiThai";

const pad = (value) => String(value).padStart(2, "0");
const year = (period) => period.split("→").pop().trim().slice(0, 4);

// Chapter II, after the reference's "Related work": a big numbered list of projects on the right.
// Pointing at (or focusing) a project lights it, opens its scope, year and "What's inside" link,
// and switches the laptop on the left to that project's first slide. Clicking opens its page.
export default function SelectedWork() {
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState(false);
  // If ThaiThai is on show at the first reveal, its phone waits for the lid; afterwards it follows a hover quickly.
  const [phoneDelay, setPhoneDelay] = useState(850);
  const screenRef = useRef(null);
  const laptopRef = useRef(null);
  const lidRef = useRef(null);
  const previous = useRef(null);
  const project = projects[active];
  const phoneApp = project.name === PHONE_APP;

  // Slides are drawn on a 1200 × 750 stage; scale them to the screen's real width.
  useEffect(() => {
    const screen = screenRef.current;
    const scale = () => screen.style.setProperty("--stage-scale", (screen.clientWidth / 1200).toFixed(4));
    const observer = new ResizeObserver(scale);
    observer.observe(screen);
    return () => observer.disconnect();
  }, []);

  // Device reveal, after the user's reference clips (kisracorp.com service videos): the first time the
  // laptop is mostly in view it rises while its lid swings open, then the phone slides in beside it.
  useEffect(() => {
    const laptop = laptopRef.current;
    const lid = lidRef.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(true);
      return undefined;
    }
    laptop.dataset.closed = "";
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      delete laptop.dataset.closed;
      laptop.animate([{ transform: "translateY(10%) scale(.94)" }, { transform: "translateY(-2%) scale(1)", offset: .75 }, { transform: "none" }],
        { duration: 900, easing: "cubic-bezier(.22, 1, .36, 1)" });
      lid.animate([{ transform: "rotateX(-88deg)" }, { transform: "rotateX(5deg)", offset: .8 }, { transform: "none" }],
        { duration: 750, easing: "cubic-bezier(.22, 1, .36, 1)" });
      setRevealed(true);
      settle = window.setTimeout(() => setPhoneDelay(250), 1800);
    }, { threshold: .45 });
    let settle = 0;
    observer.observe(laptop);
    return () => { observer.disconnect(); window.clearTimeout(settle); };
  }, []);

  // Switching project flips the lid up again (shorter), so each project arrives like a new reveal.
  // To or from ThaiThai the lid closes or opens instead (a CSS transition on data-device).
  useEffect(() => {
    const before = previous.current;
    previous.current = project.name;
    if (before === null || before === PHONE_APP || phoneApp) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lidRef.current.animate([{ transform: "rotateX(-50deg)", filter: "brightness(.55)" }, { transform: "none", filter: "none" }],
      { duration: 600, easing: "cubic-bezier(.22, 1, .36, 1)" });
  }, [active]);

  return (
    <section className="selected-work" id="projects" data-theme="ink" aria-labelledby="projects-title">
      <div className="wl">
        <div className="wl-left">
          <p className="section-label" aria-hidden="true"><span>(02)</span> Selected projects — {pad(projects.length)}</p>
          <div className="wl-preview" aria-hidden="true">
            <div className="wl-caption">
              <p>{project.summary}</p>
              <p className="wl-stack">{project.stack}</p>
            </div>
            <div className="laptop" ref={laptopRef} data-device={phoneApp ? "phone" : undefined}>
              <div className="laptop-lid" ref={lidRef}>
                <div className="laptop-screen" ref={screenRef}>
                  {projects.map((item, order) => {
                    const Showcase = SHOWCASE[item.name];
                    return (
                      <div key={item.name} className="wl-screen" data-on={order === active || undefined}>
                        {Showcase ? <Showcase on={revealed && order === active} /> : <ConceptSlides concepts={item.concepts.slice(0, 1)} active={0} />}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="laptop-base" />
              <ThaiThaiPhone on={revealed && phoneApp} delay={phoneDelay} />
            </div>
          </div>
          <p className="wl-note">✻ Screens are redrawn on mock data from my notes; live sites stay private for NDA or internal projects</p>
        </div>

        <div className="wl-right">
          <p className="wl-hint" aria-hidden="true">Hover to preview · Click to explore</p>
          <h2 className="wl-label" id="projects-title">Related work</h2>
          <ol className="wl-list">
            {projects.map((item, order) => {
              const href = `/projects/${projectSlug(item.name)}`;
              return (
                <li key={item.name} data-on={order === active || undefined} onMouseEnter={() => setActive(order)} onFocus={() => setActive(order)}>
                  <Link className="wl-item" href={href}>
                    <span className="wl-num">{pad(order + 1)}</span>
                    <span className="wl-name">{item.name}</span>
                    <span className="wl-arrow" aria-hidden="true">↗</span>
                  </Link>
                  <div className="wl-meta">
                    <div>
                      <div className="wl-meta-in">
                        <span className="wl-period">{item.scope} — {year(item.period)}</span>
                        <Link className="wl-inside" href={href} tabIndex={order === active ? 0 : -1}>
                          {"What's inside"} ({item.concepts.length}) <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
          <Link className="wl-all" href="/projects">View all work <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </section>
  );
}
