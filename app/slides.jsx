// Node-graph slides for the laptop's "What's inside" screen. Each concept with a matching "demo"
// gets one slide, drawn on a fixed 1200 × 750 stage that motion.jsx scales to the screen.
// Every label comes from PROJECT_CONCEPTS.md: no invented numbers, endpoints or behaviour.

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
};

// Edges leave the right side of one node and enter the left side of the next, 50 px below the top.
function edgePath(from, to) {
  const sx = from.x + from.w, sy = from.y + 50, tx = to.x, ty = to.y + 50, curve = Math.max(40, (tx - sx) / 2);
  return { d: `M${sx} ${sy}C${sx + curve} ${sy} ${tx - curve} ${ty} ${tx} ${ty}`, sx, sy, tx, ty };
}

export default function ConceptSlides({ concepts }) {
  const shown = concepts.filter((concept) => slides[concept.demo]);
  return (
    <div className="sl-stage">
      <div className="sl-track">
        {shown.map((concept, order) => {
          const slide = slides[concept.demo];
          return (
            <article key={concept.demo} className={order === 0 ? "sl-slide is-active" : "sl-slide"} data-slide={concept.demo}>
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
        {shown.map((concept, order) => <span key={concept.demo} className={order === 0 ? "is-on" : undefined}>{order + 1}</span>)}
      </div>
    </div>
  );
}
