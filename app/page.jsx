import Image from "next/image";
import Opening from "./motion";
import Sidebar from "./sidebar";

const projects = [
  {
    name: "oneD",
    scope: "Video Platform & Content CMS",
    contributions: [
      ["Video playback", "ปรับ Shorts Player และฟีด For You แก้การเล่นคลิปถัดไปบน Safari ปรับ autoplay และ tap-to-unmute รวมถึงจัดการกรณีโฆษณาโหลดไม่สำเร็จหรือหมดเวลา"],
      ["Content CMS", "ทำหน้ารายละเอียดวิดีโอและส่วนจัดการเพลย์ลิสต์ ปรับการอัปโหลดซับ VTT และไฟล์ ZIP เพิ่ม validation เวลาถอดคอนเทนต์ และปรับการจำแท็บด้วย Pinia"],
    ],
  },
  {
    name: "ThaiThai",
    scope: "Live Commerce",
    contributions: [
      ["Seller flow", "ใช้ Flutter พัฒนาหน้าฝั่งผู้ขาย ตั้งแต่เตรียมไลฟ์และเลือกสินค้า ไปจนถึงปักหมุดสินค้าระหว่างไลฟ์และดูสถิติหลังจบไลฟ์"],
    ],
  },
  {
    name: "Unitree Go2",
    scope: "Navigation & Mission System",
    contributions: [
      ["Mapping & navigation", "ใช้ Livox Mid-360 เก็บข้อมูล LiDAR ใช้ FAST-LIO ทำแผนที่และประมาณการเคลื่อนที่ และใช้ Nav2 วางเส้นทางให้หุ่นยนต์สี่ขา"],
      ["Mission integration", "ใช้ MQTT รับภารกิจและรายงานความคืบหน้า"],
    ],
  },
  {
    name: "Tank Depot",
    scope: "Operations Web App",
    description: "เว็บจัดการแทงก์ในเดโป มีหน้าคลังแทงก์ ระบบแจ้งปัญหา การทำใบประเมินค่าซ่อม และการออกใบแจ้งหนี้",
  },
  {
    name: "Autonomous Beach Cleaning Robot",
    scope: "Robotics",
    description: "โปรเจกต์ซอฟต์แวร์สำหรับหุ่นยนต์ทำความสะอาดชายหาดอัตโนมัติ",
  },
];

const stack = [
  ["Flutter", "ThaiThai · หน้าฝั่งผู้ขาย"],
  ["Pinia", "oneD · การจำแท็บใน CMS"],
  ["ROS 2", "ระบบหุ่นยนต์"],
  ["Nav2", "Unitree Go2 · การวางเส้นทาง"],
  ["FAST-LIO", "Unitree Go2 · การทำแผนที่และประมาณการเคลื่อนที่"],
  ["MQTT", "Unitree Go2 · รับภารกิจและรายงานความคืบหน้า"],
  ["Livox Mid-360", "Unitree Go2 · อุปกรณ์ LiDAR"],
];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">ข้ามไปยังเนื้อหา</a>
      <Opening />
      <Sidebar />

      <div className="portfolio-viewport">
        <main id="main">
          <section className="hero dark" id="home" aria-labelledby="home-title">
            <div className="frame hero-inner">
              <div className="hero-top">
                <p className="eyebrow role">Software Engineer</p>
                <p className="eyebrow disciplines">Web / Apps / Robotics</p>
              </div>
              <h1 id="home-title" className="hero-name">
                <span><span>Nuttawat</span></span>
                <span><span>Saepan</span></span>
              </h1>
              <div className="hero-bottom">
                <p lang="en">I build web and mobile apps, from live commerce and video platforms to robotics systems.</p>
                <a className="work-link hero-scroll" href="#profile">Scroll</a>
              </div>
            </div>
          </section>

          <section className="profile light" id="profile" aria-labelledby="profile-title">
            <div className="frame profile-grid">
              <h2 id="profile-title">Quick intro</h2>
              <p className="profile-intro">ผม Nuttawat Saepan พัฒนาซอฟต์แวร์ตั้งแต่เว็บและแอป ไปจนถึงระบบหุ่นยนต์ มีประสบการณ์กับ Live Commerce, Video Playback, เครื่องมือจัดการคอนเทนต์ และ Systems Integration</p>
              <figure className="portrait">
                <Image src="/assets/nuttawat-saepan.webp" alt="Nuttawat Saepan" width={1000} height={1500} sizes="(max-width: 680px) 90vw, min(40vw, 45vh)" />
              </figure>
              <a className="profile-link" href="#projects">View projects <span aria-hidden="true">→</span></a>
            </div>
          </section>

          <section className="projects light" id="projects" aria-labelledby="projects-title">
            <div className="frame">
              <div className="work-opening">
                <div className="work-stage">
                  <h2 className="work-title" id="projects-title" aria-label="Selected projects">
                    <span>Selected</span><span>Projects</span>
                  </h2>
                  <div className="work-media" aria-hidden="true">
                    <video muted loop playsInline preload="none" poster="/assets/selected-projects.webp">
                      <source src="/assets/selected-projects.mp4" type="video/mp4" />
                    </video>
                  </div>
                </div>
              </div>
              <ol className="project-list">
                {projects.map((project, index) => (
                  <li key={project.name} className="project">
                    <span className="project-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                    <div className="project-title">
                      <h3>{project.name}</h3>
                      <p>{project.scope}</p>
                    </div>
                    <div className="project-description">
                      {project.description && <p>{project.description}</p>}
                      {project.contributions?.map(([label, description]) => (
                        <div key={label} className="contribution">
                          <h4>{label}</h4>
                          <p>{description}</p>
                        </div>
                      ))}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="techstack" id="techstack" aria-labelledby="stack-title">
            <div className="frame stack-grid">
              <h2 id="stack-title">Techstack<span>.</span></h2>
              <dl className="stack-list">
                {stack.map(([name, usage]) => <div key={name}><dt>{name}</dt><dd>{usage}</dd></div>)}
              </dl>
            </div>
          </section>
        </main>

        <footer className="contact dark" id="contact" aria-labelledby="contact-title">
          <div className="frame">
            <div className="contact-main">
              <div>
                <h2 id="contact-title" data-reveal>Get in<br />touch<span>.</span></h2>
                <p>ช่องทางติดต่อจะเพิ่มเติมภายหลัง</p>
              </div>
              <a className="work-link" href="#home">Back to home <span aria-hidden="true">←</span></a>
            </div>
            <div className="footer-meta">
              <span>Nuttawat Saepan</span>
              <span>Built with Next.js</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
