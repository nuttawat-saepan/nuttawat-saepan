// Portfolio copy distilled from PROJECT_CONCEPTS.md. Keep it to work the user verified as their own:
// no commit hashes, file paths, teammate work, client data, or numbers that were never measured.
// "demo" names the screen state a concept shows; add "at" (seconds) once a project has a real video.

export const projects = [
  {
    name: "oneD",
    scope: "Video Platform — Shorts",
    stack: "Nuxt 3 · Vue · Pinia · VePlayer",
    period: "2025-09 → 2026-02",
    summary: "เขียนฟีเจอร์ Shorts เกือบทั้งหมด ตั้งแต่ player ฟีด ไปจนถึงโฆษณา",
    screen: "oned",
    concepts: [
      { icon: "play", title: "Single shared player", demo: "shared", text: "ใช้ video player ตัวเดียวทั้งฟีด ย้ายไปไว้ในช่องที่กำลังดู ช่องอื่นแสดงแค่ thumbnail" },
      { icon: "layers", title: "Windowed mounting", demo: "window", text: "mount เฉพาะคลิปปัจจุบัน ±1 ที่ไกลกว่านั้นทำลายทิ้ง ทั้ง player และช่องโฆษณา" },
      { icon: "feed", title: "Two-way cursor feed", demo: "cursor", text: "โหลดหน้าถัดไปเมื่อเหลืออีก 3–5 คลิป และเปิดลิงก์เข้ากลาง playlist ได้ แล้วเติมข้อมูลด้านบนแทน placeholder ในตำแหน่งเดิม scroll จึงไม่กระโดด" },
      { icon: "heart", title: "Optimistic UI", demo: "optimistic", text: "ติดตามและไลก์อัปเดตบนจอทันทีแล้ว rollback ถ้าล้มเหลว ไลก์และบุ๊กมาร์ก debounce 400 ms แล้วส่งเฉพาะสถานะสุดท้าย" },
      { icon: "adSlot", title: "Ad preload", demo: "adpreload", text: "IMA ใช้ flag กันโหลดซ้ำ ส่วน GPT สร้าง slot ไว้ก่อนตอนใกล้ถึง แล้วค่อยแสดงเมื่อถึงจริง พร้อม event ที่ยิงก่อนคลิปจบ" },
      { icon: "funnel", title: "Lean data mapping", demo: "mapping", text: "map ข้อมูลให้เหลือแค่ฟิลด์ที่ใช้ และกรองคลิปที่ไม่มี URL หรือไม่มีช่องออกก่อนแสดง" },
      { icon: "volume", title: "Autoplay policy", demo: "autoplay", text: "เริ่มเล่นแบบปิดเสียง แชร์สถานะเสียงทั้งฟีด และปุ่มแตะเพื่อเปิดเสียงจำค่าไว้" },
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
      { icon: "skipNext", title: "Swipe-to-play feed", demo: "feed", text: "เตรียม player ของคลิปถัดไปโดยไม่เล่นเพื่อ buffer ช่วงต้นไว้ และเริ่มหลังคลิปปัจจุบันขึ้นเฟรมแรกแล้วเท่านั้นจึงไม่แย่ง bandwidth ปัดแล้วเล่นทันที" },
      { icon: "server", title: "Player cache", demo: "cache", text: "debounce การ preload 400 ms และเก็บ native player ไม่เกิน 3 ตัว ตัวที่ไกลจากคลิปปัจจุบันที่สุดถูก dispose ก่อน" },
      { icon: "lock", title: "Oversell-proof checkout", demo: "checkout", text: "checkout ทั้งหมดอยู่ใน transaction เดียว ใช้ idempotency key ล็อกแถวสต็อก จองสต็อกแบบมีเวลาหมดอายุ และตอบ 409 เมื่อราคาเปลี่ยน" },
      { icon: "upload", title: "Video pipeline", demo: "pipeline", text: "อัปโหลดตรงจากแอปไปผู้ให้บริการวิดีโอ ตรวจลายเซ็นของ callback มีงาน reconciliation ทุกนาที และคิว thumbnail ที่ลองใหม่ตามตาราง" },
      { icon: "broadcast", title: "Live streaming", demo: "live", text: "ถ่ายทอดผ่าน RTMP เล่นผ่าน HLS ส่ง heartbeat ทุก 25 วินาที reconnect โดยไม่สร้างห้องใหม่ และมีโควตาไลฟ์รายวัน" },
      { icon: "store", title: "Marketplace sync", demo: "market", text: "sync สินค้าและสต็อกกับ TikTok Shop, Lazada, Shopee และ LINE MyShop พร้อมจำกัดอัตราเรียก API และลองใหม่ตาม Retry-After" },
      { icon: "film", title: "Video editor", demo: "editor", text: "ตัวตัดต่อวิดีโอในแอป มี filmstrip timeline เลือกเฟรมหน้าปก ข้อความซ้อน preview และ export" },
    ],
  },
  {
    name: "Unitree Go2",
    scope: "Autonomous Navigation",
    stack: "ROS 2 · Nav2 · FAST-LIO · OpenCV · MQTT",
    period: "2026-08",
    summary: "ทดสอบและปรับระบบนำทางของหุ่นยนต์สี่ขา ทั้ง simulator, navigation config, AprilTag และเครื่องมือ deploy",
    concepts: [
      { icon: "loop", title: "Closed-loop simulation", text: "หุ่นจำลองรับ velocity จาก Nav2 แล้วส่ง pose, odometry, TF และ LaserScan กลับเข้าระบบ เพื่อทดสอบ mission สอง waypoint ใน simulation", learn: "Feedback loop และ integration testing ของ robotics" },
      { icon: "bug", title: "Nav2 root cause", text: "ไล่อาการที่หุ่นหมุนได้แต่เดินหน้าไม่ได้ จนพบ kinematic limit ที่ขาดใน config แล้วยืนยันด้วย goal ใน simulation", learn: "เชื่อมพฤติกรรมของ controller กับ configuration" },
      { icon: "tag", title: "AprilTag detection", text: "OpenCV detector ที่รักษาลำดับ corners ให้ตรงกับ solvePnP ของ localizer และตรวจทุก N เฟรมเพื่อลดงานบนบอร์ด", learn: "Corner ordering, camera intrinsics และ coordinate transforms" },
      { icon: "message", title: "MQTT test broker", text: "broker สำหรับทดสอบที่ parse packet เอง รองรับ wildcard + และ # และป้องกัน shared state ด้วย lock", learn: "Publish / subscribe และ connection lifecycle" },
      { icon: "terminal", title: "Deploy + diagnostics", text: "สคริปต์ sync และ build package บนบอร์ดด้วย rsync และ colcon พร้อมเครื่องมือตรวจ DDS และ network เมื่อหา node ไม่เจอ", learn: "Deployment workflow และการไล่ปัญหาระบบกระจาย" },
    ],
  },
  {
    name: "LCS",
    scope: "Tank Depot Management",
    stack: "Nuxt 3 · Pinia · Yup · NestJS · TypeORM · MySQL",
    period: "2025-02 → 2026-10",
    summary: "พัฒนาและปรับปรุง workflow ใบประเมินค่าซ่อม ใบแจ้งหนี้ การเบิกคืนอะไหล่ และรายงาน ร่วมกับทีม",
    concepts: [
      { icon: "search", title: "Debounced search", text: "ค้นหาเมื่อผู้ใช้หยุดปรับตัวกรอง 250 ms ยกเลิก timer เดิม และล้าง timer เมื่อปิด modal", learn: "Watchers, timers และ cleanup" },
      { icon: "check", title: "Persistent selection", text: "เปลี่ยนหน้าแล้วรายการที่เลือกยังอยู่ เพราะแยก selected IDs ออกจากข้อมูลของหน้าปัจจุบัน", learn: "State separation, Set และ stable identity" },
      { icon: "form", title: "Conditional forms", text: "ฟอร์มปรับตามกติกาของงาน เช่น วันตัดยอดกลายเป็น required ตามประเภท invoice", learn: "Yup, reactive state และ validation" },
      { icon: "exchange", title: "Transactional workflow", text: "เชื่อม event ค่าล้างและค่ายกเข้ากับใบประเมินใน transaction เดียว พร้อมตรวจ business rules แล้ว commit หรือ rollback", learn: "Commit, rollback และ business rules" },
      { icon: "boxes", title: "Lot-based inventory", text: "เบิกอะไหล่โดยตัดจำนวนข้ามหลาย lot ตามลำดับเวลา เก็บ log และตรวจยอดคืนเทียบกับยอดเบิก", learn: "Quantity allocation และ inventory logs" },
      { icon: "calendar", title: "Historical reporting", text: "รายงานย้อนหลังใช้ยอดปลายงวดจาก snapshot รายเดือน แทนการใช้ยอดคงเหลือปัจจุบัน", learn: "Snapshot, cutoff และ temporal mapping" },
      { icon: "zip", title: "Parallel report export", text: "สร้าง Excel แยกลูกค้าพร้อมกันด้วย Promise.all แล้วรวมเป็น ZIP", learn: "Promise.all, ExcelJS และ trade-off ของการบีบอัด" },
    ],
  },
  {
    name: "Beachboy",
    scope: "Autonomous Beach Cleaning Robot",
    stack: "ROS 2 · Nav2 · EKF · MQTT · Arduino · Webots",
    period: "2026-10",
    summary: "ระบบควบคุมและนำทางหุ่นยนต์ทำความสะอาดชายหาด ตั้งแต่ firmware, localization และ coverage planning จนถึง mission และ simulator",
    concepts: [
      { icon: "coverage", title: "Coverage planning", text: "สร้างแถววิ่งจาก polygon ที่หดขอบตาม margin ตัด exclusion zones และหมุนแนวตาม bearing", learn: "Polygon operations และการสร้าง waypoint ให้ครอบคลุมพื้นที่" },
      { icon: "crosshair", title: "GNSS + sensor fusion", text: "แปลง GNSS เป็น local ENU ชดเชยตำแหน่งเสาอากาศด้วย TF และรวม odometry เข้ากับ EKF", learn: "Coordinate frames และการแยก map / odom" },
      { icon: "shield", title: "Safety watchdog", text: "firmware หยุดมอเตอร์เมื่อขาดคำสั่งเกิน 300 ms พร้อม PWM ramp และ safety monitor ที่ตรวจ RTK, geofence และกรณีล้อไม่หมุน", learn: "การออกแบบเงื่อนไขหยุดและปลดล็อก" },
      { icon: "hourglass", title: "Async result guard", text: "ใช้ sequence / epoch กัน callback ของ goal เก่ามาเปลี่ยนสถานะปัจจุบัน และรอ cancel จบจริงก่อนรับแผนใหม่", learn: "Race conditions ระหว่าง goal, pause, stop และ cancel" },
      { icon: "hash", title: "Idempotent routes", text: "คำขอซ้ำได้คำตอบเดิมตาม plan ID และ payload hash ส่วน ID เดิมที่ payload เปลี่ยนถูกปฏิเสธ", learn: "Request deduplication" },
      { icon: "flask", title: "Simulation + faults", text: "จำลอง MCU และ GNSS ผ่าน pseudo-terminal ใช้ Webots และทดสอบกรณี RTK หลุด สิ่งกีดขวาง และมอเตอร์ไม่ตอบสนอง", learn: "ทดสอบทั้ง happy path และ failure / recovery" },
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

function OneDMock() {
  return (
    <div className="mock mock-oned">
      <div className="m-feed">{Array.from({ length: 7 }, (_, index) => <i key={index} />)}</div>
      <div className="m-clip">
        <span className="m-tag">1 shared player</span>
        <span className="m-play" />
        <span className="m-heart"><b>♥</b><em>+1</em></span>
        <span className="m-unmute">Tap to unmute</span>
        <span className="m-bar"><i /></span>
      </div>
      <div className="m-next">
        <span>Next clip</span>
        <b className="m-thumb">Thumbnail only</b>
        <b className="m-adslot">Ad slot ready</b>
      </div>
      <div className="m-data">
        <p>id <b>✓</b></p>
        <p>url <b>✓</b></p>
        <p>channel <b>✓</b></p>
        <p className="m-drop"><s>other fields</s></p>
      </div>
    </div>
  );
}

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
  if (project.screen === "oned") return <OneDMock />;
  if (project.screen === "thaithai") return <ThaiThaiMock />;
  return (
    <>
      <span className="screen-index">{String(index + 1).padStart(2, "0")}</span>
      <span className="screen-name">{project.shortName ?? project.name}</span>
      <span className="screen-note">Video preview coming soon</span>
    </>
  );
}
