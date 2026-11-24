"use client";

import { useEffect, useRef, useState } from "react";

// Live mocks for the Selected projects laptop (and ThaiThai's phone), drawn in code on mock data.
// Each one acts out what the user built, as listed in PROJECT_CONCEPTS.md; MOTION_SPEC.md has the
// timings. Nothing here is company footage, real customer data or a real map.

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Plays a script of [time ms, partial state] steps on repeat while `on`. Reduced motion holds `still`.
export function useScript(on, script, pass, still) {
  const start = script[0][1];
  const [state, setState] = useState(start);
  useEffect(() => {
    setState(start);
    if (!on) return undefined;
    if (reduced()) {
      setState({ ...start, ...still });
      return undefined;
    }
    const timers = [];
    const run = () => {
      script.forEach(([time, change]) => timers.push(window.setTimeout(() => setState((now) => ({ ...now, ...change })), time)));
      timers.push(window.setTimeout(run, pass));
    };
    run();
    return () => timers.forEach(window.clearTimeout);
  }, [on]); // eslint-disable-line react-hooks/exhaustive-deps
  return state;
}

// A mouse pointer that glides between targets (x, y as % of the screen), like a screen recording.
export function Pointer({ at, press }) {
  return (
    <svg className="od-pointer" viewBox="0 0 24 24" style={{ left: `${at[0]}%`, top: `${at[1]}%` }} data-press={press ? "" : undefined}>
      <path d="M5 3l14 8-6 1.5L10 19z" />
    </svg>
  );
}

/* ───────────── Unitree Go2: ground-station view of the closed-loop simulation ───────────── */

const GO2_PATH = [[80, 320], [300, 300], [300, 110], [450, 110], [540, 300]];
const GO2_WALLS = (() => {
  const walls = [[20, 20, 620, 20], [620, 20, 620, 380], [620, 380, 20, 380], [20, 380, 20, 20]];
  [[200, 20, 30, 180], [380, 200, 30, 180], [480, 80, 80, 40]].forEach(([x, y, w, h]) =>
    walls.push([x, y, x + w, y], [x + w, y, x + w, y + h], [x + w, y + h, x, y + h], [x, y + h, x, y]));
  return walls;
})();
const GO2_SEGS = (() => {
  let total = 0;
  return GO2_PATH.slice(1).map((b, i) => {
    const a = GO2_PATH[i];
    const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const seg = { a, b, length, start: total };
    total += length;
    return seg;
  });
})();
const GO2_TOTAL = GO2_SEGS.reduce((sum, seg) => sum + seg.length, 0);
const GO2_W1 = GO2_SEGS[2].start;
const TAG = [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1];

function go2At(distance) {
  for (const seg of GO2_SEGS) {
    if (distance <= seg.start + seg.length) {
      const k = (distance - seg.start) / seg.length;
      return [seg.a[0] + (seg.b[0] - seg.a[0]) * k, seg.a[1] + (seg.b[1] - seg.a[1]) * k, Math.atan2(seg.b[1] - seg.a[1], seg.b[0] - seg.a[0])];
    }
  }
  const last = GO2_SEGS[GO2_SEGS.length - 1];
  return [last.b[0], last.b[1], Math.atan2(last.b[1] - last.a[1], last.b[0] - last.a[0])];
}

// Vectorised in the real code (NumPy); here each ray is a plain segment test against the walls.
function rayLength(ox, oy, dx, dy, max) {
  let best = max;
  for (const [x1, y1, x2, y2] of GO2_WALLS) {
    const ex = x2 - x1;
    const ey = y2 - y1;
    const den = dx * ey - dy * ex;
    if (Math.abs(den) < 1e-9) continue;
    const t = ((x1 - ox) * ey - (y1 - oy) * ex) / den;
    const u = ((x1 - ox) * dy - (y1 - oy) * dx) / den;
    if (t > 0 && t < best && u >= 0 && u <= 1) best = t;
  }
  return best;
}

