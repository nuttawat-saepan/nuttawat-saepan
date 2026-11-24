"use client";

import { useEffect, useState } from "react";

// oneD in the Selected projects laptop, laid out like the real oneD Shorts pages the user built
// (from the user's recording of the live site, 2026-11-24 21-54-01.mp4) but drawn in code on mock
// data: fictional titles and flat colour posters instead of the channel's artwork, and "oneD" as
// plain text with the portfolio's red instead of the oneD logo and pink.
// The laptop plays the real flow: the Shorts list → pick a title → the full-screen player
// (✕ and sound top-left, 9:16 player in the middle, actions beside it, ↑ ↓ at the far right) →
// next clip, like, next clip → close. A pointer acts it out. No phone: the user built the web
// Shorts pages, not oneD's mobile app.

const POSTERS = [
  { title: "ทายาทลับ", tone: "#5a2a22", dub: true },
  { title: "แค้นรัก", tone: "#2d3b3a" },
  { title: "บ้านริมทุ่ง", tone: "#4a3d2a", dub: true },
  { title: "หัวใจนักสู้", tone: "#2f2f3b" },
  { title: "เงาอดีต", tone: "#3a2f2f", dub: true },
  { title: "สัญญาใจ", tone: "#43262f" },
];
const LATEST = [
  { title: "รักต่างขั้ว", tone: "#2a3a2f" },
  { title: "คืนจันทร์", tone: "#3b3a36" },
  { title: "ตามหาเธอ", tone: "#5a2a22" },
  { title: "ร้านลับ", tone: "#2d3b3a" },
  { title: "เดิมพัน", tone: "#4a3d2a" },
  { title: "ฝันสุดท้าย", tone: "#2f2f3b" },
  { title: "ใจกลางเมือง", tone: "#3a2f2f" },
];
// Clips of the picked title ("แค้นรัก"), episode by episode.
const CLIPS = [
  { ep: 1, line: "เธอกลับมาเพื่อทวงทุกอย่างคืน", tone: "#2d3b3a", likes: "12.3K" },
  { ep: 2, line: "ความลับที่ซ่อนไว้สิบปี", tone: "#3b2a2a", likes: "9.8K" },
  { ep: 3, line: "คืนที่ทุกอย่างเปลี่ยนไป", tone: "#2a2f3b", likes: "15.1K" },
];
const PICK = 1;

// Pointer targets, as % of the screen (the layout below is in container units, so they line up).
const AT = {
  rest: [52, 92],
  poster: [31, 34],
  down: [90.6, 53.5],
  heart: [71, 62],
  close: [4.1, 5.5],
};

// One pass of the flow; each step: [time ms, change]. The pass repeats.
const SCRIPT = [
  [0, { view: "list", clip: 0, liked: false, at: "rest", press: null }],
  [700, { at: "poster" }],
  [1500, { press: "poster" }],
  [1750, { view: "player", press: null }],
  [2700, { at: "down" }],
  [3500, { press: "down", clip: 1 }],
  [3750, { press: null }],
  [5000, { at: "heart" }],
  [5700, { press: "heart", liked: true }],
  [5950, { press: null }],
  [7000, { at: "down" }],
  [7700, { press: "down", clip: 2, liked: false }],
  [7950, { press: null }],
  [9300, { at: "close" }],
  [10000, { press: "close" }],
  [10250, { view: "list", press: null, at: "rest", clip: 0 }],
];
const PASS = 11200;
const START = SCRIPT[0][1];

function useScript(on) {
  const [state, setState] = useState(START);
  useEffect(() => {
    setState(START);
    if (!on) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setState({ ...START, view: "player" });
      return undefined;
    }
    const timers = [];
    const pass = () => {
      SCRIPT.forEach(([time, change]) => timers.push(window.setTimeout(() => setState((now) => ({ ...now, ...change })), time)));
      timers.push(window.setTimeout(pass, PASS));
    };
    pass();
    return () => timers.forEach(window.clearTimeout);
  }, [on]);
  return state;
}

