import ConceptSlides from "./slides";

// Portfolio copy distilled from PROJECT_CONCEPTS.md. Keep it to work the user verified as their own:
// no commit hashes, file paths, teammate work, client data, or numbers that were never measured.
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
      { title: "Single shared player", tag: "PERF", demo: "shared", text: "ใช้ video player ตัวเดียวทั้งฟีด ย้ายไปไว้ในช่องที่กำลังดู ช่องอื่นแสดงแค่ thumbnail" },
      { title: "Windowed mounting", tag: "PERF", demo: "window", text: "mount เฉพาะคลิปปัจจุบัน ±1 ที่ไกลกว่านั้นทำลายทิ้ง ทั้ง player และช่องโฆษณา" },
      { title: "Two-way cursor feed", tag: "DATA", demo: "cursor", text: "โหลดหน้าถัดไปเมื่อเหลืออีก 3–5 คลิป และเปิดลิงก์เข้ากลาง playlist ได้ แล้วเติมข้อมูลด้านบนแทน placeholder ในตำแหน่งเดิม scroll จึงไม่กระโดด" },
      { title: "Optimistic UI", tag: "UX", demo: "optimistic", text: "ติดตามและไลก์อัปเดตบนจอทันทีแล้ว rollback ถ้าล้มเหลว ไลก์และบุ๊กมาร์ก debounce 400 ms แล้วส่งเฉพาะสถานะสุดท้าย" },
      { title: "Ad preload", tag: "PERF", demo: "adpreload", text: "IMA ใช้ flag กันโหลดซ้ำ ส่วน GPT สร้าง slot ไว้ก่อนตอนใกล้ถึง แล้วค่อยแสดงเมื่อถึงจริง พร้อม event ที่ยิงก่อนคลิปจบ" },
      { title: "Lean data mapping", tag: "DATA", demo: "mapping", text: "map ข้อมูลให้เหลือแค่ฟิลด์ที่ใช้ และกรองคลิปที่ไม่มี URL หรือไม่มีช่องออกก่อนแสดง" },
      { title: "Autoplay policy", tag: "UX", demo: "autoplay", text: "เริ่มเล่นแบบปิดเสียง แชร์สถานะเสียงทั้งฟีด และปุ่มแตะเพื่อเปิดเสียงจำค่าไว้" },
    ],
  },
  {
    name: "ThaiThai",
    scope: "Live Commerce — App + Backend",
    stack: "Flutter · NestJS · PostgreSQL · BullMQ",
    period: "2025-12 → 2026-10",
    summary: "ฟีดวิดีโอ ตัวตัดต่อ และไลฟ์สตรีมฝั่งแอป พร้อม checkout, video pipeline และการเชื่อมมาร์เก็ตเพลสฝั่ง backend",
    screen: "thaithai",
    concepts: [
      { title: "Swipe-to-play feed", tag: "PERF", demo: "feed", text: "เตรียม player ของคลิปถัดไปโดยไม่เล่นเพื่อ buffer ช่วงต้นไว้ และเริ่มหลังคลิปปัจจุบันขึ้นเฟรมแรกแล้วเท่านั้นจึงไม่แย่ง bandwidth ปัดแล้วเล่นทันที" },
      { title: "Player cache", tag: "PERF", demo: "cache", text: "debounce การ preload 400 ms และเก็บ native player ไม่เกิน 3 ตัว ตัวที่ไกลจากคลิปปัจจุบันที่สุดถูก dispose ก่อน" },
      { title: "Oversell-proof checkout", tag: "BACKEND", demo: "checkout", text: "checkout ทั้งหมดอยู่ใน transaction เดียว ใช้ idempotency key ล็อกแถวสต็อก จองสต็อกแบบมีเวลาหมดอายุ และตอบ 409 เมื่อราคาเปลี่ยน" },
      { title: "Video pipeline", tag: "BACKEND", demo: "pipeline", text: "อัปโหลดตรงจากแอปไปผู้ให้บริการวิดีโอ ตรวจลายเซ็นของ callback มีงาน reconciliation ทุกนาที และคิว thumbnail ที่ลองใหม่ตามตาราง" },
      { title: "Live streaming", tag: "REALTIME", demo: "live", text: "ถ่ายทอดผ่าน RTMP เล่นผ่าน HLS ส่ง heartbeat ทุก 25 วินาที reconnect โดยไม่สร้างห้องใหม่ และมีโควตาไลฟ์รายวัน" },
      { title: "Marketplace sync", tag: "API", demo: "market", text: "sync สินค้าและสต็อกกับ TikTok Shop, Lazada, Shopee และ LINE MyShop พร้อมจำกัดอัตราเรียก API และลองใหม่ตาม Retry-After" },
      { title: "Video editor", tag: "UX", demo: "editor", text: "ตัวตัดต่อวิดีโอในแอป มี filmstrip timeline เลือกเฟรมหน้าปก ข้อความซ้อน preview และ export" },
    ],
  },
  {
    name: "Unitree Go2",
    scope: "Autonomous Navigation",
    stack: "ROS 2 · Nav2 · FAST-LIO · OpenCV · MQTT",
    period: "2026-08",
    summary: "ทดสอบและปรับระบบนำทางของหุ่นยนต์สี่ขา ทั้ง simulator, navigation config, AprilTag และเครื่องมือ deploy",
    concepts: [
      { title: "Closed-loop simulation", tag: "TEST", text: "หุ่นจำลองรับ velocity จาก Nav2 แล้วส่ง pose, odometry, TF และ LaserScan กลับเข้าระบบ เพื่อทดสอบ mission สอง waypoint ใน simulation", learn: "Feedback loop และ integration testing ของ robotics" },
      { title: "Nav2 root cause", tag: "DEBUG", text: "ไล่อาการที่หุ่นหมุนได้แต่เดินหน้าไม่ได้ จนพบ kinematic limit ที่ขาดใน config แล้วยืนยันด้วย goal ใน simulation", learn: "เชื่อมพฤติกรรมของ controller กับ configuration" },
      { title: "AprilTag detection", tag: "VISION", text: "OpenCV detector ที่รักษาลำดับ corners ให้ตรงกับ solvePnP ของ localizer และตรวจทุก N เฟรมเพื่อลดงานบนบอร์ด", learn: "Corner ordering, camera intrinsics และ coordinate transforms" },
      { title: "MQTT test broker", tag: "COMMS", text: "broker สำหรับทดสอบที่ parse packet เอง รองรับ wildcard + และ # และป้องกัน shared state ด้วย lock", learn: "Publish / subscribe และ connection lifecycle" },
      { title: "Deploy + diagnostics", tag: "DEVOPS", text: "สคริปต์ sync และ build package บนบอร์ดด้วย rsync และ colcon พร้อมเครื่องมือตรวจ DDS และ network เมื่อหา node ไม่เจอ", learn: "Deployment workflow และการไล่ปัญหาระบบกระจาย" },
    ],
  },
  {
    name: "LCS",
    scope: "Tank Depot Management",
    stack: "Nuxt 3 · Pinia · Yup · NestJS · TypeORM · MySQL",
    period: "2025-02 → 2026-10",
    summary: "พัฒนาและปรับปรุง workflow ใบประเมินค่าซ่อม ใบแจ้งหนี้ การเบิกคืนอะไหล่ และรายงาน ร่วมกับทีม",
    concepts: [
      { title: "Debounced search", tag: "UX", text: "ค้นหาเมื่อผู้ใช้หยุดปรับตัวกรอง 250 ms ยกเลิก timer เดิม และล้าง timer เมื่อปิด modal", learn: "Watchers, timers และ cleanup" },
      { title: "Persistent selection", tag: "STATE", text: "เปลี่ยนหน้าแล้วรายการที่เลือกยังอยู่ เพราะแยก selected IDs ออกจากข้อมูลของหน้าปัจจุบัน", learn: "State separation, Set และ stable identity" },
      { title: "Conditional forms", tag: "FORMS", text: "ฟอร์มปรับตามกติกาของงาน เช่น วันตัดยอดกลายเป็น required ตามประเภท invoice", learn: "Yup, reactive state และ validation" },
      { title: "Transactional workflow", tag: "BACKEND", text: "เชื่อม event ค่าล้างและค่ายกเข้ากับใบประเมินใน transaction เดียว พร้อมตรวจ business rules แล้ว commit หรือ rollback", learn: "Commit, rollback และ business rules" },
      { title: "Lot-based inventory", tag: "DATA", text: "เบิกอะไหล่โดยตัดจำนวนข้ามหลาย lot ตามลำดับเวลา เก็บ log และตรวจยอดคืนเทียบกับยอดเบิก", learn: "Quantity allocation และ inventory logs" },
      { title: "Historical reporting", tag: "DATA", text: "รายงานย้อนหลังใช้ยอดปลายงวดจาก snapshot รายเดือน แทนการใช้ยอดคงเหลือปัจจุบัน", learn: "Snapshot, cutoff และ temporal mapping" },
      { title: "Parallel report export", tag: "PERF", text: "สร้าง Excel แยกลูกค้าพร้อมกันด้วย Promise.all แล้วรวมเป็น ZIP", learn: "Promise.all, ExcelJS และ trade-off ของการบีบอัด" },
    ],
  },
  {
    name: "Beachboy",
    scope: "Autonomous Beach Cleaning Robot",
    stack: "ROS 2 · Nav2 · EKF · MQTT · Arduino · Webots",
    period: "2026-10",
    summary: "ระบบควบคุมและนำทางหุ่นยนต์ทำความสะอาดชายหาด ตั้งแต่ firmware, localization และ coverage planning จนถึง mission และ simulator",
    concepts: [
      { title: "Coverage planning", tag: "PLANNING", text: "สร้างแถววิ่งจาก polygon ที่หดขอบตาม margin ตัด exclusion zones และหมุนแนวตาม bearing", learn: "Polygon operations และการสร้าง waypoint ให้ครอบคลุมพื้นที่" },
      { title: "GNSS + sensor fusion", tag: "SENSING", text: "แปลง GNSS เป็น local ENU ชดเชยตำแหน่งเสาอากาศด้วย TF และรวม odometry เข้ากับ EKF", learn: "Coordinate frames และการแยก map / odom" },
      { title: "Safety watchdog", tag: "SAFETY", text: "firmware หยุดมอเตอร์เมื่อขาดคำสั่งเกิน 300 ms พร้อม PWM ramp และ safety monitor ที่ตรวจ RTK, geofence และกรณีล้อไม่หมุน", learn: "การออกแบบเงื่อนไขหยุดและปลดล็อก" },
      { title: "Async result guard", tag: "SYSTEM", text: "ใช้ sequence / epoch กัน callback ของ goal เก่ามาเปลี่ยนสถานะปัจจุบัน และรอ cancel จบจริงก่อนรับแผนใหม่", learn: "Race conditions ระหว่าง goal, pause, stop และ cancel" },
      { title: "Idempotent routes", tag: "API", text: "คำขอซ้ำได้คำตอบเดิมตาม plan ID และ payload hash ส่วน ID เดิมที่ payload เปลี่ยนถูกปฏิเสธ", learn: "Request deduplication" },
      { title: "Simulation + faults", tag: "TEST", text: "จำลอง MCU และ GNSS ผ่าน pseudo-terminal ใช้ Webots และทดสอบกรณี RTK หลุด สิ่งกีดขวาง และมอเตอร์ไม่ตอบสนอง", learn: "ทดสอบทั้ง happy path และ failure / recovery" },
    ],
  },
];

