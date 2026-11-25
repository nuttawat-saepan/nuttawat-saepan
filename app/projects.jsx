import ConceptSlides from "./slides";

// Portfolio copy distilled from PROJECT_CONCEPTS.md. Keep it to work the user verified as their own:
// no commit hashes, file paths, teammate work, client data, or numbers that were never measured.
// "measured" holds a number the user actually measured, with the setup it was measured in.
// "tag" is the skill area shown beside each concept. "demo" names the screen state a concept shows
// (and, for oneD, its slide in slides.jsx); add "at" (seconds) once a project has a real video.

export const projects = [
  {
    name: "oneD",
    scope: "Video Platform — Shorts",
    stack: "Nuxt 3 · Vue · Pinia · VePlayer",
    period: "2025-09 → 2026-02",
    summary: "เขียนฟีเจอร์ Shorts เกือบทั้งหมด ตั้งแต่ player ฟีด ไปจนถึงโฆษณา",
    screen: "slides",
    preview: true,
    concepts: [
      { title: "Single shared player", icon: "play", tag: "PERF", demo: "shared", text: "ใช้ video player ตัวเดียวทั้งฟีด ย้ายไปไว้ในช่องที่กำลังดู ช่องอื่นแสดงแค่ thumbnail" },
      { title: "Windowed mounting", icon: "layers", tag: "PERF", demo: "window", text: "mount เฉพาะคลิปปัจจุบัน ±1 ที่ไกลกว่านั้นทำลายทิ้ง ทั้ง player และช่องโฆษณา" },
      { title: "Two-way cursor feed", icon: "feed", tag: "DATA", demo: "cursor", text: "โหลดหน้าถัดไปเมื่อเหลืออีก 3–5 คลิป และเปิดลิงก์เข้ากลาง playlist ได้ แล้วเติมข้อมูลด้านบนแทน placeholder ในตำแหน่งเดิม scroll จึงไม่กระโดด" },
      { title: "Optimistic UI", icon: "heart", tag: "UX", demo: "optimistic", text: "ติดตามและไลก์อัปเดตบนจอทันทีแล้ว rollback ถ้าล้มเหลว ไลก์และบุ๊กมาร์ก debounce 400 ms แล้วส่งเฉพาะสถานะสุดท้าย" },
      { title: "Ad preload", icon: "adSlot", tag: "PERF", demo: "adpreload", text: "IMA ใช้ flag กันโหลดซ้ำ ส่วน GPT สร้าง slot ไว้ก่อนตอนใกล้ถึง แล้วค่อยแสดงเมื่อถึงจริง พร้อม event ที่ยิงก่อนคลิปจบ" },
      { title: "Lean data mapping", icon: "funnel", tag: "DATA", demo: "mapping", text: "map ข้อมูลให้เหลือแค่ฟิลด์ที่ใช้ และกรองคลิปที่ไม่มี URL หรือไม่มีช่องออกก่อนแสดง" },
      { title: "Autoplay policy", icon: "volume", tag: "UX", demo: "autoplay", text: "เริ่มเล่นแบบปิดเสียง แชร์สถานะเสียงทั้งฟีด และปุ่มแตะเพื่อเปิดเสียงจำค่าไว้" },
    ],
  },
  {
    name: "ThaiThai",
    scope: "Live Commerce — App + Backend",
    stack: "Flutter · NestJS · PostgreSQL · BullMQ",
    period: "2025-12 → 2026-10",
    summary: "ฟีดวิดีโอ ตัวตัดต่อ และไลฟ์สตรีมฝั่งแอป พร้อม checkout, video pipeline และการเชื่อมมาร์เก็ตเพลสฝั่ง backend",
    screen: "slides",
    concepts: [
      { title: "Swipe-to-play feed", icon: "skipNext", tag: "PERF", demo: "feed", text: "เตรียม player ของคลิปถัดไปโดยไม่เล่นเพื่อ buffer ช่วงต้นไว้ และเริ่มหลังคลิปปัจจุบันขึ้นเฟรมแรกแล้วเท่านั้นจึงไม่แย่ง bandwidth ปัดแล้วเล่นทันที" },
      { title: "Player cache", icon: "server", tag: "PERF", demo: "cache", text: "debounce การ preload 400 ms และเก็บ native player ไม่เกิน 3 ตัว ตัวที่ไกลจากคลิปปัจจุบันที่สุดถูก dispose ก่อน" },
      { title: "Oversell-proof checkout", icon: "lock", tag: "BACKEND", demo: "checkout", text: "checkout ทั้งหมดอยู่ใน transaction เดียว ใช้ idempotency key ล็อกแถวสต็อก จองสต็อกแบบมีเวลาหมดอายุ และตอบ 409 เมื่อราคาเปลี่ยน", measured: "50 คนกดพร้อมกัน สต็อก 10 (integration test): ไม่ lock ขายเกิน 37–40 · ระบบนี้ขาย 10 พอดี · กดซ้ำ 10 ครั้งได้ 1 ออร์เดอร์" },
      { title: "Video pipeline", icon: "upload", tag: "BACKEND", demo: "pipeline", text: "อัปโหลดตรงจากแอปไปผู้ให้บริการวิดีโอ ตรวจลายเซ็นของ callback มีงาน reconciliation ทุกนาที และคิว thumbnail ที่ลองใหม่ตามตาราง" },
      { title: "Live streaming", icon: "broadcast", tag: "REALTIME", demo: "live", text: "ถ่ายทอดผ่าน RTMP เล่นผ่าน HLS ส่ง heartbeat ทุก 25 วินาที reconnect โดยไม่สร้างห้องใหม่ และมีโควตาไลฟ์รายวัน" },
      { title: "Marketplace sync", icon: "store", tag: "API", demo: "market", text: "sync สินค้าและสต็อกกับ TikTok Shop, Lazada, Shopee และ LINE MyShop พร้อมจำกัดอัตราเรียก API และลองใหม่ตาม Retry-After" },
      { title: "Video editor", icon: "film", tag: "UX", demo: "editor", text: "ตัวตัดต่อวิดีโอในแอป มี filmstrip timeline เลือกเฟรมหน้าปก ข้อความซ้อน preview และ export" },
    ],
  },
  {
    name: "Tank Depot",
    screen: "slides",
    scope: "Depot Management System",
    stack: "Nuxt 3 · Pinia · Yup · NestJS · TypeORM · MySQL",
    period: "2025-02 → 2026-10",
    summary: "พัฒนาและปรับปรุง workflow ใบประเมินค่าซ่อม ใบแจ้งหนี้ การเบิกคืนอะไหล่ และรายงาน ร่วมกับทีม",
    concepts: [
      { title: "Debounced search", icon: "search", tag: "UX", demo: "search", text: "ค้นหาเมื่อผู้ใช้หยุดปรับตัวกรอง 250 ms ยกเลิก timer เดิม และล้าง timer เมื่อปิด modal", learn: "Watchers, timers และ cleanup" },
      { title: "Persistent selection", icon: "check", tag: "STATE", demo: "selection", text: "เปลี่ยนหน้าแล้วรายการที่เลือกยังอยู่ เพราะแยก selected IDs ออกจากข้อมูลของหน้าปัจจุบัน", learn: "State separation, Set และ stable identity" },
      { title: "Conditional forms", icon: "form", tag: "FORMS", demo: "forms", text: "ฟอร์มปรับตามกติกาของงาน เช่น วันตัดยอดกลายเป็น required ตามประเภท invoice", learn: "Yup, reactive state และ validation" },
      { title: "Transactional workflow", icon: "exchange", tag: "BACKEND", demo: "transaction", text: "เชื่อม event ค่าล้างและค่ายกเข้ากับใบประเมินใน transaction เดียว พร้อมตรวจ business rules แล้ว commit หรือ rollback", learn: "Commit, rollback และ business rules" },
      { title: "Lot-based inventory", icon: "boxes", tag: "DATA", demo: "lots", text: "เบิกอะไหล่โดยตัดจำนวนข้ามหลาย lot ตามลำดับเวลา เก็บ log และตรวจยอดคืนเทียบกับยอดเบิก", learn: "Quantity allocation และ inventory logs" },
      { title: "Historical reporting", icon: "calendar", tag: "DATA", demo: "history", text: "รายงานย้อนหลังใช้ยอดปลายงวดจาก snapshot รายเดือน แทนการใช้ยอดคงเหลือปัจจุบัน", learn: "Snapshot, cutoff และ temporal mapping" },
      { title: "Parallel report export", icon: "zip", tag: "PERF", demo: "export", text: "สร้าง Excel แยกลูกค้าพร้อมกันด้วย Promise.all แล้วรวมเป็น ZIP", learn: "Promise.all, ExcelJS และ trade-off ของการบีบอัด" },
    ],
  },
  {
    name: "Beach Robot",
    screen: "slides",
    scope: "Autonomous Beach Cleaning Robot",
    stack: "ROS 2 · Nav2 · EKF · MQTT · Arduino · Webots",
    period: "2026-10",
    summary: "ระบบควบคุมและนำทางหุ่นยนต์ทำความสะอาดชายหาด ตั้งแต่ firmware, localization และ coverage planning จนถึง mission และ simulator",
    concepts: [
      { title: "Coverage planning", icon: "coverage", tag: "PLANNING", demo: "coverage", text: "สร้างแถววิ่งจาก polygon ที่หดขอบตาม margin ตัด exclusion zones และหมุนแนวตาม bearing", learn: "Polygon operations และการสร้าง waypoint ให้ครอบคลุมพื้นที่" },
      { title: "GNSS + sensor fusion", icon: "crosshair", tag: "SENSING", demo: "gnss", text: "แปลง GNSS เป็น local ENU ชดเชยตำแหน่งเสาอากาศด้วย TF และรวม odometry เข้ากับ EKF", learn: "Coordinate frames และการแยก map / odom" },
      { title: "Safety watchdog", icon: "shield", tag: "SAFETY", demo: "watchdog", text: "firmware หยุดมอเตอร์เมื่อขาดคำสั่งเกิน 300 ms พร้อม PWM ramp และ safety monitor ที่ตรวจ RTK, geofence และกรณีล้อไม่หมุน", learn: "การออกแบบเงื่อนไขหยุดและปลดล็อก" },
      { title: "Async result guard", icon: "hourglass", tag: "SYSTEM", demo: "guard", text: "ใช้ sequence / epoch กัน callback ของ goal เก่ามาเปลี่ยนสถานะปัจจุบัน และรอ cancel จบจริงก่อนรับแผนใหม่", learn: "Race conditions ระหว่าง goal, pause, stop และ cancel" },
      { title: "Idempotent routes", icon: "hash", tag: "API", demo: "routes", text: "คำขอซ้ำได้คำตอบเดิมตาม plan ID และ payload hash ส่วน ID เดิมที่ payload เปลี่ยนถูกปฏิเสธ", learn: "Request deduplication" },
      { title: "Simulation + faults", icon: "flask", tag: "TEST", demo: "faults", text: "จำลอง MCU และ GNSS ผ่าน pseudo-terminal ใช้ Webots และทดสอบกรณี RTK หลุด สิ่งกีดขวาง และมอเตอร์ไม่ตอบสนอง", learn: "ทดสอบทั้ง happy path และ failure / recovery" },
    ],
  },
  {
    name: "Unitree Go2",
    screen: "slides",
    scope: "Autonomous Navigation",
    stack: "ROS 2 · Nav2 · FAST-LIO · OpenCV · MQTT",
    period: "2026-08",
    summary: "ทดสอบและปรับระบบนำทางของหุ่นยนต์สี่ขา ทั้ง simulator, navigation config, AprilTag และเครื่องมือ deploy",
    concepts: [
      { title: "Closed-loop simulation", icon: "loop", tag: "TEST", demo: "sim", text: "หุ่นจำลองรับ velocity จาก Nav2 แล้วส่ง pose, odometry, TF และ LaserScan กลับเข้าระบบ เพื่อทดสอบ mission สอง waypoint ใน simulation", learn: "Feedback loop และ integration testing ของ robotics" },
      { title: "Nav2 root cause", icon: "bug", tag: "DEBUG", demo: "nav2", text: "ไล่อาการที่หุ่นหมุนได้แต่เดินหน้าไม่ได้ จนพบ kinematic limit ที่ขาดใน config แล้วยืนยันด้วย goal ใน simulation", learn: "เชื่อมพฤติกรรมของ controller กับ configuration" },
      { title: "AprilTag detection", icon: "tag", tag: "VISION", demo: "apriltag", text: "OpenCV detector ที่รักษาลำดับ corners ให้ตรงกับ solvePnP ของ localizer และตรวจทุก N เฟรมเพื่อลดงานบนบอร์ด", learn: "Corner ordering, camera intrinsics และ coordinate transforms" },
      { title: "MQTT test broker", icon: "message", tag: "COMMS", demo: "broker", text: "broker สำหรับทดสอบที่ parse packet เอง รองรับ wildcard + และ # และป้องกัน shared state ด้วย lock", learn: "Publish / subscribe และ connection lifecycle" },
      { title: "Deploy + diagnostics", icon: "terminal", tag: "DEVOPS", demo: "deploy", text: "สคริปต์ sync และ build package บนบอร์ดด้วย rsync และ colcon พร้อมเครื่องมือตรวจ DDS และ network เมื่อหา node ไม่เจอ", learn: "Deployment workflow และการไล่ปัญหาระบบกระจาย" },
    ],
  },
];

