"use client";

import { useEffect, useRef, useState } from "react";

// A small rebuild on mock data that demonstrates the oneD concepts. It is not company code.
const FIRST_PAGE = 6;
const NEXT_PAGE = 4;
const MAX_PAGES = 5;
const tones = ["#2c2c2a", "#3b2723", "#22302a", "#282a35"];

const pad = (value) => String(value).padStart(2, "0");
const compact = (value) => (value >= 1000 ? `${(value / 1000).toFixed(1).replace(/\.0$/, "")}K` : String(value));
const makeClips = (start, count) => Array.from({ length: count }, (_, offset) => {
  const id = start + offset + 1;
  return { id, likes: 800 + ((id * 1371) % 15000) };
});

function SoundIcon({ muted }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9H4z" />
      {muted ? <path d="m17 9 5 6M22 9l-5 6" /> : <path d="M17 9a4 4 0 0 1 0 6M19.5 6.5a8 8 0 0 1 0 11" />}
    </svg>
  );
}

export default function OneDPreview() {
  const feed = useRef(null);
  const fetching = useRef(false);
  const timers = useRef({});
  const [clips, setClips] = useState(() => makeClips(0, FIRST_PAGE));
  const [active, setActive] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState({});
  const [muted, setMuted] = useState(true);
  const [log, setLog] = useState("Scroll the feed to start");

  useEffect(() => {
    if (fetching.current || pages >= MAX_PAGES || active < clips.length - 3) return;
    fetching.current = true;
    setLoading(true);
    setLog(`Near the end · fetching page ${pages + 1} by cursor`);
    timers.current.page = setTimeout(() => {
      setClips((current) => [...current, ...makeClips(current.length, NEXT_PAGE)]);
      setPages((count) => count + 1);
      setLoading(false);
      setLog(`Page ${pages + 1} appended below`);
      fetching.current = false;
    }, 650);
  }, [active, clips.length, pages]);

  useEffect(() => () => Object.values(timers.current).forEach(clearTimeout), []);

  function onScroll() {
    const element = feed.current;
    const index = Math.round(element.scrollTop / element.clientHeight);
    if (index !== active && index < clips.length) setActive(index);
  }

  function toggleLike(id) {
    const next = !liked[id];
    setLiked((current) => ({ ...current, [id]: next }));
    setLog(`${next ? "Liked" : "Unliked"} ${pad(id)} on screen · syncing…`);
    clearTimeout(timers.current[id]);
    timers.current[id] = setTimeout(() => setLog(`${pad(id)} synced · only the last state was sent`), 400);
  }

  function toggleSound() {
    setMuted((current) => !current);
    setLog(muted ? "Sound on · remembered across the feed" : "Muted");
  }

  const mounted = [active - 1, active, active + 1].filter((index) => index >= 0 && index < clips.length).map((index) => pad(clips[index].id));

  return (
    <div className="app">
      <div className="app-nav">
        <p className="app-brand">Shorts<i>.</i></p>
        <p className="app-tab is-on">For You</p>
        <p className="app-tab">Following</p>
        <p className="app-note">Example rebuild<br />Mock data</p>
      </div>

      <div className="app-feed" ref={feed} onScroll={onScroll} tabIndex={0} aria-label="Example short clips">
        {clips.map((clip, index) => {
          const isActive = index === active;
          const isNear = Math.abs(index - active) <= 1;
          return (
            <article key={clip.id} className="app-clip" style={{ "--tone": tones[index % tones.length] }} data-active={isActive || undefined}>
              <span className="app-clip-index">{pad(clip.id)}</span>
              <span className={`app-state ${isActive ? "is-player" : isNear ? "is-mounted" : "is-cold"}`}>
                {isActive ? "Player" : isNear ? "Mounted" : "Thumbnail"}
              </span>
              <div className="app-meta">
                <b>@creator_{pad((clip.id % 7) + 1)}</b>
                <p>Example clip {pad(clip.id)}</p>
              </div>
              <div className="app-actions">
                <button type="button" className="app-like" aria-pressed={Boolean(liked[clip.id])} aria-label={`Like clip ${clip.id}`} onClick={() => toggleLike(clip.id)}>
                  <span aria-hidden="true">♥</span>{compact(clip.likes + (liked[clip.id] ? 1 : 0))}
                </button>
                <button type="button" className="app-sound" aria-pressed={!muted} aria-label={muted ? "Unmute" : "Mute"} onClick={toggleSound}>
                  <SoundIcon muted={muted} />
                </button>
              </div>
              {isActive && muted && <button type="button" className="app-unmute" onClick={toggleSound}>Tap to unmute</button>}
              <span className="app-progress"><i /></span>
            </article>
          );
        })}
        {loading && <p className="app-loading">Loading next page…</p>}
      </div>

      <div className="app-side">
        <p className="app-side-label">{"// Live readout"}</p>
        <dl>
          <div><dt>Active clip</dt><dd>{pad(clips[active].id)} / {pad(clips.length)}</dd></div>
          <div><dt>Players</dt><dd>1 shared</dd></div>
          <div><dt>Mounted</dt><dd>{mounted.join(" · ")}</dd></div>
          <div><dt>Pages (cursor)</dt><dd>{pages}{loading ? " + 1…" : ""}</dd></div>
          <div><dt>Sound</dt><dd>{muted ? "Muted" : "On"}</dd></div>
        </dl>
        <p className="app-log" aria-live="polite">{log}</p>
      </div>
    </div>
  );
}
