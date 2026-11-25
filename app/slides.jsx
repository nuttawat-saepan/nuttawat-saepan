// Node-graph slides for the laptop's "What's inside" screen, for every project. Each concept's
// "demo" key picks its slide; slides are drawn on a fixed 1200 × 750 stage that motion.jsx scales
// to the screen. Every label comes from PROJECT_CONCEPTS.md: no invented numbers, endpoints or
// behaviour. Sample values (clip 12, T-01, Lot A) are placeholders, never client data.

const Heart = () => (
  <svg className="sl-icon sl-icon-heart" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 20s-7.5-4.6-7.5-10.2A4.1 4.1 0 0 1 12 7.4a4.1 4.1 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20z" />
  </svg>
);

const Speaker = ({ muted }) => (
  <svg className="sl-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" />
    {muted ? <path d="M16 9.5l5 5M21 9.5l-5 5" /> : <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />}
  </svg>
);

const Rows = ({ items }) => (
  <div className="sl-rows">
    {items.map(([label, kind, note], index) => (
      <span key={index} className={kind}><b>{label}</b>{note}</span>
    ))}
  </div>
);

const Chips = ({ items, on = [], off = [] }) => (
  <div className="sl-chips">
    {items.map((item) => <span key={item} className={on.includes(item) ? "is-on" : off.includes(item) ? "is-off" : undefined}>{item}</span>)}
  </div>
);