function ThaiThaiMock() {
  const steps = {
    checkout: ["Cart", "Lock stock", "Reserve", "Order"],
    pipeline: ["Upload", "Signed callback", "Reconcile", "Thumbnail"],
  };
  return (
    <div className="mock mock-thaithai">
      <div className="t-phone">
        <span className="t-live">Live</span>
        <div className="t-panel t-feed"><p>Now playing</p><p>Next · buffered</p></div>
        <div className="t-panel t-cache">{["Player", "Player", "Player", "Dispose"].map((label, index) => <p key={index}>{label}</p>)}</div>
        {Object.entries(steps).map(([key, labels]) => (
          <ol key={key} className={`t-panel t-steps t-${key}`}>{labels.map((label) => <li key={label}>{label}</li>)}</ol>
        ))}
        <div className="t-panel t-stream"><p><i />RTMP → HLS</p><p><i />Heartbeat 25 s</p><p><i />Reconnect</p></div>
        <div className="t-panel t-market">{["TikTok Shop", "Lazada", "Shopee", "LINE MyShop"].map((shop) => <p key={shop}>{shop}</p>)}</div>
        <div className="t-panel t-editor"><div>{Array.from({ length: 6 }, (_, index) => <i key={index} />)}</div><p>Cover frame</p></div>
      </div>
    </div>
  );
}

export function ProjectScreen({ project, index }) {
  if (project.screen === "slides") return <ConceptSlides concepts={project.concepts} />;
  if (project.screen === "thaithai") return <ThaiThaiMock />;
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
  { name: "Web", text: "เว็บแอปที่ทำงานกับวิดีโอและ workflow ข้อมูล ตั้งแต่ฟีด Shorts ไปจนถึงระบบจัดการลานถัง", projects: ["oneD", "LCS"] },
  { name: "Apps", text: "แอปมือถือสำหรับ live commerce ทั้งฟีดวิดีโอ ตัวตัดต่อ ไลฟ์สตรีม และ backend ที่อยู่เบื้องหลัง", projects: ["ThaiThai"] },
  { name: "Robotics", text: "ระบบนำทางและควบคุมหุ่นยนต์ ทั้งใน simulator และบนตัวเครื่อง", projects: ["Unitree Go2", "Beachboy"] },
];

export const caseId = (name) => `case-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

export const areas = areaList.map((area) => {
  const used = area.projects.map((name) => projects.find((project) => project.name === name));
  return { ...area, projects: used, tools: [...new Set(used.flatMap((project) => project.stack.split(" · ")))] };
});