const GO2_IDLE = { mission: 0, tag: false, done: false, w1: false, w2: false, log: ["nav2: map loaded", "nav2: goal accepted → W1"] };

export function Go2Screen({ on }) {
  const bot = useRef(null);
  const trail = useRef(null);
  const rays = useRef(null);
  const vel = useRef(null);
  const [hud, setHud] = useState(GO2_IDLE);

  useEffect(() => {
    const draw = (distance, moving, now = 0) => {
      const [x, y, heading] = go2At(distance);
      bot.current?.setAttribute("transform", `translate(${x} ${y}) rotate(${heading * 180 / Math.PI})`);
      let lines = "";
      for (let i = 0; i < 24; i += 1) {
        const angle = heading - 2.1 + i * (4.2 / 23);
        const dx = Math.cos(angle);
        const dy = Math.sin(angle);
        const t = rayLength(x, y, dx, dy, 130);
        lines += `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${(x + dx * t).toFixed(1)}" y2="${(y + dy * t).toFixed(1)}"/>`;
      }
      if (rays.current) rays.current.innerHTML = lines;
      if (vel.current) vel.current.textContent = `${moving ? (0.42 + Math.sin(now / 300) * 0.03).toFixed(2) : "0.00"} m/s`;
    };
    setHud(GO2_IDLE);
    trail.current?.setAttribute("points", "");
    draw(0, false);
    if (!on) return undefined;
    if (reduced()) {
      draw(GO2_W1, false);
      return undefined;
    }
    let frame = 0;
    let timers = [];
    const run = () => {
      const points = [];
      let distance = 0;
      let last = performance.now();
      let pause = 0;
      let w1 = false;
      setHud(GO2_IDLE);
      const step = (now) => {
        const dt = Math.min(now - last, 50);
        last = now;
        if (pause > 0) pause -= dt;
        else distance = Math.min(GO2_TOTAL, distance + 0.16 * dt);
        const [x, y] = go2At(distance);
        points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
        trail.current?.setAttribute("points", points.join(" "));
        draw(distance, pause <= 0 && distance < GO2_TOTAL, now);
        if (!w1 && distance >= GO2_W1) {
          w1 = true;
          pause = 700;
          setHud((h) => ({ ...h, mission: 1, w1: true, log: [...h.log, "mqtt mission/status → W1 reached", "nav2: goal accepted → W2"].slice(-6) }));
        }
        if (distance >= GO2_TOTAL) {
          setHud((h) => ({ ...h, mission: 2, w2: true, log: [...h.log, "mqtt mission/status → W2 reached"].slice(-6) }));
          timers.push(window.setTimeout(() => setHud((h) => ({ ...h, tag: true, log: [...h.log, "apriltag: id 07 · pose locked"].slice(-6) })), 500));
          timers.push(window.setTimeout(() => setHud((h) => ({ ...h, done: true })), 2000));
          timers.push(window.setTimeout(run, 4200));
          return;
        }
        frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    };
    run();
    return () => { cancelAnimationFrame(frame); timers.forEach(window.clearTimeout); timers = []; };
  }, [on]);

  return (
    <div className="sc-screen go2">
      <div className="go2-bar">
        <b>Ground station</b>
        <span>ROS 2 · Nav2 · FAST-LIO</span>
        <span className="go2-sim"><i />closed-loop simulation</span>
      </div>
      <svg className="go2-map" viewBox="0 0 640 400" preserveAspectRatio="xMidYMid meet">
        <defs><pattern id="go2-dots" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#2a2a28" /></pattern></defs>
        <rect x="20" y="20" width="600" height="360" fill="url(#go2-dots)" stroke="#3a3a37" strokeWidth="2" />
        <g fill="#232321" stroke="#4a4a46"><rect x="200" y="20" width="30" height="180" /><rect x="380" y="200" width="30" height="180" /><rect x="480" y="80" width="80" height="40" /></g>
        <g ref={rays} stroke="#ff3b1f" strokeOpacity=".22" strokeWidth="1" />
        <polyline points={GO2_PATH.map((p) => p.join(",")).join(" ")} fill="none" stroke="#ff3b1f" strokeWidth="2" strokeDasharray="6 6" opacity=".85" />
        <polyline ref={trail} fill="none" stroke="#f1f0eb" strokeWidth="2.5" strokeLinecap="round" />
        <g fontFamily="ui-monospace, monospace" fontSize="13" fill="#f1f0eb">
          <circle cx="300" cy="110" r="9" fill="none" strokeWidth="1.5" stroke={hud.w1 ? "#ff3b1f" : "#f1f0eb"} /><text x="316" y="104">W1</text>
          <circle cx="540" cy="300" r="9" fill="none" strokeWidth="1.5" stroke={hud.w2 ? "#ff3b1f" : "#f1f0eb"} /><text x="556" y="294">W2</text>
          <text x="58" y="352" fill="#8a8a84">START</text>
        </g>
        <g ref={bot}><polygon points="13,0 -9,-8 -5,0 -9,8" fill="#f1f0eb" /><circle r="3" cx="2" fill="#ff3b1f" /></g>
      </svg>
      <div className="go2-side">
        <div><p className="sc-k">Mission</p><p className="go2-big">{hud.mission} / 2</p></div>
        <div><p className="sc-k">cmd_vel</p><p ref={vel} className="go2-v">0.00 m/s</p></div>
        <div className="go2-cam" data-lock={hud.tag || undefined}>
          <p className="sc-k">Camera · AprilTag</p>
          <div className="go2-frame">
            <div className="go2-tag">{TAG.map((bit, i) => <span key={i} data-w={bit ? undefined : ""} />)}</div>
            <div className="go2-bracket"><s /><s /><s /><s /></div>
          </div>
          <p className="go2-cam-cap">{hud.tag ? "id 07 · pose locked" : "searching…"}</p>
        </div>
        <div className="go2-log">{hud.log.map((line, i) => <p key={`${i}-${line}`} data-red={line.startsWith("mqtt") || line.startsWith("apriltag") || undefined}>{line}</p>)}</div>
      </div>
      <div className="go2-done" data-on={hud.done || undefined}><p>Simulation result</p><b>Mission complete — 2 / 2 waypoints</b></div>
    </div>
  );
}

/* ───────────── LCS: invoice tank selection (debounced search, selection across pages) ───────────── */

const LCS_ALL = [
  ["TK-0142", "A"], ["TK-0217", "B"], ["TK-0108", "A"], ["TK-0391", "A"],
];
const LCS_FOUND = [
  [["TK-0101", "A"], ["TK-0108", "A"], ["TK-0115", "B"], ["TK-0123", "A"]],
  [["TK-0131", "A"], ["TK-0142", "A"], ["TK-0156", "B"], ["TK-0177", "A"]],
];
const LCS_CUSTOMER = { A: "Alpha Logistics", B: "Bravo Chemicals" };
const LCS_EVENT = ["Cleaning", "LOLO", "Cleaning", "Cleaning"];
const LCS_AT = {
  rest: [56, 94],
  search: [63, 24.5],
  row0: [23.5, 39], row1: [23.5, 47], row2: [23.5, 55],
  page1: [48, 71], page2: [52, 71],
  confirm: [71, 81.5],
};
const LCS_SCRIPT = [
  [0, { query: "", searching: false, found: false, page: 1, sel: [], modal: true, toast: false, denied: false, at: "rest", press: null }],
  [600, { at: "search" }],
  [1000, { query: "T" }], [1100, { query: "TK" }], [1200, { query: "TK-" }], [1300, { query: "TK-0" }], [1400, { query: "TK-01", searching: true }],
  [1650, { searching: false, found: true }],
  [2200, { at: "row0" }], [2500, { press: "row0", sel: ["TK-0101"] }], [2700, { press: null }],
  [3000, { at: "row1" }], [3300, { press: "row1", sel: ["TK-0101", "TK-0108"] }], [3500, { press: null }],
  [3800, { at: "row2" }], [4100, { press: "row2", denied: true }], [4300, { press: null }], [4900, { denied: false }],
  [5000, { at: "page2" }], [5300, { press: "page2", page: 2 }], [5500, { press: null }],
  [5900, { at: "row0" }], [6200, { press: "row0", sel: ["TK-0101", "TK-0108", "TK-0131"] }], [6400, { press: null }],
  [6800, { at: "page1" }], [7100, { press: "page1", page: 1 }], [7300, { press: null }],
  [7900, { at: "confirm" }], [8300, { press: "confirm" }], [8500, { press: null, modal: false, toast: true, at: "rest" }],
  [10600, { toast: false }],
];

export function LcsScreen({ on }) {
  const s = useScript(on, LCS_SCRIPT, 11400, { query: "TK-01", found: true, sel: ["TK-0101", "TK-0108"] });
  const rows = s.found ? LCS_FOUND[s.page - 1] : LCS_ALL;
  return (
    <div className="sc-screen lcs">
      <aside className="lcs-nav">
        <b>LCS</b>
        <span>แดชบอร์ด</span><span>ใบประเมินค่าซ่อม</span><span data-on>ใบแจ้งหนี้</span><span>เบิกคืนอะไหล่</span><span>รายงาน</span>
      </aside>
      <div className="lcs-main">
        <div className="lcs-top"><h4>ใบแจ้งหนี้</h4><i>+ สร้างใบแจ้งหนี้</i></div>
        <div className="lcs-list">
          {s.toast && <p className="lcs-new">INV-2026-0418 · Alpha Logistics · 3 แทงก์</p>}
          <p>INV-2026-0417 · Alpha Logistics · 2 แทงก์</p>
          <p>INV-2026-0416 · Bravo Chemicals · 5 แทงก์</p>
          <p>INV-2026-0415 · Alpha Logistics · 1 แทงก์</p>
        </div>
      </div>
      <div className="lcs-dim" data-on={s.modal || undefined} />
      <div className="lcs-modal" data-on={s.modal || undefined}>
        <div className="lcs-head"><b>เลือกแทงก์</b><span>ลูกค้าเดียวกันเท่านั้น</span></div>
        <div className="lcs-filters">
          <span className="lcs-select">ลูกค้า: {LCS_CUSTOMER.A}</span>
          <span className="lcs-search" data-focus={s.at === "search" || undefined}>{s.query || <em>ค้นหาเลขแทงก์</em>}{s.searching && <i className="lcs-spin" />}</span>
        </div>
        <div className="lcs-thead"><span /><span>เลขแทงก์</span><span>ลูกค้า</span><span>งาน</span><span>วันที่</span></div>
        {rows.map(([id, customer], i) => {
          const disabled = customer !== "A";
          const checked = s.sel.includes(id);
          return (
            <div key={id} className="lcs-row" data-off={disabled || undefined} data-pressed={s.press === `row${i}` || undefined}>
              <span className="lcs-check" data-on={checked || undefined}>{checked ? "✓" : ""}</span>
              <span>{id}</span><span>{LCS_CUSTOMER[customer]}</span><span>{LCS_EVENT[i]}</span><span>0{3 + i}/11/2026</span>
              {disabled && s.denied && i === 2 && <em className="lcs-tip">คนละลูกค้า — เลือกไม่ได้</em>}
            </div>
          );
        })}
        <div className="lcs-pager">
          <span data-on={s.page === 1 || undefined} data-pressed={s.press === "page1" || undefined}>1</span>
          <span data-on={s.page === 2 || undefined} data-pressed={s.press === "page2" || undefined}>2</span>
        </div>
        <div className="lcs-foot"><span>เลือกแล้ว <b>{s.sel.length}</b> รายการ</span><i data-pressed={s.press === "confirm" || undefined}>ยืนยัน</i></div>
      </div>
      <p className="lcs-toast" data-on={s.toast || undefined}>สร้างใบแจ้งหนี้แล้ว · 3 แทงก์</p>
      <Pointer at={LCS_AT[s.at]} press={s.press} />
    </div>
  );
}

/* ───────────── Beachboy: coverage panel → lanes → simulated run ───────────── */

// Work area 62–458 × 82–318 (after the margin); exclusion zone 360–458 × 82–150, so the top three
// lanes stop short of it. Serpentine order, as the coverage planner hands waypoints to Nav2.
const BB_LANES = [92, 118, 144, 170, 196, 222, 248, 274, 300].map((y, i) => {
  const end = y < 158 ? 350 : 458;
  return i % 2 ? [[end, y], [62, y]] : [[62, y], [end, y]];
});
const BB_PATH = BB_LANES.flat();
const BB_SEGS = (() => {
  let total = 0;
  return BB_PATH.slice(1).map((b, i) => {
    const a = BB_PATH[i];
    const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const seg = { a, b, length, start: total };
    total += length;
    return seg;
  });
})();
const BB_TOTAL = BB_SEGS.reduce((sum, seg) => sum + seg.length, 0);
const BB_AT = { rest: [50, 94], preview: [73, 45], start: [82, 45] };

function bbAt(distance) {
  for (const seg of BB_SEGS) {
    if (distance <= seg.start + seg.length) {
      const k = (distance - seg.start) / seg.length;
      return [seg.a[0] + (seg.b[0] - seg.a[0]) * k, seg.a[1] + (seg.b[1] - seg.a[1]) * k, Math.atan2(seg.b[1] - seg.a[1], seg.b[0] - seg.a[0])];
    }
  }
  return [...BB_PATH[BB_PATH.length - 1], Math.PI];
}

const BB_IDLE = { state: "IDLE", lanes: false, coverage: 0, done: false, at: "rest", press: null };

export function BeachboyScreen({ on }) {
  const bot = useRef(null);
  const trail = useRef(null);
  const [ui, setUi] = useState(BB_IDLE);

  useEffect(() => {
    const place = (distance) => {
      const [x, y, heading] = bbAt(distance);
      bot.current?.setAttribute("transform", `translate(${x} ${y}) rotate(${heading * 180 / Math.PI})`);
    };
    setUi(BB_IDLE);
    trail.current?.setAttribute("points", "");
    place(0);
    if (!on) return undefined;
    if (reduced()) {
      setUi({ ...BB_IDLE, state: "PLANNED", lanes: true });
      return undefined;
    }
    let frame = 0;
    let timers = [];
    const later = (ms, fn) => timers.push(window.setTimeout(fn, ms));
    const run = () => {
      setUi(BB_IDLE);
      trail.current?.setAttribute("points", "");
      place(0);
      later(700, () => setUi((u) => ({ ...u, at: "preview" })));
      later(1300, () => setUi((u) => ({ ...u, press: "preview", lanes: true, state: "PLANNED" })));
      later(1500, () => setUi((u) => ({ ...u, press: null })));
      later(2800, () => setUi((u) => ({ ...u, at: "start" })));
      later(3300, () => setUi((u) => ({ ...u, press: "start", state: "RUNNING" })));
      later(3500, () => {
        setUi((u) => ({ ...u, press: null, at: "rest" }));
        const points = [];
        let distance = 0;
        let last = performance.now();
        const step = (now) => {
          distance = Math.min(BB_TOTAL, distance + 0.5 * Math.min(now - last, 50));
          last = now;
          const [x, y] = bbAt(distance);
          points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
          trail.current?.setAttribute("points", points.join(" "));
          place(distance);
          setUi((u) => ({ ...u, coverage: Math.round((distance / BB_TOTAL) * 89) }));
          if (distance < BB_TOTAL) frame = requestAnimationFrame(step);
          else {
            setUi((u) => ({ ...u, state: "COMPLETE", done: true }));
            later(2600, run);
          }
        };
        frame = requestAnimationFrame(step);
      });
    };
    run();
    return () => { cancelAnimationFrame(frame); timers.forEach(window.clearTimeout); timers = []; };
  }, [on]);

  return (
    <div className="sc-screen bb">
      <div className="go2-bar">
        <b>Beachboy · Mission control</b>
        <span className="bb-state" data-state={ui.state}>{ui.state}</span>
        <span className="bb-rtk">RTK FIX</span>
        <span className="go2-sim"><i />simulation</span>
      </div>
      <svg className="bb-map" viewBox="0 0 520 360" preserveAspectRatio="xMidYMid meet">
        <defs><pattern id="bb-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="8" stroke="#ff3b1f" strokeWidth="2" strokeOpacity=".5" /></pattern></defs>
        <rect x="0" y="0" width="520" height="52" fill="#16242a" />
        <text x="12" y="32" fill="#5d7480" fontFamily="ui-monospace, monospace" fontSize="12">sea</text>
        <rect x="0" y="52" width="520" height="308" fill="#1d1b17" />
        <rect x="50" y="70" width="420" height="260" fill="none" stroke="#6b6a63" strokeWidth="1.5" strokeDasharray="5 5" />
        <rect x="62" y="82" width="396" height="236" fill="none" stroke="#3a3935" strokeWidth="1" />
        <rect x="360" y="82" width="98" height="68" fill="url(#bb-hatch)" stroke="#ff3b1f" strokeOpacity=".7" />
        <text x="366" y="100" fill="#ff3b1f" fontFamily="ui-monospace, monospace" fontSize="11">exclusion</text>
        <g className="bb-lanes" data-on={ui.lanes || undefined}>
          {BB_LANES.map(([a, b], i) => <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} pathLength="1" />)}
        </g>
        <polyline ref={trail} fill="none" stroke="#f1f0eb" strokeOpacity=".75" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
        <g ref={bot}><rect x="-11" y="-8" width="22" height="16" rx="3" fill="#f1f0eb" /><rect x="5" y="-5" width="5" height="10" fill="#ff3b1f" /></g>
      </svg>
      <div className="bb-panel">
        <p className="sc-k">Coverage</p>
        <div className="bb-field"><span>Spacing</span><b>0.8 m</b></div>
        <div className="bb-field"><span>Margin</span><b>0.5 m</b></div>
        <div className="bb-field"><span>Bearing</span><b>0°</b></div>
        <div className="bb-buttons">
          <i data-pressed={ui.press === "preview" || undefined}>Preview</i>
          <i data-pressed={ui.press === "start" || undefined} data-primary>Start</i>
          <i>Stop</i>
        </div>
        <p className="sc-k">Covered</p>
        <p className="go2-big">{ui.coverage}%</p>
        <div className="bb-bar"><span style={{ width: `${ui.coverage}%` }} /></div>
        <div className="bb-safety"><span>RTK fix ✓</span><span>Watchdog 300 ms ✓</span><span>Geofence ✓</span></div>
      </div>
      <div className="go2-done" data-on={ui.done || undefined}><p>Simulation · 8 × 6 m</p><b>89% covered, no collisions</b></div>
      <Pointer at={BB_AT[ui.at]} press={ui.press} />
    </div>
  );
}