export const slides = {
  shared: {
    nodes: [
      { x: 80, y: 150, w: 240, h: 460, title: "Feed", meta: "scroll-snap", body: <div className="sl-bars">{[0, 1, 2, 3, 4, 5, 6].map((index) => <span key={index} className={index === 2 ? "is-on" : undefined} />)}</div> },
      { x: 450, y: 110, w: 300, h: 540, title: "Active slot", meta: "VePlayer", tag: "1 shared player", body: <><span className="sl-play" /><span className="sl-progress"><i /></span></> },
      { x: 870, y: 150, w: 240, h: 460, title: "Other slots", body: <div className="sl-dash">Next clip<b>Thumbnail only</b></div> },
    ],
    edges: [[0, 1], [1, 2]],
    note: <>ย้าย player ตัวเดิมเข้าช่องที่กำลังดูด้วย <code>appendChild</code> ไม่สร้างตัวใหม่</>,
  },
  window: {
    nodes: [
      { x: 80, y: 115, w: 300, h: 550, title: "Feed", meta: "while scrolling", body: <Rows items={[["01", "", "destroyed"], ["02", "", "destroyed"], ["03", "is-mounted", "mounted"], ["04", "is-mounted is-current", "current"], ["05", "is-mounted", "mounted"], ["06", "", "destroyed"], ["07", "", "destroyed"], ["08", "", "destroyed"], ["09", "", "destroyed"]]} /> },
      { x: 480, y: 160, w: 320, h: 220, title: "Mounted", meta: "current ±1", tag: "Kept", body: <Chips items={["prev 03", "now 04", "next 05"]} on={["now 04"]} /> },
      { x: 480, y: 450, w: 320, h: 190, title: "Further away", tag: "Destroyed", body: "player และช่องโฆษณาถูกทำลายทิ้ง" },
      { x: 890, y: 230, w: 240, h: 260, title: "Rule", meta: "shouldDestroy", tag: "Window", body: <><span className="sl-big"><em>±1</em></span>รอบคลิปที่กำลังดู</> },
    ],
    edges: [[0, 1], [0, 2], [1, 3]],
  },
  cursor: {
    nodes: [
      { x: 50, y: 290, w: 230, h: 210, title: "Shared link", meta: "mid-playlist", tag: "Open", body: <><code>/shorts/[id]</code>เปิดตรงที่คลิปกลาง playlist</> },
      { x: 350, y: 110, w: 300, h: 560, title: "Feed", body: <Rows items={[["··", "is-placeholder", "placeholder"], ["··", "is-placeholder", "placeholder"], ["··", "is-placeholder", "placeholder"], ["24", "is-mounted is-current", "opened"], ["25", "is-mounted", "loaded"], ["26", "is-mounted", "loaded"], ["27", "is-mounted", "loaded"], ["··", "", "next page"]]} /> },
      { x: 750, y: 110, w: 380, h: 240, title: "Scroll up", meta: "previous cursor", tag: "Fill in place", body: <>placeholder ถูกแทนด้วยคลิปจริงในตำแหน่งเดิม<span className="sl-big sl-big-sm">scroll <em>ไม่กระโดด</em></span></> },
      { x: 750, y: 430, w: 380, h: 240, title: "Scroll down", meta: "next cursor", tag: "Load ahead", body: <><span className="sl-spin" />เหลืออีก 3–5 คลิป เริ่มโหลดหน้าถัดไป</> },
    ],
    edges: [[0, 1], [1, 2], [1, 3]],
  },
  optimistic: {
    nodes: [
      { x: 50, y: 265, w: 190, h: 220, title: "Tap", tag: "Input", body: <Heart /> },
      { x: 300, y: 265, w: 230, h: 220, title: "Screen", meta: "now", tag: "Optimistic", body: <><span className="sl-big">♥ <em>+1</em></span>อัปเดตก่อนรอ server</> },
      { x: 590, y: 265, w: 250, h: 220, title: "Debounce", meta: "400 ms", tag: "Last state", body: "กดหลายครั้ง ส่งแค่สถานะสุดท้าย" },
      { x: 910, y: 110, w: 230, h: 200, title: "Success", tag: "Keep", body: <span className="sl-big">✓</span> },
      { x: 910, y: 440, w: 230, h: 200, title: "Failure", tag: "Rollback", body: "คืนค่าบนจอกลับ" },
    ],
    edges: [[0, 1], [1, 2], [2, 3], [2, 4]],
    note: "throttle คลิก 500 ms · ล็อกระหว่างรอ request · ยอดไลก์ไม่ติดลบ",
  },
  adpreload: {
    nodes: [
      { x: 60, y: 260, w: 300, h: 230, title: "Current clip", meta: "playing", tag: "nearEnd", body: "event ยิงก่อนคลิปจบ N วินาที" },
      { x: 460, y: 110, w: 320, h: 230, title: "GPT", meta: "near the slot", tag: "Define early", body: "สร้าง slot ไว้ก่อน แสดงจริงเมื่อถึงช่อง" },
      { x: 460, y: 420, w: 320, h: 230, title: "IMA", meta: "_preloaded", tag: "Load once", body: "flag กันโหลดโฆษณาซ้ำ" },
      { x: 880, y: 170, w: 260, h: 420, title: "Ad slot", meta: "on arrival", tag: "Shown", body: <div className="sl-dash">Sponsored<b>พร้อมแสดงทันที</b></div> },
    ],
    edges: [[0, 1], [0, 2], [1, 3], [2, 3]],
  },
  mapping: {
    nodes: [
      { x: 70, y: 120, w: 300, h: 520, title: "API response", meta: "per clip", body: <Rows items={[["id", "is-mounted", "used"], ["url", "is-mounted", "used"], ["channel", "is-mounted", "used"], ["…", "", "unused"], ["…", "", "unused"], ["…", "", "unused"], ["…", "", "unused"]]} /> },
      { x: 470, y: 260, w: 260, h: 230, title: "map()", tag: "Keep used", body: "เหลือแค่ฟิลด์ที่หน้าจอใช้" },
      { x: 830, y: 110, w: 300, h: 230, title: "Kept", tag: "Show", body: <Chips items={["id", "url", "channel"]} on={["id", "url", "channel"]} /> },
      { x: 830, y: 430, w: 300, h: 210, title: "Dropped", tag: "Filter", body: <ul className="sl-list"><li>คลิปที่ไม่มี URL</li><li>คลิปที่ไม่มีช่อง</li></ul> },
    ],
    edges: [[0, 1], [1, 2], [1, 3]],
  },
  autoplay: {
    nodes: [
      { x: 70, y: 220, w: 280, h: 300, title: "Start", meta: "autoplay", tag: "Muted", body: <><Speaker muted />เบราว์เซอร์ให้เล่นอัตโนมัติได้เมื่อปิดเสียง</> },
      { x: 450, y: 220, w: 280, h: 300, title: "Tap", meta: "once", tag: "Unmute", body: <span className="sl-pill">Tap to unmute</span> },
      { x: 830, y: 220, w: 300, h: 300, title: "Whole feed", meta: "provide / inject", tag: "Remembered", body: <><Speaker />แชร์สถานะเสียงทั้งฟีด และจำไว้ใน localStorage</> },
    ],
    edges: [[0, 1], [1, 2]],
  },

  // ThaiThai (Flutter app + NestJS backend)
  feed: {
    nodes: [
      { x: 40, y: 260, w: 260, h: 240, title: "Current clip", meta: "playing", tag: "First frame", body: "เริ่มเตรียมคลิปถัดไปหลังคลิปนี้ขึ้นเฟรมแรก" },
      { x: 380, y: 110, w: 330, h: 250, title: "Next clip", meta: "controller ready", tag: "Buffered", body: "เตรียม controller ไว้โดยไม่เล่น ต้นสตรีมจึงถูก buffer" },
      { x: 380, y: 440, w: 330, h: 220, title: "Same clip, one setup", tag: "Dedupe", body: "preload กับการปัดขอคลิปเดียวกันพร้อมกัน ใช้ setup ร่วมกันครั้งเดียว" },
      { x: 810, y: 200, w: 330, h: 340, title: "Swipe", tag: "Instant", body: <><span className="sl-play" />ปัดแล้วเล่นทันที</> },
    ],
    edges: [[0, 1], [1, 3], [2, 3]],
    note: "ไม่แย่ง bandwidth ของคลิปที่กำลังดู",
  },
  cache: {
    nodes: [
      { x: 40, y: 260, w: 260, h: 240, title: "Fast swipes", meta: "400 ms", tag: "Debounce", body: "ปัดผ่านหลายคลิปเร็วๆ preload แค่คลิปที่หยุดดูจริง" },
      { x: 390, y: 110, w: 330, h: 540, title: "Native players", meta: "max 3", body: <Rows items={[["clip 11", "is-mounted", "kept"], ["clip 12", "is-mounted is-current", "current"], ["clip 13", "is-mounted", "kept"], ["clip 08", "is-placeholder", "disposed"]]} /> },
      { x: 810, y: 110, w: 330, h: 240, title: "Farthest first", tag: "Dispose", body: "ตัวที่ไกลจากคลิปปัจจุบันที่สุดถูก dispose ก่อน" },
      { x: 810, y: 430, w: 330, h: 220, title: "Page closed", tag: "Lifecycle", body: "กัน player ที่ setup เสร็จหลังปิดหน้า และหยุดเล่นเมื่อแอปไป background" },
    ],
    edges: [[0, 1], [1, 2], [1, 3]],
  },
  checkout: {
    nodes: [
      { x: 40, y: 270, w: 220, h: 220, title: "Request", tag: "Idempotency key", body: "ส่งซ้ำได้ order เดิม" },
      { x: 320, y: 110, w: 340, h: 540, title: "One transaction", body: <Rows items={[["1", "is-mounted", "price changed → 409"], ["2", "is-mounted", "lock stock row"], ["3", "is-mounted", "available ≥ qty"], ["4", "is-mounted", "reserve, expires"], ["5", "is-mounted is-current", "order + address"]]} /> },
      { x: 740, y: 110, w: 400, h: 260, title: "50 buyers · 10 in stock", meta: "integration test", tag: "Measured", body: <>ไม่ lock: ขายเกิน<span className="sl-big sl-big-sm"><em>37–40</em> · this one: <em>10</em></span></> },
      { x: 740, y: 450, w: 400, h: 200, title: "Payment window", tag: "Release", body: "หมดเวลาจ่าย งานตามเวลาคืนสต็อกที่จองไว้" },
    ],
    edges: [[0, 1], [1, 2], [1, 3]],
  },
  pipeline: {
    nodes: [
      { x: 30, y: 270, w: 220, h: 230, title: "App", tag: "Direct upload", body: "อัปโหลดตรงไปผู้ให้บริการวิดีโอผ่าน upload session" },
      { x: 310, y: 110, w: 260, h: 230, title: "Video provider", tag: "Callback", body: "callback มีลายเซ็นและหมดอายุได้" },
      { x: 310, y: 430, w: 260, h: 230, title: "Reconciliation", meta: "every minute", tag: "Catch up", body: "สุ่มหน่วงเวลา และลองใหม่กับงานค้าง" },
      { x: 640, y: 260, w: 230, h: 240, title: "Backend", tag: "Verify", body: "ตรวจลายเซ็นก่อนเชื่อ" },
      { x: 930, y: 150, w: 240, h: 460, title: "Thumbnails", meta: "BullMQ", tag: "Retry", body: <Chips items={["10 s", "30 s", "1 min", "3 min", "10 min"]} /> },
    ],
    edges: [[0, 1], [1, 3], [2, 3], [3, 4]],
  },
  live: {
    nodes: [
      { x: 40, y: 260, w: 240, h: 240, title: "Seller app", tag: "RTMP", body: "ถ่ายทอดสดจากแอป" },
      { x: 360, y: 110, w: 310, h: 230, title: "Live room", tag: "HLS", body: "ผู้ชมเล่นผ่าน HLS" },
      { x: 360, y: 430, w: 310, h: 230, title: "Heartbeat", meta: "every 25 s", tag: "One at a time", body: "มีงานกวาดฝั่ง backend เป็นด่านสุดท้าย" },
      { x: 760, y: 110, w: 380, h: 230, title: "Reconnect", tag: "Same room", body: "reconnect ไม่สำเร็จจะไม่สร้างห้องใหม่ และไม่ปิดห้องเดิม" },
      { x: 760, y: 430, w: 380, h: 230, title: "Daily quota", tag: "One query", body: "SQL เดียวรวมจำนวนครั้งและชั่วโมงไลฟ์ของวันนี้" },
    ],
    edges: [[0, 1], [0, 2], [1, 3], [1, 4]],
  },
  market: {
    nodes: [
      { x: 40, y: 260, w: 260, h: 240, title: "ThaiThai", tag: "Source", body: "สินค้า สต็อก และ order" },
      { x: 380, y: 110, w: 340, h: 540, title: "Marketplaces", meta: "two-way sync", body: <Rows items={[["TikTok Shop", "is-mounted", ""], ["Lazada", "is-mounted is-current", ""], ["Shopee", "is-mounted", ""], ["LINE MyShop", "is-mounted", ""]]} /> },
      { x: 810, y: 110, w: 330, h: 250, title: "Lazada client", meta: "Bottleneck", tag: "Rate limit", body: "จำกัด concurrency และโควตา request ลองใหม่ตาม Retry-After" },
      { x: 810, y: 440, w: 330, h: 220, title: "One status model", tag: "Normalize", body: "แปลงสถานะ order / fulfillment ของแต่ละเจ้าเป็นชุดเดียว" },
    ],
    edges: [[0, 1], [1, 2], [1, 3]],
  },
  editor: {
    nodes: [
      { x: 40, y: 260, w: 230, h: 240, title: "Recorded clip", tag: "Input", body: "คลิปที่ถ่ายในแอป" },
      { x: 340, y: 110, w: 380, h: 230, title: "Filmstrip timeline", tag: "Trim", body: <div className="sl-frames">{[0, 1, 2, 3, 4, 5].map((index) => <span key={index} className={index === 2 ? "is-on" : undefined} />)}</div> },
      { x: 340, y: 430, w: 380, h: 220, title: "Cover frame", tag: "Pick", body: "เลือกเฟรมที่ใช้เป็นหน้าปก" },
      { x: 800, y: 110, w: 340, h: 230, title: "Text overlay", tag: "Transform", body: "ข้อความซ้อนบนวิดีโอ" },
      { x: 800, y: 430, w: 340, h: 220, title: "Preview + export", tag: "Export", body: "ดูตัวอย่างแล้ว export" },
    ],
    edges: [[0, 1], [0, 2], [1, 3], [2, 4]],
  },

  // Unitree Go2 (ROS 2, simulation)
  sim: {
    nodes: [
      { x: 40, y: 110, w: 300, h: 230, title: "Nav2", tag: "cmd_vel", body: "ส่งคำสั่งความเร็ว" },
      { x: 40, y: 430, w: 300, h: 220, title: "Mission", tag: "2 waypoints", body: "ทดสอบการถึง waypoint และจบ mission" },
      { x: 430, y: 250, w: 320, h: 260, title: "Simulated base", meta: "fake_base.py", tag: "Closed loop", body: "รับ velocity แล้วคำนวณตำแหน่งใหม่" },
      { x: 840, y: 110, w: 300, h: 540, title: "Back into ROS", body: <Rows items={[["pose", "is-mounted", ""], ["odometry", "is-mounted", ""], ["TF", "is-mounted", ""], ["LaserScan", "is-mounted is-current", "NumPy rays"]]} /> },
    ],
    edges: [[0, 2], [1, 2], [2, 3]],
    note: "LaserScan คำนวณหลายลำแสงพร้อมกันด้วย NumPy แทนการวน loop",
  },
  nav2: {
    nodes: [
      { x: 30, y: 260, w: 250, h: 250, title: "Symptom", tag: "Bug", body: "หุ่นหมุนได้ แต่เดินหน้าไม่ได้" },
      { x: 320, y: 260, w: 260, h: 250, title: "DWB controller", tag: "Trace", body: "ไล่จากพฤติกรรม controller ไปหา config" },
      { x: 620, y: 260, w: 260, h: 250, title: "Config", meta: "max_speed_xy", tag: "Missing", body: "kinematic limit ที่ขาดอยู่" },
      { x: 920, y: 260, w: 250, h: 250, title: "Verify", tag: "Simulation", body: "ยืนยันด้วย goal ใน simulation" },
    ],
    edges: [[0, 1], [1, 2], [2, 3]],
  },
  apriltag: {
    nodes: [
      { x: 30, y: 260, w: 250, h: 250, title: "Camera frame", tag: "Input", body: "ภาพจากกล้องบนหุ่น" },
      { x: 320, y: 260, w: 260, h: 250, title: "Every N frames", meta: "default 3", tag: "Sample", body: "ลดงานบนบอร์ดที่ใช้ CPU ร่วมกับระบบอื่น" },
      { x: 620, y: 260, w: 260, h: 250, title: "OpenCV detector", tag: "Corners", body: "รักษาลำดับ corners ให้ตรงกับ solvePnP" },
      { x: 920, y: 260, w: 250, h: 250, title: "Localizer", meta: "camera TF", tag: "Pose", body: "ได้ pose จาก corners ที่เรียงตรงกัน" },
    ],
    edges: [[0, 1], [1, 2], [2, 3]],
  },
  broker: {
    nodes: [
      { x: 40, y: 260, w: 250, h: 240, title: "Test clients", tag: "Pub / sub", body: "ทดสอบการรับภารกิจและรายงานความคืบหน้า" },
      { x: 370, y: 110, w: 370, h: 540, title: "Mini broker", meta: "QoS 0", body: <Rows items={[["CONNECT", "is-mounted", "parse"], ["length", "is-mounted", "variable-length"], ["robot/+/status", "is-mounted is-current", "wildcard +"], ["robot/#", "is-mounted is-current", "wildcard #"]]} /> },
      { x: 820, y: 110, w: 320, h: 250, title: "Subscriptions", meta: "threading.Lock", tag: "Shared state", body: "เลือกผู้รับใน lock แล้วส่งนอก lock" },
      { x: 820, y: 440, w: 320, h: 220, title: "Disconnect", tag: "finally", body: "ลบ subscription และปิด socket" },
    ],
    edges: [[0, 1], [1, 2], [1, 3]],
  },
  deploy: {
    nodes: [
      { x: 40, y: 260, w: 250, h: 240, title: "Dev machine", tag: "rsync", body: "ส่ง package ไปบอร์ดผ่าน SSH" },
      { x: 370, y: 110, w: 340, h: 240, title: "Robot board", meta: "colcon", tag: "Build", body: <><code>--symlink-install</code>แก้ Python แล้วไม่ต้อง rebuild</> },
      { x: 370, y: 430, w: 340, h: 220, title: "Dependencies", tag: "Check", body: "ตรวจ dependency ที่ยังขาดก่อน build" },
      { x: 800, y: 150, w: 340, h: 460, title: "Node not found?", tag: "Diagnose", body: <Rows items={[["ROS domain", "is-mounted", ""], ["RMW", "is-mounted", ""], ["interface", "is-mounted", ""], ["connectivity", "is-mounted", ""]]} /> },
    ],
    edges: [[0, 1], [0, 2], [1, 3]],
  },

  // Tank Depot (team project; only the user's own contributions)
  search: {
    nodes: [
      { x: 40, y: 260, w: 250, h: 240, title: "Filter changes", tag: "Input", body: <Chips items={["a", "ab", "abc"]} on={["abc"]} /> },
      { x: 370, y: 260, w: 300, h: 240, title: "Timer", meta: "250 ms", tag: "Reset", body: "เปลี่ยนตัวกรองอีก ยกเลิก timer เดิม" },
      { x: 760, y: 110, w: 380, h: 230, title: "Search API", tag: "One request", body: "เรียกเมื่อผู้ใช้หยุดปรับตัวกรอง" },
      { x: 760, y: 430, w: 380, h: 220, title: "Modal closed", tag: "Cleanup", body: "ล้าง timer เมื่อปิด modal" },
    ],
    edges: [[0, 1], [1, 2], [1, 3]],
    note: "debounce ลดจำนวนครั้งที่เรียก แต่ไม่กัน response เก่าเขียนทับ response ใหม่",
  },
  selection: {
    nodes: [
      { x: 40, y: 150, w: 300, h: 300, title: "Page 1", body: <Rows items={[["T-01", "is-mounted is-current", "selected"], ["T-02", "", "—"], ["T-03", "is-mounted is-current", "selected"]]} /> },
      { x: 430, y: 250, w: 320, h: 260, title: "Selected IDs", meta: "Set", tag: "Kept apart", body: <Chips items={["T-01", "T-03", "T-07"]} on={["T-01", "T-03", "T-07"]} /> },
      { x: 840, y: 110, w: 300, h: 240, title: "Page 2", body: <Rows items={[["T-07", "is-mounted is-current", "selected"], ["T-08", "", "—"]]} /> },
      { x: 840, y: 430, w: 300, h: 220, title: "Back to page 1", tag: "Restored", body: "checkbox กลับมาตามที่เลือกไว้" },
    ],
    edges: [[0, 1], [1, 2], [1, 3]],
    note: "เลือกได้เฉพาะแทงก์ของลูกค้าเดียวกัน และ normalize ID ก่อนเทียบ",
  },
  forms: {
    nodes: [
      { x: 40, y: 260, w: 270, h: 240, title: "Invoice type", tag: "Choice", body: <Chips items={["Type A", "Type B"]} on={["Type B"]} /> },
      { x: 390, y: 260, w: 320, h: 240, title: "Yup schema", meta: "conditional", tag: "Rules", body: "กติกาเปลี่ยนตามประเภท invoice" },
      { x: 800, y: 110, w: 340, h: 230, title: "Cut-off date", tag: "Required", body: "กลายเป็นช่องบังคับ" },
      { x: 800, y: 430, w: 340, h: 220, title: "Date input", meta: "DD/MM/YYYY", tag: "Mask", body: "เตือนเมื่อรูปแบบวันที่ผิด" },
    ],
    edges: [[0, 1], [1, 2], [1, 3]],
  },
  transaction: {
    nodes: [
      { x: 40, y: 260, w: 260, h: 240, title: "Cleaning / LOLO event", tag: "Input", body: "ค่าล้างหรือค่ายกที่จะเข้าใบประเมิน" },
      { x: 370, y: 110, w: 380, h: 540, title: "One transaction", body: <Rows items={[["1", "is-mounted", "already invoiced?"], ["2", "is-mounted", "linked to estimate?"], ["3", "is-mounted", "create estimate item"], ["4", "is-mounted is-current", "link the event"]]} /> },
      { x: 830, y: 110, w: 310, h: 230, title: "All checks pass", tag: "Commit", body: "บันทึกทุกขั้นพร้อมกัน" },
      { x: 830, y: 430, w: 310, h: 220, title: "Any check fails", tag: "Rollback", body: "ย้อนทั้งหมด แล้ว release" },
    ],
    edges: [[0, 1], [1, 2], [1, 3]],
  },
  lots: {
    nodes: [
      { x: 40, y: 270, w: 240, h: 220, title: "Withdraw", tag: "Request", body: <span className="sl-big">8</span> },
      { x: 360, y: 110, w: 360, h: 540, title: "Lots", meta: "oldest first", body: <Rows items={[["Lot A", "is-mounted is-current", "5 → 0"], ["Lot B", "is-mounted is-current", "5 → 2"], ["Lot C", "", "5"]]} /> },
      { x: 800, y: 110, w: 340, h: 230, title: "Withdrawal log", tag: "Linked", body: "เก็บ log เชื่อมกับรายการในใบประเมิน" },
      { x: 800, y: 430, w: 340, h: 220, title: "Return", tag: "Checked", body: "ตรวจยอดคืนไม่ให้เกินยอดที่เบิก" },
    ],
    edges: [[0, 1], [1, 2], [1, 3]],
  },
  history: {
    nodes: [
      { x: 40, y: 140, w: 300, h: 240, title: "Month-end snapshot", tag: "Per lot", body: "ยอดปลายงวดของแต่ละ lot" },
      { x: 40, y: 450, w: 300, h: 200, title: "Current balance", tag: "Not used", body: "ยอดคงเหลือวันนี้ใช้กับงวดเก่าไม่ได้" },
      { x: 430, y: 250, w: 330, h: 260, title: "Past-period report", tag: "Cut-off", body: "ใช้ยอดปลายงวดของงวดนั้น" },
      { x: 850, y: 250, w: 290, h: 260, title: "Latest lot ≤ period end", tag: "Tie-break", body: "เวลาเท่ากันใช้ ID ตัดสิน" },
    ],
    edges: [[0, 2], [2, 3]],
  },
  export: {
    nodes: [
      { x: 40, y: 170, w: 260, h: 420, title: "Customers", body: <Rows items={[["A", "is-mounted", ""], ["B", "is-mounted", ""], ["C", "is-mounted", ""]]} /> },
      { x: 380, y: 110, w: 360, h: 540, title: "Promise.all", meta: "in parallel", body: <Rows items={[["A.xlsx", "is-mounted", "ExcelJS"], ["B.xlsx", "is-mounted", "ExcelJS"], ["C.xlsx", "is-mounted", "ExcelJS"]]} /> },
      { x: 830, y: 230, w: 310, h: 300, title: "ZIP", meta: "compression: STORE", tag: "One file", body: "รวมเป็นไฟล์เดียว ไม่บีบอัดซ้ำ" },
    ],
    edges: [[0, 1], [1, 2]],
    note: "ไม่บีบอัดช่วยประหยัด CPU แลกกับไฟล์ที่ใหญ่ขึ้น · ยังไม่มี benchmark",
  },

  // Beach Robot (ROS 2, firmware, simulation)
  coverage: {
    nodes: [
      { x: 40, y: 150, w: 290, h: 460, title: "Work area", tag: "Polygon", body: "พื้นที่บนแผนที่ และ exclusion zones" },
      { x: 410, y: 110, w: 310, h: 230, title: "Shrink by margin", tag: "Shapely", body: "หดขอบเข้ามาตาม margin" },
      { x: 410, y: 430, w: 310, h: 220, title: "Cut exclusions", tag: "Subtract", body: "ตัดพื้นที่ห้ามเข้าออก" },
      { x: 810, y: 150, w: 330, h: 460, title: "Lanes", meta: "rotated to bearing", tag: "Waypoints", body: <div className="sl-bars sl-lanes">{[0, 1, 2, 3, 4, 5].map((index) => <span key={index} />)}</div> },
    ],
    edges: [[0, 1], [0, 2], [1, 3], [2, 3]],
  },
  gnss: {
    nodes: [
      { x: 40, y: 80, w: 290, h: 190, title: "GNSS", meta: "UM982", tag: "ENU", body: "แปลงพิกัดเป็น local ENU" },
      { x: 40, y: 300, w: 290, h: 190, title: "Antenna offset", meta: "TF", tag: "Lever arm", body: "ชดเชยระยะเสาอากาศ cache หลัง lookup" },
      { x: 40, y: 520, w: 290, h: 170, title: "Wheel odometry", tag: "Encoder" },
      { x: 440, y: 250, w: 310, h: 260, title: "EKF", meta: "robot_localization", tag: "Fuse", body: "รวมข้อมูลตำแหน่งหลายแหล่ง" },
      { x: 840, y: 150, w: 300, h: 460, title: "Frames", body: <Rows items={[["map", "is-mounted is-current", "global"], ["odom", "is-mounted", "smooth"], ["base_link", "is-mounted", "robot"]]} /> },
    ],
    edges: [[0, 3], [1, 3], [2, 3], [3, 4]],
  },
  watchdog: {
    nodes: [
      { x: 40, y: 110, w: 330, h: 540, title: "Safety monitor", tag: "Pause / cancel / lock", body: <Rows items={[["RTK", "is-mounted", ""], ["sensor timeout", "is-mounted", ""], ["geofence", "is-mounted", ""], ["wheels not turning", "is-mounted is-current", ""]]} /> },
      { x: 450, y: 260, w: 270, h: 240, title: "Drive command", tag: "Gated", body: "ส่งต่อเมื่อ safety ผ่าน" },
      { x: 800, y: 110, w: 340, h: 260, title: "MCU firmware", meta: "Arduino", tag: "Watchdog", body: <><span className="sl-big sl-big-sm"><em>300 ms</em></span>ไม่มีคำสั่ง มอเตอร์เป็นศูนย์</> },
      { x: 800, y: 450, w: 340, h: 200, title: "PWM ramp", tag: "Smooth", body: "จำกัดอัตราเปลี่ยน ลดการกระชาก" },
    ],
    edges: [[0, 1], [1, 2], [1, 3]],
  },
  guard: {
    nodes: [
      { x: 40, y: 110, w: 290, h: 230, title: "Goal #1", tag: "Sent", body: "ส่ง navigation goal" },
      { x: 40, y: 430, w: 290, h: 220, title: "Pause / stop", tag: "Cancel", body: "รอ cancel จบจริงก่อนรับแผนใหม่" },
      { x: 420, y: 250, w: 320, h: 260, title: "Sequence / epoch", tag: "Guard", body: "callback ต้องมี epoch ปัจจุบันจึงเปลี่ยนสถานะได้" },
      { x: 830, y: 110, w: 310, h: 230, title: "Late result of #1", tag: "Ignored", body: "epoch เก่า ไม่เปลี่ยนสถานะปัจจุบัน" },
      { x: 830, y: 430, w: 310, h: 220, title: "Goal #2", tag: "Applied", body: "ผลของ goal ปัจจุบันเท่านั้นที่มีผล" },
    ],
    edges: [[0, 2], [1, 2], [2, 3], [2, 4]],
  },
  routes: {
    nodes: [
      { x: 40, y: 260, w: 270, h: 240, title: "Route request", meta: "plan_id", tag: "Input", body: "เส้นทางจากเว็บ" },
      { x: 390, y: 260, w: 310, h: 240, title: "Fingerprint", meta: "SHA-256", tag: "Hash", body: "hash ของ payload" },
      { x: 790, y: 110, w: 350, h: 230, title: "Same ID, same payload", tag: "Replay", body: "ได้คำตอบเดิม" },
      { x: 790, y: 430, w: 350, h: 220, title: "Same ID, new payload", tag: "Rejected", body: "ปฏิเสธคำขอ" },
    ],
    edges: [[0, 1], [1, 2], [1, 3]],
    note: "ก่อนรับ route: ตรวจตัวเลข ความต่อเนื่อง ขอบเขตพื้นที่ และ footprint clearance",
  },
  faults: {
    nodes: [
      { x: 40, y: 110, w: 300, h: 240, title: "Device mocks", meta: "pseudo-terminal", tag: "MCU + GNSS", body: "serial protocol เดียวกับที่ driver ใช้จริง" },
      { x: 40, y: 430, w: 300, h: 220, title: "Webots", tag: "Physics", body: "motors, encoder, LiDAR, /clock" },
      { x: 420, y: 250, w: 300, h: 260, title: "ROS stack", tag: "Under test", body: "driver, localization, Nav2 และ mission" },
      { x: 800, y: 110, w: 340, h: 540, title: "Fault scenarios", body: <Rows items={[["RTK lost", "is-mounted is-current", ""], ["obstacle", "is-mounted is-current", ""], ["motor not responding", "is-mounted is-current", ""], ["duplicate request", "is-mounted", ""], ["retained command", "is-mounted", ""]]} /> },
    ],
    edges: [[0, 2], [1, 2], [2, 3]],
  },
};