const icons = {
  play: <path d="M7 4v16l13-8z" />,
  layers: <path d="m12 4 8 4-8 4-8-4zM4 12l8 4 8-4M4 16l8 4 8-4" />,
  feed: <path d="M4 6h16M4 12h16M4 18h9M18 15v6M15.5 18.5 18 21l2.5-2.5" />,
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
  adSlot: <><rect x="3" y="6" width="18" height="12" rx="2" /><path d="m7 15 2-6 2 6M7.7 13h2.6M14 9v6h1.5a3 3 0 0 0 0-6z" /></>,
  funnel: <path d="M4 5h16l-6 7v6l-4 2v-8z" />,
  volume: <path d="M4 9v6h4l5 4V5L8 9H4zM17 9a4 4 0 0 1 0 6M19.5 6.5a8 8 0 0 1 0 11" />,
  skipNext: <path d="M6 5v14l10-7zM18 5v14" />,
  server: <path d="M4 5h16v6H4zM4 13h16v6H4zM8 8h.01M8 16h.01" />,
  lock: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  upload: <path d="M12 16V5M7 10l5-5 5 5M5 20h14" />,
  broadcast: <><circle cx="12" cy="12" r="2" /><path d="M8.5 15.5a5 5 0 0 1 0-7M15.5 8.5a5 5 0 0 1 0 7M5.6 18.4a9 9 0 0 1 0-12.8M18.4 5.6a9 9 0 0 1 0 12.8" /></>,
  store: <path d="M4 9 5.5 4h13L20 9M4 9h16v11H4zM9 20v-6h6v6" />,
  film: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 4v16M16 4v16M4 8h4M4 12h4M4 16h4M16 8h4M16 12h4M16 16h4" /></>,
  loop: <path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4" />,
  bug: <><rect x="8" y="8" width="8" height="11" rx="4" /><path d="M12 8V5M9 5l1.5 2M15 5l-1.5 2M4 12h4M16 12h4M5 18l3-2M19 18l-3-2" /></>,
  tag: <><rect x="4" y="4" width="16" height="16" /><path d="M8 8h3v3H8zM13 13h3v3h-3zM13 8h3M8 16h3" /></>,
  message: <path d="M4 5h16v11H8l-4 4zM8 10h8" />,
  terminal: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m7 10 3 2-3 2M13 15h4" /></>,
  search: <><circle cx="11" cy="11" r="6" /><path d="m20 20-4.5-4.5" /></>,
  check: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="m8 12 3 3 5-6" /></>,
  form: <path d="M6 3h12v18H6zM9 8h6M9 12h6M9 16h3" />,
  exchange: <path d="M4 8h13l-3-3M20 16H7l3 3" />,
  boxes: <path d="M3 13h8v7H3zM13 13h8v7h-8zM8 4h8v7H8z" />,
  calendar: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M9 3v4M15 3v4" /></>,
  zip: <path d="M14 3H6v18h12V7zM14 3v4h4M10 7h2M10 10h2M10 13h2v3h-2z" />,
  coverage: <path d="M4 6h16v4H4v4h16v4H4" />,
  crosshair: <><circle cx="12" cy="12" r="7" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4" /><circle cx="12" cy="12" r="1.5" /></>,
  shield: <path d="m12 3 8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4" />,
  hourglass: <path d="M7 3h10M7 21h10M8 3c0 5 8 5 8 9s-8 4-8 9M16 3c0 5-8 5-8 9s8 4 8 9" />,
  hash: <path d="M5 9h14M5 15h14M10 4 8 20M16 4l-2 16" />,
  flask: <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3M7 15h10" />,
};