/* ───────────── ThaiThai: the phone app (feed → live → buy → PromptPay) ───────────── */

const TT_SCRIPT = [
  [0, { view: "feed", clip: 0, sheet: null, chat: 0, tap: null }],
  [1200, { tap: "swipe" }], [1500, { clip: 1 }], [1800, { tap: null }],
  [2700, { tap: "live" }], [2950, { view: "live", tap: null }],
  [3400, { chat: 1 }], [3900, { chat: 2 }], [4400, { chat: 3 }],
  [5200, { tap: "buy" }], [5450, { sheet: "order", tap: null }],
  [6800, { tap: "confirm" }], [7050, { sheet: "pay", tap: null }],
  [8800, { sheet: "done" }],
  [10600, { sheet: null, view: "feed", clip: 0, chat: 0 }],
];
const TT_TAP = { swipe: [50, 62], live: [50, 7.5], buy: [80, 81.5], confirm: [50, 89] };
const TT_CHAT = [["mint_ny", "สีนี้มีไหมคะ"], ["pp.store", "ส่งไวมาก"], ["ning", "สั่งแล้วค่า"]];

export function ThaiThaiPhone({ on, delay = 250 }) {
  const s = useScript(on, TT_SCRIPT, 11600, { view: "live", chat: 3 });
  const tap = s.tap && TT_TAP[s.tap];
  return (
    <div className="tt-phone" data-on={on || undefined} style={{ "--od-delay": `${delay}ms` }} aria-hidden="true">
      <span className="od-notch" />
      <div className="tt-app" data-view={s.view}>
        <div className="tt-top"><span data-on={s.view === "feed" || undefined}>สำหรับคุณ</span><span data-on={s.view === "live" || undefined}>ไลฟ์</span><span>ครีเอเตอร์</span></div>

        <div className="tt-feed">
          <div className="tt-track">
            {[["#3a2f2f", "@mint_beauty", "รีวิวเซรั่มตัวใหม่"], ["#2d3b3a", "@pp.store", "แต่งห้องงบ 500"]].map(([tone, user, text], index) => (
              <div key={user} className="tt-clip" data-on={s.clip === index || undefined} style={{ background: tone }}>
                <span className="od-scene" />
                <p className="tt-cap"><b>{user}</b>{text}</p>
                <span className="tt-pill">สินค้าในคลิป · ฿299</span>
              </div>
            ))}
          </div>
          <div className="tt-rail"><span>♡<em>2.4K</em></span><span>◯<em>128</em></span><span>↗<em>แชร์</em></span></div>
        </div>

        <div className="tt-live">
          <span className="od-scene" />
          <div className="tt-host"><i /> <b>mint_beauty</b><span>ติดตาม</span></div>
          <div className="tt-badges"><span className="tt-on-air">LIVE</span><span>1.2K</span></div>
          <div className="tt-chat">{TT_CHAT.slice(0, s.chat).map(([who, text]) => <p key={who}><b>{who}</b> {text}</p>)}</div>
          <div className="tt-product"><i /><div><b>เซรั่มหน้าใส</b><span>฿299 · ส่งฟรี</span></div><em data-pressed={s.tap === "buy" || undefined}>ซื้อเลย</em></div>
        </div>

        <div className="tt-sheet" data-on={s.sheet || undefined}>
          {s.sheet === "order" && (
            <>
              <b>ชำระเงิน</b>
              <div className="tt-line"><span>เซรั่มหน้าใส × 1</span><span>฿299</span></div>
              <div className="tt-line"><span>ค่าส่ง</span><span>ส่งฟรี</span></div>
              <div className="tt-line tt-total"><span>รวม</span><span>฿299</span></div>
              <em className="tt-cta" data-pressed={s.tap === "confirm" || undefined}>ยืนยันสั่งซื้อ</em>
            </>
          )}
          {s.sheet === "pay" && (
            <>
              <b>PromptPay</b>
              <div className="tt-qr">{TAG.map((bit, i) => <span key={i} data-w={bit ? undefined : ""} />)}</div>
              <p className="tt-note">สแกนเพื่อชำระ ฿299</p>
            </>
          )}
          {s.sheet === "done" && (
            <>
              <span className="tt-ok">✓</span>
              <b>สั่งซื้อสำเร็จ</b>
              <p className="tt-note">คำสั่งซื้อของฉัน · TT-1042</p>
            </>
          )}
        </div>

        <div className="tt-foot"><span data-on>หน้าแรก</span><span>มอลล์</span><i>+</i><span>Fortune AI</span><span>โปรไฟล์</span></div>
      </div>
      {tap && <span className="tt-tap" data-swipe={s.tap === "swipe" || undefined} style={{ left: `${tap[0]}%`, top: `${tap[1]}%` }} />}
    </div>
  );
}
