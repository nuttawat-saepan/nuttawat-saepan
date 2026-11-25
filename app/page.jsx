import Image from "next/image";
import Opening from "./motion";
import Sidebar from "./sidebar";
import Link from "next/link";
import SelectedWork from "./selected-work";
import Contact from "./contact";
import HeroName from "./hero-name";
import { areas, projectSlug } from "./projects";

const pad = (value) => String(value).padStart(2, "0");

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
              <HeroName />
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
            {/* Chapter I, after the reference: the chapter label top left and a note bottom left; the
                intro, caption, link and portrait fill the right half. */}
            <div className="frame profile-grid">
              <p className="chapter" aria-hidden="true"><span className="chapter-num">01</span><span className="chapter-name">/ profile</span></p>
              <div className="profile-main">
                <h2 id="profile-title" className="section-label">Quick intro</h2>
                <p className="profile-intro">ผม Nuttawat Saepan พัฒนาซอฟต์แวร์ตั้งแต่เว็บและแอป ไปจนถึงระบบหุ่นยนต์ มีประสบการณ์กับ Live Commerce, Video Playback, เครื่องมือจัดการคอนเทนต์ และ Systems Integration</p>
                <figure className="portrait">
                  <Image src="/assets/nuttawat-saepan.webp" alt="Nuttawat Saepan" width={1000} height={1500} sizes="(max-width: 680px) 90vw, min(25vw, 45vh)" />
                </figure>
                <div className="profile-foot">
                  <p className="portrait-caption">Software Engineer<br />Web / Apps / Robotics</p>
                </div>
              </div>
              <p className="profile-note" lang="en">Off the web: robots — ROS 2, Nav2 and AprilTags.</p>
            </div>
          </section>

          {/* THE WORK: the row holds still while a film grows from nothing between the two words,
              pushes them off the sides and fills the screen; then the row carries on (motion.jsx). */}
          <section className="the-work" id="work" data-theme="paper" aria-label="The work">
            <div className="tw-stage">
              <p className="tw-words" aria-hidden="true"><span>The</span><span>Work</span></p>
              <div className="tw-film">
                {/* the-work.mp4 is the user's generated montage; until it exists the old montage plays */}
                <video className="tw-video" muted loop playsInline preload="none" poster="/assets/selected-projects.webp" aria-hidden="true">
                  <source src="/assets/the-work.mp4" type="video/mp4" />
                  <source src="/assets/selected-projects.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </section>

          <SelectedWork />

          <section className="what" id="what-i-do" data-theme="paper" aria-labelledby="what-title">
            <div className="what-intro">
              <p className="section-label" aria-hidden="true"><span>(03)</span> What I do</p>
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
                          <Link key={project.name} href={`/projects/${projectSlug(project.name)}`}>{project.name} <span aria-hidden="true">→</span></Link>
                        ))}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

        </main>

        <Contact />
      </div>
    </>
  );
}
