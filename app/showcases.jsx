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

// Shared illustrative pattern used on ThaiThai's mock PromptPay sheet.
const TAG = [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1];

// MP4 UI studies: only the selected preview plays. Reduced motion holds a planned-route still.
function RobotPreviewVideo({ on, name, still, label }) {
  const video = useRef(null);
  useEffect(() => {
    const player = video.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      player.pause();
      if (on && !preference.matches) {
        player.currentTime = 0;
        player.play().catch(() => {});
      } else player.currentTime = still;
    };
    update();
    player.addEventListener("loadedmetadata", update);
    preference.addEventListener("change", update);
    return () => {
      player.pause();
      player.removeEventListener("loadedmetadata", update);
      preference.removeEventListener("change", update);
    };
  }, [on, still]);
  return (
    <div className="sc-screen">
      <video ref={video} className="robot-preview-video" muted loop playsInline preload="metadata"
        poster={`/assets/${name}.jpg?v=2`} aria-label={label}>
        <source src={`/assets/${name}.mp4?v=2`} type="video/mp4" />
      </video>
    </div>
  );
}

/* Go2: 2D occupancy-grid map, select area → generate waypoints → navigate. */
export function Go2Screen({ on }) {
  return <RobotPreviewVideo on={on} name="go2-slam-mission" still={4.5}
    label="Unitree Go2 2D SLAM map and generated waypoint mission simulation" />;
}

/* ───────────── Tank Depot: tank depot app (layout from the user's screenshot, mock data) ───────────── */

// Laid out like the real Tank Depot screens the user sent (blue sidebar, "รายการแทงก์" with search, tabs,
// "Current Inventory List" and its buttons, status badges, pagination) on a 1200 × 750 canvas scaled
// to the laptop (--stage-scale). Every customer, tank number, product and user here is made up: the
// real app holds client data under NDA. The flow acts out the user's own Tank Depot work: a debounced
// search, then the invoice tank selection (same customer only, ticks kept across pages).

const DEPOT_MENU = ["Dashboard", "Depot inventory", "Issue List", "Estimate", "Invoice", "Cargo", "Tariff", "Spare Part", "Customer", "User Management", "Report"];
const DEPOT_STOCK = [
  ["DMOU2500142", "Alpha Logistics", "60800412", "ลาน 3", "Glycerine", "AVL", "Available", "18/11/2026", "13/11/2026", "14/11/2026"],
  ["DMOU2500517", "Alpha Logistics", "60794215", "ลาน 3", "Palm Olein", "AVL", "Available", "04/11/2026", "27/10/2026", "28/10/2026"],
  ["DMOU2601108", "Coral Shipping Co., Ltd", "DEMO261120", "ลาน 1", "*EMPTY", "IND", "Cleaning", "25/11/2026", "20/11/2026", "-"],
  ["DMOU2602231", "Bravo Chemicals", "60805530", "ลาน 3", "Sorbitol 70%", "BKD", "Booked", "30/10/2026", "20/10/2026", "27/10/2026"],
  ["DMOU2603314", "Alpha Logistics", "60811208", "ลาน 2", "Base Oil SN150", "AVL", "Available", "02/11/2026", "29/10/2026", "31/10/2026"],
  ["DMOU2604027", "Bravo Chemicals", "60812671", "ลาน 2", "Ethanol", "AVL", "Available", "01/11/2026", "26/10/2026", "29/10/2026"],
];
const DEPOT_FOUND = DEPOT_STOCK.filter((row) => row[0].startsWith("DMOU25"));
const DEPOT_PICK = [
  [["DMOU2500142", "A", "Cleaning"], ["DMOU2500517", "A", "LOLO"], ["DMOU2602231", "B", "Cleaning"], ["DMOU2603314", "A", "Cleaning"]],
  [["DMOU2604115", "A", "LOLO"], ["DMOU2604027", "B", "Cleaning"], ["DMOU2604602", "A", "Cleaning"], ["DMOU2605230", "A", "LOLO"]],
];
const DEPOT_CUSTOMER = { A: "Alpha Logistics", B: "Bravo Chemicals" };
const DEPOT_INVOICES = [
  ["INV-2026-0417", "Alpha Logistics", "2", "21/11/2026"],
  ["INV-2026-0416", "Bravo Chemicals", "5", "20/11/2026"],
  ["INV-2026-0415", "Alpha Logistics", "1", "18/11/2026"],
  ["INV-2026-0414", "Coral Shipping Co., Ltd", "3", "17/11/2026"],
];
// Pointer targets as % of the 1200 × 750 canvas.
const DEPOT_AT = {
  rest: [60, 96], search: [40, 8.7], invoice: [5, 26.9], create: [87.7, 10.3],
  row0: [27.6, 38.3], row1: [27.6, 44.9], row2: [27.6, 51.6], page1: [48.7, 64.5], page2: [51.3, 64.5], confirm: [71.3, 71.5],
};
const DEPOT_SCRIPT = [
  [0, { page: "stock", query: "", searching: false, found: false, modal: false, mpage: 1, sel: [], denied: false, toast: false, at: "rest", press: null }],
  [500, { at: "search" }],
  [900, { query: "D" }], [1000, { query: "DM" }], [1100, { query: "DMO" }], [1200, { query: "DMOU" }], [1300, { query: "DMOU2" }], [1400, { query: "DMOU25", searching: true }],
  [1650, { searching: false, found: true }],
  [3000, { at: "invoice" }], [3500, { press: "invoice", page: "invoice" }], [3700, { press: null }],
  [4400, { at: "create" }], [4900, { press: "create", modal: true }], [5100, { press: null }],
  [5600, { at: "row0" }], [5900, { press: "row0", sel: ["DMOU2500142"] }], [6100, { press: null }],
  [6400, { at: "row1" }], [6700, { press: "row1", sel: ["DMOU2500142", "DMOU2500517"] }], [6900, { press: null }],
  [7200, { at: "row2" }], [7500, { press: "row2", denied: true }], [7700, { press: null }], [8300, { denied: false }],
  [8400, { at: "page2" }], [8700, { press: "page2", mpage: 2 }], [8900, { press: null }],
  [9300, { at: "row0" }], [9600, { press: "row0", sel: ["DMOU2500142", "DMOU2500517", "DMOU2604115"] }], [9800, { press: null }],
  [10200, { at: "page1" }], [10500, { press: "page1", mpage: 1 }], [10700, { press: null }],
  [11300, { at: "confirm" }], [11700, { press: "confirm" }], [11900, { press: null, modal: false, toast: true, at: "rest" }],
  [14200, { toast: false }],
];