export function Icon({ name }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}

export function ProjectScreen({ project, index }) {
  if (project.screen === "slides") return <ConceptSlides concepts={project.concepts} />;
  return (
    <>
      <span className="screen-index">{String(index + 1).padStart(2, "0")}</span>
      <span className="screen-name">{project.shortName ?? project.name}</span>
      <span className="screen-note">Video preview coming soon</span>
    </>
  );
}

// Chapter "What I do": three areas matching "Web / Apps / Robotics". Tools are taken from the
// stacks of the projects listed under each area, so nothing appears that a project didn't use.
// The one-line descriptions are drafts for the user to confirm.
const areaList = [
  { name: "Web", text: "เว็บแอปที่ทำงานกับวิดีโอและ workflow ข้อมูล ตั้งแต่ฟีด Shorts ไปจนถึงระบบจัดการลานถัง", projects: ["oneD", "Tank Depot"] },
  { name: "Apps", text: "แอปมือถือสำหรับ live commerce ทั้งฟีดวิดีโอ ตัวตัดต่อ ไลฟ์สตรีม และ backend ที่อยู่เบื้องหลัง", projects: ["ThaiThai"] },
  { name: "Robotics", text: "ระบบนำทางและควบคุมหุ่นยนต์ ทั้งใน simulator และบนตัวเครื่อง", projects: ["Beach Robot", "Unitree Go2"] },
];

export const caseId = (name) => `case-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

export const areas = areaList.map((area) => {
  const used = area.projects.map((name) => projects.find((project) => project.name === name));
  return { ...area, projects: used, tools: [...new Set(used.flatMap((project) => project.stack.split(" · ")))] };
});

// URL segment for a project's own page: /projects/oned, /projects/unitree-go2, …
export const projectSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
