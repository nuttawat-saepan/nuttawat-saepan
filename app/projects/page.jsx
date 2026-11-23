import Link from "next/link";
import Sidebar from "../sidebar";
import ConceptSlides from "../slides";
import ClearOpening from "./clear-opening";
import { projectSlug, projects } from "../projects";
import "./projects.css";

export const metadata = {
  title: "All work — Nuttawat Saepan",
  description: "ทุกโปรเจกต์ของ Nuttawat Saepan: Web, Apps และ Robotics",
};

const pad = (value) => String(value).padStart(2, "0");

// "View all work": every project as a card whose picture is its first concept slide.
export default function AllWork() {
  return (
    <>
      <a className="skip-link" href="#main">ข้ามไปยังเนื้อหา</a>
      <Sidebar theme="ink" home={false} />
      <ClearOpening />
      <main id="main" className="pj pj-all" data-theme="ink">
        <nav className="pj-crumbs" aria-label="Breadcrumb">
          <Link href="/#projects"><span aria-hidden="true">←</span> Selected projects</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">All work</span>
        </nav>
        <header className="pj-all-head">
          <h1>All work<i className="dot" aria-hidden="true">.</i></h1>
          <p>({projects.length})</p>
        </header>
        <ol className="pj-cards">
          {projects.map((project, index) => (
            <li key={project.name}>
              <Link className="pj-card" href={`/projects/${projectSlug(project.name)}`}>
                <span className="pj-card-screen" aria-hidden="true" style={{ "--stage-scale": 0.3 }}>
                  <ConceptSlides concepts={project.concepts.slice(0, 1)} active={0} />
                </span>
                <span className="pj-card-num">{pad(index + 1)}.</span>
                <span className="pj-card-meta">{project.scope} — {project.period}</span>
                <span className="pj-card-name">{project.name} <span aria-hidden="true">→</span></span>
                <span className="pj-card-count">{project.concepts.length} concepts inside</span>
              </Link>
            </li>
          ))}
        </ol>
      </main>
    </>
  );
}