const DepotBadge = ({ code }) => <span className="depot-badge" data-code={code}>{code}</span>;
const DepotState = ({ text }) => <span className="depot-state" data-state={text}>{text}</span>;

export function DepotScreen({ on }) {
  const s = useScript(on, DEPOT_SCRIPT, 15000, { found: true, query: "DMOU25" });
  const stock = s.found ? DEPOT_FOUND : DEPOT_STOCK;
  const picks = DEPOT_PICK[s.mpage - 1];
  return (
    <div className="sc-screen depot-screen">
      <div className="depot">
        <div className="depot-logo"><b>Depot</b><i>‹</i></div>
        <aside className="depot-side">
          <p>MENU</p>
          {DEPOT_MENU.map((item) => (
            <span key={item} data-on={(s.page === "stock" ? item === "Depot inventory" : item === "Invoice") || undefined}
              data-pressed={s.press === "invoice" && item === "Invoice" || undefined}><i />{item}</span>
          ))}
          <p className="depot-support">SUPPORT</p>
          <span><i />Logout</span>
        </aside>
        <header className="depot-head"><h4>{s.page === "stock" ? "รายการแทงก์" : "ใบแจ้งหนี้"}</h4><p>Depot Officer<br /><em>demo user</em></p></header>

        {s.page === "stock" ? (
          <main className="depot-main">
            <div className="depot-searchrow">
              <span className="depot-input" data-focus={s.at === "search" || undefined}>{s.query || <em>พิมพ์ค้นหา ชื่อลูกค้า, เบอร์แทงก์</em>}{s.searching && <i className="depot-spin" />}</span>
              <span className="depot-go">⌕</span><span className="depot-outline">Advanced search</span>
            </div>
            <div className="depot-tabs">
              <span>Expected Arrival (22)</span><span data-on>Current Inventory ({s.found ? DEPOT_FOUND.length : 345})</span><span>Tank History (5008)</span>
              <i className="depot-outline">⇪ Plan Clean Date</i><i className="depot-outline">⇪ Booked</i>
            </div>
            <section className="depot-card">
              <div className="depot-card-head"><b>▣ Current Inventory List</b><span><i>+ สร้างแทงก์</i><i>⤓ ดาวน์โหลด</i><i>⤓ ดาวน์โหลดทั้งหมด</i><i>⤓ ดาวน์โหลดแบบกรองข้อมูล</i></span></div>
              <div className="depot-grid depot-th">
                <span className="depot-box" /><span>เบอร์แทงก์</span><span>ชื่อลูกค้า</span><span>ประเภทแทงก์</span><span>เลขที่อ้างอิงแทงก์เข้า</span><span>ตำแหน่งลาน</span><span>ชื่อสินค้า</span><span>สถานะแทงก์สำหรับลูกค้า</span><span>สถานะแทงก์ภายใน</span><span>วันที่อัปเดต</span><span>วันที่แทงก์เข้า</span><span>วันที่ล้างเสร็จ</span>
              </div>
              {stock.map(([tank, customer, ref, yard, product, code, state, updated, inDate, cleaned]) => (
                <div key={tank} className="depot-grid depot-tr">
                  <span className="depot-box" /><span className="depot-link">{tank}</span><span>{customer}</span><span>CHM</span><span>{ref}</span><span>{yard}</span>
                  <span className="depot-product">{product}</span><span><DepotBadge code={code} /></span><span><DepotState text={state} /></span>
                  <span>{updated}</span><span>{inDate}</span><span>{cleaned}</span>
                </div>
              ))}
            </section>
            <div className="depot-pages"><i>«</i><i>‹</i><i data-on>1</i>{s.found ? null : <><i>2</i><i>3</i><i>4</i><i>5</i><i>…</i><i>35</i></>}<i>›</i><i>»</i><em>Showing 1-{stock.length} of {s.found ? DEPOT_FOUND.length : 345}</em></div>
          </main>
        ) : (
          <main className="depot-main">
            <section className="depot-card depot-inv">
              <div className="depot-card-head"><b>▣ Invoice List</b><span><i data-pressed={s.press === "create" || undefined}>+ สร้างใบแจ้งหนี้</i><i>⤓ ดาวน์โหลด</i></span></div>
              <div className="depot-grid depot-th depot-inv-grid"><span>เลขที่ใบแจ้งหนี้</span><span>ชื่อลูกค้า</span><span>จำนวนแทงก์</span><span>วันที่</span><span>สถานะ</span></div>
              {s.toast && <div className="depot-grid depot-tr depot-inv-grid depot-new"><span className="depot-link">INV-2026-0418</span><span>Alpha Logistics</span><span>3</span><span>25/11/2026</span><span><DepotState text="Draft" /></span></div>}
              {DEPOT_INVOICES.map(([no, customer, tanks, date]) => (
                <div key={no} className="depot-grid depot-tr depot-inv-grid"><span className="depot-link">{no}</span><span>{customer}</span><span>{tanks}</span><span>{date}</span><span><DepotState text="Issued" /></span></div>
              ))}
            </section>
          </main>
        )}

        <div className="depot-dim" data-on={s.modal || undefined} />
        <div className="depot-modal" data-on={s.modal || undefined}>
          <div className="depot-m-head"><b>เลือกแทงก์</b><span>เลือกได้เฉพาะลูกค้าเดียวกัน</span></div>
          <div className="depot-m-filters"><span className="depot-input">ลูกค้า: {DEPOT_CUSTOMER.A}</span><span className="depot-input">ประเภทใบแจ้งหนี้: Cleaning / LOLO</span></div>
          <div className="depot-m-grid depot-th"><span /><span>เบอร์แทงก์</span><span>ชื่อลูกค้า</span><span>งาน</span><span>วันที่</span></div>
          {picks.map(([tank, customer, job], i) => {
            const blocked = customer !== "A";
            const checked = s.sel.includes(tank);
            return (
              <div key={tank} className="depot-m-grid depot-tr" data-off={blocked || undefined} data-pressed={s.press === `row${i}` || undefined}>
                <span className="depot-check" data-on={checked || undefined}>{checked ? "✓" : ""}</span>
                <span>{tank}</span><span>{DEPOT_CUSTOMER[customer]}</span><span>{job}</span><span>{20 + i}/11/2026</span>
                {blocked && s.denied && <em className="depot-tip">คนละลูกค้า — เลือกไม่ได้</em>}
              </div>
            );
          })}
          <div className="depot-m-pages">
            <i data-on={s.mpage === 1 || undefined} data-pressed={s.press === "page1" || undefined}>1</i>
            <i data-on={s.mpage === 2 || undefined} data-pressed={s.press === "page2" || undefined}>2</i>
          </div>
          <div className="depot-m-foot"><span>เลือกแล้ว <b>{s.sel.length}</b> รายการ</span><i data-pressed={s.press === "confirm" || undefined}>ยืนยัน</i></div>
        </div>
        <p className="depot-toast" data-on={s.toast || undefined}>สร้างใบแจ้งหนี้สำเร็จ · 3 แทงก์</p>
        <Pointer at={DEPOT_AT[s.at]} press={s.press} />
      </div>
    </div>
  );
}

/* Beachbot: draw area → generate coverage path → run mission. */
export function BeachScreen({ on }) {
  return <RobotPreviewVideo on={on} name="beachbot-coverage" still={4.2}
    label="Beachbot area selection and coverage planner simulation" />;
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
