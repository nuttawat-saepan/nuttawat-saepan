"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import ConceptSlides from "../slides";
import OneDPreview from "../preview";
import { Icon, projectSlug, projects } from "../projects";

const pad = (value) => String(value).padStart(2, "0");

// A project's own page ("What's inside"): concept list on the left, the laptop with the
// concept's slide in the middle, the concept's detail on the right, and arrows to step through.
// For oneD the laptop can switch to the example app; using the app picks the concept it shows.
// On phones the laptop sticks under the top bar and a tap opens the slide full screen.
export default function CaseView({ index }) {
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  const concepts = project.concepts;
  const [active, setActive] = useState(0);
  const [used, setUsed] = useState(false);
  const [preview, setPreview] = useState(false);
  const [explored, setExplored] = useState(() => new Set([0]));
  const screenRef = useRef(null);
  const viewerRef = useRef(null);
  const viewerStageRef = useRef(null);
  const viewerSizeRef = useRef(null);
  const swipeRef = useRef(null);
  const concept = concepts[active];

  const select = useCallback((order, { fromApp = false } = {}) => {
    const clamped = Math.max(0, Math.min(concepts.length - 1, order));
    setActive(clamped);
    setUsed(fromApp);
    setExplored((seen) => (seen.has(clamped) ? seen : new Set(seen).add(clamped)));
    if (!fromApp) setPreview(false);
  }, [concepts.length]);

  // This page has no loader: clear the attribute the root layout renders for the home page.
  useEffect(() => {
    if (!document.querySelector(".opening")) delete document.documentElement.dataset.opening;
  }, []);

  // Slides are drawn on a 1200 × 750 stage; scale them to the screen's real width.
  useEffect(() => {
    const screen = screenRef.current;
    const scale = () => screen.style.setProperty("--stage-scale", (screen.clientWidth / 1200).toFixed(4));
    const observer = new ResizeObserver(scale);
    observer.observe(screen);
    return () => observer.disconnect();
  }, []);

  // The example app reports which concept an action demonstrates.
  useEffect(() => {
    if (!preview) return undefined;
    const onUsed = (event) => {
      const order = concepts.findIndex((item) => item.demo === event.detail?.demo);
      if (order >= 0) select(order, { fromApp: true });
    };
    window.addEventListener("concept:used", onUsed);
    return () => window.removeEventListener("concept:used", onUsed);
  }, [preview, concepts, select]);

  // Arrow keys step through the concepts (not while typing or while a dialog is open).
  useEffect(() => {
    const onKey = (event) => {
      if (viewerRef.current?.open || event.target.closest?.("input, textarea, [contenteditable], .app-preview")) return;
      if (event.key === "ArrowRight") select(active + 1);
      if (event.key === "ArrowLeft") select(active - 1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active, select]);

  // Phones: the full-screen viewer clones the visible slide at a readable size.
  const renderViewer = useCallback(() => {
    const slide = screenRef.current?.querySelector(".sl-slide.is-active");
    if (!slide) return;
    const scale = Math.max(0.5, Math.min(0.7, (window.innerHeight - 200) / 750));
    viewerSizeRef.current.style.width = `${Math.round(1200 * scale)}px`;
    viewerSizeRef.current.style.height = `${Math.round(750 * scale)}px`;
    viewerStageRef.current.style.transform = `scale(${scale})`;
    viewerStageRef.current.replaceChildren(slide.cloneNode(true));
    viewerSizeRef.current.parentElement.scrollLeft = 0;
  }, []);

  useEffect(() => {
    if (viewerRef.current?.open) requestAnimationFrame(renderViewer);
  }, [active, renderViewer]);

  const phone = () => !window.matchMedia("(min-width: 900px) and (min-height: 600px)").matches;
  const openViewer = () => {
    if (preview || !phone()) return;
    renderViewer();
    viewerRef.current.showModal();
  };

  return (
    <>
      <div className="pj-top">
        <nav className="pj-crumbs" aria-label="Breadcrumb">
          <Link href="/#projects"><span aria-hidden="true">←</span> Selected projects</Link>
          <span aria-hidden="true">/</span>
          <span>{project.name}</span>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{"What's inside"}</span>
        </nav>
        {project.preview && (
          <button type="button" className="pj-preview" aria-pressed={preview} onClick={() => setPreview((open) => !open)}>
            <span className="play-glyph" aria-hidden="true" />{preview ? "Close example app" : "Preview example app"}
          </button>
        )}
      </div>

      <header className="pj-head">
        <h1>{project.name}<i className="dot" aria-hidden="true">.</i></h1>
        <dl className="pj-meta">
          <div><dt>Scope</dt><dd>{project.scope}</dd></div>
          <div><dt>Stack</dt><dd>{project.stack}</dd></div>
          <div><dt>Period</dt><dd>{project.period}</dd></div>
        </dl>
      </header>
      <p className="pj-summary">{project.summary}</p>

      <div className="pj-body" data-case-shown="">
        <div className="pj-list-wrap">
          <p className="pj-label">{"// What's inside"} <span>Explored <b>{explored.size}</b> / {concepts.length}</span></p>
          <ol className="pj-list">
            {concepts.map((item, order) => (
              <li key={item.title}>
                <button type="button" className="concept" aria-pressed={order === active} data-seen={explored.has(order) || undefined} onClick={() => select(order)}>
                  <span className="concept-icon" aria-hidden="true"><Icon name={item.icon} /></span>
                  <span className="concept-title">{item.title}</span>
                  <span className="concept-tag">{item.tag}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="pj-device">
          <div className="laptop">
            <div className="laptop-lid">
              <div className="laptop-screen" ref={screenRef} onClick={openViewer}>
                <ConceptSlides concepts={concepts} active={active} />
                {preview && (
                  <div className="app-preview" role="region" aria-label={`${project.name} example app, mock data`}>
                    <button type="button" className="app-close" aria-label="Close preview" onClick={(event) => { event.stopPropagation(); setPreview(false); }}>✕</button>
                    <OneDPreview />
                  </div>
                )}
              </div>
            </div>
            <div className="laptop-base" aria-hidden="true" />
          </div>
        </div>

        <article className="pj-detail" aria-live="polite" key={active} data-used={used || undefined}>
          <p className="pj-count"><b>{pad(active + 1)}</b><span>/{pad(concepts.length)}</span></p>
          {used && <p className="pj-just">Just used in the example app</p>}
          <h2>{concept.title}</h2>
          <p className="pj-tag">{concept.tag}</p>
          <p className="pj-text">{concept.text}</p>
          {(concept.learn || concept.measured) && (
            <dl className="pj-notes">
              {concept.learn && <div><dt>Learning</dt><dd>{concept.learn}</dd></div>}
              {concept.measured && <div><dt>Measured</dt><dd>{concept.measured}</dd></div>}
            </dl>
          )}
        </article>
      </div>

      <footer className="pj-foot">
        <span className="pj-progress" aria-hidden="true"><i style={{ width: `${((active + 1) / concepts.length) * 100}%` }} /></span>
        <div className="pj-steps">
          <button type="button" className="case-circle" aria-label="Previous concept" disabled={active === 0} onClick={() => select(active - 1)}>←</button>
          <button type="button" className="case-circle" aria-label="Next concept" disabled={active === concepts.length - 1} onClick={() => select(active + 1)}>→</button>
        </div>
        <Link className="pj-next" href={`/projects/${projectSlug(next.name)}`}>
          <span>Next project</span><span>{next.name} <span aria-hidden="true">→</span></span>
        </Link>
      </footer>

      <dialog className="slide-viewer" ref={viewerRef} aria-label="Concept diagram"
        onPointerDown={(event) => { swipeRef.current = { x: event.clientX, y: event.clientY }; }}
        onPointerUp={(event) => {
          const from = swipeRef.current;
          swipeRef.current = null;
          if (from && event.clientY - from.y > 90 && Math.abs(event.clientX - from.x) < 70) viewerRef.current.close();
        }}>
        <div className="viewer-head">
          <p className="viewer-title" aria-live="polite"><b>{pad(active + 1)} / {pad(concepts.length)}</b> · {concept.title}</p>
          <button type="button" className="viewer-close" aria-label="Close diagram" onClick={() => viewerRef.current.close()}>✕</button>
        </div>
        <div className="viewer-pan"><div className="viewer-size" ref={viewerSizeRef}><div className="viewer-stage" ref={viewerStageRef} /></div></div>
        <div className="viewer-foot">
          <button type="button" className="viewer-step" aria-label="Previous concept" disabled={active === 0} onClick={() => select(active - 1)}>←</button>
          <p className="viewer-hint">ปัดซ้ายขวาเพื่อดูทั้งแผนภาพ · ปัดลงเพื่อปิด</p>
          <button type="button" className="viewer-step" aria-label="Next concept" disabled={active === concepts.length - 1} onClick={() => select(active + 1)}>→</button>
        </div>
      </dialog>
    </>
  );
}