const Icon = {
  close: <path d="M6 6l12 12M18 6L6 18" />,
  sound: <path d="M4 10v4h3l4 3V7L7 10H4zm11-1a4 4 0 0 1 0 6m2-9a8 8 0 0 1 0 12" />,
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
  comment: <path d="M5 5h14v10H9l-4 4z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  share: <path d="M14 5l6 6-6 6M20 11H9a5 5 0 0 0-5 5v2" />,
  up: <path d="M6 14l6-6 6 6" />,
  down: <path d="M6 10l6 6 6-6" />,
  search: <path d="M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5L20 20" />,
  next: <path d="M9 6l6 6-6 6" />,
};
const Svg = ({ name, className }) => <svg viewBox="0 0 24 24" className={className ?? "od-i"}>{Icon[name]}</svg>;

function Poster({ item, className, pressed }) {
  return (
    <div className={className} style={{ background: item.tone }} data-pressed={pressed || undefined}>
      {item.dub && <span className="od-dub">พากย์ไทย</span>}
      <b>{item.title}</b>
    </div>
  );
}

function Actions({ clip, liked, press }) {
  return (
    <div className="od-actions">
      <span className="od-like" data-liked={liked || undefined} data-pressed={press === "heart" || undefined}><Svg name="heart" /><em>{clip.likes}</em></span>
      <span><Svg name="comment" /><em>ตอนทั้งหมด</em></span>
      <span><Svg name="plus" /><em>รายการของฉัน</em></span>
      <span><Svg name="share" /><em>แชร์</em></span>
    </div>
  );
}

function Feed({ index }) {
  return (
    <div className="od-track" style={{ transform: `translateY(${-index * 100}%)` }}>
      {CLIPS.map((clip) => (
        <div key={clip.ep} className="od-clip" style={{ background: clip.tone }}>
          <span className="od-scene" />
          <p className="od-cap"><b>{POSTERS[PICK].title} · EP.{clip.ep}</b>{clip.line}</p>
        </div>
      ))}
    </div>
  );
}

export function OneDScreen({ on }) {
  const s = useScript(on);
  const clip = CLIPS[s.clip];
  const [x, y] = AT[s.at];
  return (
    <div className="od-web" data-view={s.view}>
      {/* Shorts list page */}
      <div className="od-list">
        <div className="od-nav">
          <b>oneD</b>
          <span>หน้าหลัก</span><span>ดูทีวีสด</span><span data-on>ละครแนวตั้ง</span><span>รายการของฉัน</span>
          <i className="od-search"><Svg name="search" />ค้นหา</i>
          <i className="od-avatar">N</i>
          <i className="od-premium">สมัคร PREMIUM</i>
        </div>
        <div className="od-row od-row-big">
          {POSTERS.map((item, order) => <Poster key={item.title} item={item} className="od-poster" pressed={order === PICK && s.press === "poster"} />)}
          <span className="od-more"><Svg name="next" /></span>
        </div>
        <p className="od-row-label">เข้าใหม่ล่าสุด</p>
        <div className="od-row od-row-small">
          {LATEST.map((item) => <Poster key={item.title} item={item} className="od-poster od-poster-small" />)}
        </div>
      </div>

      {/* Full-screen Shorts player */}
      <div className="od-play">
        <span className="od-btn od-close" data-pressed={s.press === "close" || undefined}><Svg name="close" /></span>
        <span className="od-sound"><Svg name="sound" /></span>
        <div className="od-player"><Feed index={s.clip} /></div>
        <Actions clip={clip} liked={s.liked} press={s.press} />
        <div className="od-arrows">
          <span className="od-btn"><Svg name="up" /></span>
          <span className="od-btn" data-pressed={s.press === "down" || undefined}><Svg name="down" /></span>
        </div>
      </div>

      <svg className="od-pointer" viewBox="0 0 24 24" style={{ left: `${x}%`, top: `${y}%` }} data-press={s.press ? "" : undefined}>
        <path d="M5 3l14 8-6 1.5L10 19z" />
      </svg>
    </div>
  );
}
