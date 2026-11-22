import Image from "next/image";
import Opening from "./motion";
import Sidebar from "./sidebar";
import { ProjectScreen, areas, caseId, projects } from "./projects";
import OneDPreview from "./preview";

const pad = (value) => String(value).padStart(2, "0");
const total = pad(projects.length);

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">ข้ามไปยังเนื้อหา</a>
      <Opening />
      <Sidebar />

      <div className="portfolio-viewport">
        <main id="main">
          <section className="hero" id="home" data-theme="paper" aria-labelledby="home-title">
            <div className="frame hero-inner">
              <h1 id="home-title" className="hero-name">
                <span><span>Nuttawat</span></span>
                <span><span>Saepan<i className="dot" aria-hidden="true">.</i></span></span>
              </h1>
              <div className="hero-top">
                <p className="role">Software Engineer</p>
                <p className="disciplines">Web / Apps / Robotics</p>
              </div>
              <div className="hero-bottom">
                <p lang="en">I build web and mobile apps, from live commerce and video platforms to robotics systems.</p>
                <a className="hero-scroll" href="#profile">Scroll <span aria-hidden="true">→</span></a>
              </div>
            </div>
          </section>

          <section className="profile" id="profile" data-theme="ink" aria-labelledby="profile-title">
            <div className="frame profile-grid">
              <h2 id="profile-title" className="section-label"><span aria-hidden="true">(01)</span> Quick intro</h2>
              <p className="profile-intro">ผม Nuttawat Saepan พัฒนาซอฟต์แวร์ตั้งแต่เว็บและแอป ไปจนถึงระบบหุ่นยนต์ มีประสบการณ์กับ Live Commerce, Video Playback, เครื่องมือจัดการคอนเทนต์ และ Systems Integration</p>
              <figure className="portrait">
                <Image src="/assets/nuttawat-saepan.webp" alt="Nuttawat Saepan" width={1000} height={1500} sizes="(max-width: 680px) 90vw, min(40vw, 45vh)" />
              </figure>
              <div className="profile-foot">
                <p className="portrait-caption">Software Engineer<br />Web / Apps / Robotics</p>
                <a className="profile-link" href="#projects">View projects <span aria-hidden="true">→</span></a>
              </div>
            </div>
          </section>

          <section className="what" id="what-i-do" data-theme="paper" aria-labelledby="what-title">
            <div className="what-intro">
              <p className="section-label" aria-hidden="true"><span>(02)</span> What I do</p>
              <h2 id="what-title" className="what-title">What I do<i className="dot" aria-hidden="true">.</i></h2>
              <div className="what-lead">
                <p className="what-kicker">Web / Apps / Robotics</p>
                <p lang="en">I build for the web, mobile apps and robots. Each column lists only the tools these projects actually used.</p>
              </div>
            </div>
            <ol className="what-list">
              {areas.map((area, index) => (
                <li key={area.name} className="what-col">
                  <p className="what-num" aria-hidden="true">{pad(index + 1)}</p>
                  <h3 className="what-name">{area.name}</h3>
                  <div className="what-bottom">
                    <p className="what-desc">{area.text}</p>
                    <div>
                      <h4 className="what-sub">Used</h4>
                      <ul className="what-tools">{area.tools.map((tool) => <li key={tool}>{tool}</li>)}</ul>
                    </div>
                    <div>
                      <h4 className="what-sub">Seen in</h4>
                      <p className="what-seen">
                        {area.projects.map((project) => (
                          <a key={project.name} href={`#${caseId(project.name)}`}>{project.name} <span aria-hidden="true">→</span></a>
                        ))}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="projects" id="projects" data-theme="ink" aria-labelledby="projects-title">
            <div className="work-track" style={{ "--cases": projects.length }}>
              <div className="work-stage" data-mode="intro">
                <p className="section-label work-label" aria-hidden="true">(03) Selected projects — {total}</p>
                <h2 className="work-title" id="projects-title" aria-label="Selected projects">
                  <span>Selected</span><span>Projects</span>
                </h2>

                <div className="laptop">
                  <div className="screen-modes" role="group" aria-label="Laptop screen" hidden>
                    <span className="screen-modes-pill" aria-hidden="true" />
                    <button type="button" data-screen-mode="inside" aria-pressed="true">{"What's inside"}</button>
                    <button type="button" data-screen-mode="app" aria-pressed="false"><span className="play-glyph" aria-hidden="true" />Preview app</button>
                  </div>
                  <div className="laptop-lid">
                    <div className="laptop-screen">
                      <video className="screen-intro" muted loop playsInline preload="none" poster="/assets/selected-projects.webp" aria-hidden="true">
                        <source src="/assets/selected-projects.mp4" type="video/mp4" />
                      </video>
                      {projects.map((project, index) => (
                        <div key={project.name} className="screen-case" data-case={index} data-screen={project.screen ?? "pending"} data-demo={project.concepts[0]?.demo} aria-hidden="true">
                          <ProjectScreen project={project} index={index} />
                          {project.screen !== "slides" && project.concepts.length > 0 && <span className="screen-chip">{project.concepts[0].title}</span>}
                        </div>
                      ))}
                      {projects.map((project, index) => project.preview && (
                        <div key={project.name} className="app-preview" data-preview-for={index} role="region" aria-label={`${project.name} example app preview`} hidden>
                          <OneDPreview />
                        </div>
                      ))}
                      <span className="screen-flash" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="laptop-base" aria-hidden="true" />
                </div>

                <ol className="case-list">
                  {projects.map((project, index) => (
                    <li key={project.name} id={caseId(project.name)} className="case" data-case={index} data-preview={project.preview ? index : undefined}>
                      <article className="ticket">
                        <span className="punch" aria-hidden="true" />
                        <h3 className={project.name.length > 16 ? "is-long" : undefined}>{project.name}</h3>
                        <dl className="ticket-rows">
                          <div><dt>Scope</dt><dd>{project.scope}</dd></div>
                          <div><dt>Stack</dt><dd>{project.stack}</dd></div>
                          <div><dt>Period</dt><dd>{project.period}</dd></div>
                        </dl>
                      </article>
                      <div className="case-copy">
                        <p className="case-summary">{project.summary}</p>
                        {project.preview && (
                          <button type="button" className="preview-toggle" data-preview={index} aria-pressed="false">
                            <span className="when-closed">Preview example app</span>
                            <span className="when-open">Close preview</span>
                          </button>
                        )}
                        <p className="concept-head">
                          <span className="concept-label">{"// What's inside"}</span>
                          <span className="concept-explored">Explored <b>1</b> / {project.concepts.length}</span>
                        </p>
                        <ol className="concept-list" aria-label={`${project.name} concepts`}>
                          {project.concepts.map((concept, order) => (
                            <li key={concept.title}>
                              <button type="button" className="concept" data-concept={order} data-demo={concept.demo} aria-pressed={order === 0} data-seen={order === 0 || undefined}>
                                <span className="concept-num" aria-hidden="true">{pad(order + 1)}</span>
                                <span className="concept-title">{concept.title}</span>
                                <span className="concept-tag">{concept.tag}</span>
                              </button>
                            </li>
                          ))}
                        </ol>
                        <div className="concept-detail" aria-live="polite">
                          {project.concepts.map((concept, order) => (
                            <div key={concept.title} data-concept-detail={order} hidden={order !== 0}>
                              <p className="concept-index"><span className="concept-just">Just used · </span>Concept {pad(order + 1)} / {pad(project.concepts.length)}</p>
                              <h4>{concept.title}</h4>
                              <p>{concept.text}</p>
                              {concept.learn && <p className="concept-learn"><span>Learning</span>{concept.learn}</p>}
                              {concept.measured && <p className="concept-learn"><span>Measured</span>{concept.measured}</p>}
                            </div>
                          ))}
                        </div>
                        <p className="case-count" aria-hidden="true">{pad(index + 1)} / {total}</p>
                      </div>
                    </li>
                  ))}
                </ol>

                <div className="case-nav">
                  <button type="button" className="case-button" data-step="-1">
                    <span className="case-circle" aria-hidden="true">←</span> previous case
                  </button>
                  <button type="button" className="case-button is-next" data-step="1">
                    next case <span className="case-circle" aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="contact" id="contact" data-theme="red" aria-labelledby="contact-title">
          <div className="frame">
            <p className="section-label" aria-hidden="true">(04) Contact</p>
            <div className="contact-main">
              <div>
                <h2 id="contact-title" data-reveal>Get in<br />touch.</h2>
                <p>ช่องทางติดต่อจะเพิ่มเติมภายหลัง</p>
              </div>
              <a className="work-link" href="#home">Back to home <span aria-hidden="true">←</span></a>
            </div>
            <div className="footer-meta">
              <span>Nuttawat Saepan</span>
              <span>Software Engineer — Web / Apps / Robotics</span>
              <span>Built with Next.js</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
