"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ConceptSlides from "./slides";
import { projectSlug, projects } from "./projects";

const pad = (value) => String(value).padStart(2, "0");
const year = (period) => period.split("→").pop().trim().slice(0, 4);

// Chapter II, after the reference's "Related work": a big numbered list of projects on the right.
// Pointing at (or focusing) a project lights it, opens its scope, year and "What's inside" link,
// and switches the laptop on the left to that project's first slide. Clicking opens its page.
export default function SelectedWork() {
  const [active, setActive] = useState(0);
  const screenRef = useRef(null);
  const project = projects[active];

  // Slides are drawn on a 1200 × 750 stage; scale them to the screen's real width.
  useEffect(() => {
    const screen = screenRef.current;
    const scale = () => screen.style.setProperty("--stage-scale", (screen.clientWidth / 1200).toFixed(4));
    const observer = new ResizeObserver(scale);
    observer.observe(screen);
    return () => observer.disconnect();
  }, []);

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
            <div className="laptop">
              <div className="laptop-lid">
                <div className="laptop-screen" ref={screenRef}>
                  {projects.map((item, order) => (
                    <div key={item.name} className="wl-screen" data-on={order === active || undefined}>
                      <ConceptSlides concepts={item.concepts.slice(0, 1)} active={0} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="laptop-base" />
            </div>
          </div>
          <p className="wl-note">✻ Diagrams are redrawn from my notes; live sites stay private for NDA or internal projects</p>
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