// Edges leave the right side of one node and enter the left side of the next, 50 px below the top.
function edgePath(from, to) {
  const sx = from.x + from.w, sy = from.y + 50, tx = to.x, ty = to.y + 50, curve = Math.max(40, (tx - sx) / 2);
  return { d: `M${sx} ${sy}C${sx + curve} ${sy} ${tx - curve} ${ty} ${tx} ${ty}`, sx, sy, tx, ty };
}

// `active` is optional: the home page drives the slide from motion.jsx (it sets --slide on the
// screen), while a project page renders it from React state.
export default function ConceptSlides({ concepts, active }) {
  const shown = concepts.filter((concept) => slides[concept.demo]);
  const current = active ?? 0;
  return (
    <div className="sl-stage" style={active === undefined ? undefined : { "--slide": active }}>
      <div className="sl-track">
        {shown.map((concept, order) => {
          const slide = slides[concept.demo];
          return (
            <article key={concept.demo} className={order === current ? "sl-slide is-active" : "sl-slide"} data-slide={concept.demo}>
              <p className="sl-title">{concept.title}</p>
              <svg className="sl-edges" viewBox="0 0 1200 750" aria-hidden="true">
                {slide.edges.map(([a, b]) => {
                  const edge = edgePath(slide.nodes[a], slide.nodes[b]);
                  return (
                    <g key={`${a}-${b}`}>
                      <path d={edge.d} pathLength="1" />
                      <circle cx={edge.sx} cy={edge.sy} r="3.5" />
                      <circle cx={edge.tx} cy={edge.ty} r="3.5" />
                    </g>
                  );
                })}
              </svg>
              {slide.nodes.map((node, index) => (
                <div key={node.title} className="sl-node" style={{ left: node.x, top: node.y, width: node.w, "--d": `${120 + index * 90}ms` }}>
                  <p className="sl-head"><span>{node.title}</span><span>{node.meta}</span></p>
                  <div className="sl-body" style={{ height: node.h - 28 }}>
                    {node.tag && <span className="sl-tag">{node.tag}</span>}
                    <div className="sl-in">{node.body}</div>
                  </div>
                </div>
              ))}
              {slide.note && <p className="sl-note">{slide.note}</p>}
            </article>
          );
        })}
      </div>
      <div className="sl-pager">
        {shown.map((concept, order) => <span key={concept.demo} className={order === current ? "is-on" : undefined}>{order + 1}</span>)}
      </div>
    </div>
  );
}
