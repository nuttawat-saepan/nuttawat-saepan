# Handoff — portfolio session of 23–24 November 2026

Read this first if you are picking up from the previous agent. Also read `AGENTS.md` and the top
entries of `MOTION_SPEC.md` (newest first). The user writes mostly in Thai; answer in Thai.

## State of the repo

- Branch `redesign/editorial-portfolio`. User authorized committing the current portfolio changes
  on 24 November 2026 and setting `origin` to `https://github.com/nuttawat-saepan/nuttawat-saepan.git`.
  This handoff accompanies that commit (loader, cursor, showcases, scroll and phone-preview fixes).
  `.claude/` and `PROJECT_CONCEPTS.md` were already untracked and are excluded from that commit.
  Production build passed before committing. No push was requested.
- Next requested work: continue the Unitree Go2 app/video preview. Only source inspection has been
  done so far; no Go2 changes were made in this chat. Awaiting whether to use the existing project
  notes for animation or a real screen recording supplied by path.
- Another chat session also edits this folder and runs the dev server on **http://127.0.0.1:3000**
  (`npm run dev` → `next dev --hostname 127.0.0.1`). Starting a second server fails ("Another next dev
  server is already running"); use the one on :3000. Re-check files before editing: they may have moved.
- Next.js 16 (Turbopack). Lightning CSS drops `backdrop-filter` when a `-webkit-backdrop-filter` follows
  it in the same rule — write only the standard property.

- **Public names (25 Nov):** LCS is shown as **Tank Depot** and Beachboy as **Beach Robot** everywhere on the site (privacy); URLs `/projects/tank-depot`, `/projects/beach-robot`; code uses `DepotScreen` / `BeachScreen` / `depot-*`. Older notes below use the internal names.

- **Robot screens (25 Nov):** Go2 now mirrors the Go2 phone app (canvas voxel map, joysticks, action bar) plus a waypoint Mission card (tap W1/W2 → Start → reached → Complete 2/2); Beach Robot mirrors a "Robot control" dashboard (map, drive pad, Manual/Auto, coverage to 89%, STOP). Both on 1200 × 750 canvases with `--stage-scale`. Details at the top of MOTION_SPEC.md.

## What was built this session (all in `MOTION_SPEC.md` with timings)

1. **Loader** (`app/motion.jsx` `runOpening`, `.opening*` in `style.css`): slot-machine counter —
   two digit wheels slide 0→9 (1.3 s, ease-in-out, ones 250 ms after tens), hold "99%" 1 s, "99%" slides
   up/fades while "100%" rises, then fade and the ink fades off (timed to the user's video
   `C:\Users\nutta\Videos\2026-11-23 23-40-10.mp4`). **Concept B hairline** under the counter: a rule draws
   in, a fill runs with the wheels to 97% with a tag "fetching web → building apps → booting robotics →
   shipping the last 1% ●" → "ready", then fill clears right, rule retracts (reference
   `2026-11-24 19-42-49.mp4`).
   - Plays on **every full load of home**; skipped when home is reached by in-site navigation
     (`openedInThisDocument` module flag, or the visit began on another page). The old sessionStorage
     `ns-opened` flag is gone; `layout.jsx` now only drops `data-opening` off-home.
2. **Custom cursor** (`app/cursor.jsx`, mounted in `layout.jsx`; `.cursor*` in `style.css`), desktop
   pointers only, after bennet.clapat.com. States: default 28 px gray ring · loading = frosted disc
   (5% paper + 6 px blur, label centred) "[ Loading ]" · name = red **Hello badge** with rotating "HELLO • สวัสดี" ·
   top bar = faint 120 px disc · project route links = **Viewfinder** corners + red dot + "[ OPEN ]" ·
   text buttons (Scroll, View projects, View all work, Back to home) = magnetic + **Ink sweep** pill
   (`--fg` pill, `--bg` text) · other controls = red ring. The user picked N2 / R3 / B1 from 3 options each.
3. **Selected projects laptop** (`app/selected-work.jsx`): device reveal like the kisracorp.com clips —
   lid starts closed, rises/opens when 45% in view; switching project flips the lid. Each project plays a
   live mock drawn in code on mock data (no company footage):
   - **oneD** (`app/oned-showcase.jsx`): real layout from the user's recording of the live site
     (`2026-11-24 21-54-01.mp4`) — Shorts list page → pointer picks a poster → full-screen player
     (✕/sound, 9:16 player, action column, ↑↓) → next, like, next → close. User approved ("Looks right").
     **No phone** — the user did not build oneD's mobile app.
   - **ThaiThai** (`app/showcases.jsx` `ThaiThaiPhone`): phone app — laptop lid folds shut
     (`data-device="phone"`), phone rises centred. Feed → ไลฟ์ → live room → ซื้อเลย → order sheet →
     PromptPay → สั่งซื้อสำเร็จ. Tab labels are the real app's (from `C:\dev\thaithai-flutter`).
     Latest screenshot cleanup: lid and base now fade out in phone mode (standalone phone), fade
     back for web projects. Feed uses overlapping full-height clips with a 400 ms cross-fade so
     the next clip's flat background no longer enters as a blank horizontal band mid-swipe.
   - **Unitree Go2** (`Go2Screen`): ground-station view of the closed-loop simulation (map, plan W1→W2,
     scan rays, AprilTag lock, MQTT log, "Mission complete — 2/2").
   - **LCS** (`LcsScreen`): real layout from the user's screenshot (blue sidebar, รายการแทงก์ list), mock data; search → Invoice → tank-selection modal.
     other-customer tanks blocked, confirm → toast). Not checked against real LCS screens.
   - **Beachboy** (`BeachboyScreen`): mission control — Preview draws coverage lanes around an exclusion
     zone, Start runs the robot to 89% (the figure from the user's simulation report).
4. **Smooth scroll fix** (`app/motion.jsx` `onWheel`): only a section that can scroll itself
   (`overflow-y: auto|scroll`) takes the wheel. THE WORK (`#work`, `overflow: clip`) reports 50 px extra
   scrollHeight, which used to hand the wheel to native scrolling and drop the smoothing there.
   Verified: wheel events over #work, #profile and #projects are now handled (defaultPrevented).
   Latest correction after user reported no smooth scroll with a desktop mouse: removed the
   `fromTrackpad` heuristic that bypassed easing for precision wheels too. All desktop wheel input
   now eases with a 240 ms time constant (was 180 ms). Reduced motion, touch and nested native
   scrollers keep their behavior. Browser samples confirmed gradual document/row motion over
   multiple frames (y 562 → 979 over 335 ms); user physical-mouse feel is pending.
5. **Reload returns to the first Home panel** (`app/motion.jsx`, latest user correction): the previous
   keep-position implementation was the opposite of the requested behavior. Removed `ns-scroll`
   saving/restoring. On reload, manual scroll restoration plus an explicit scroll/row reset returns
   to 0 under the loader; clear any section hash while preserving query parameters and history state.
   Fresh section links still work; project routes are not redirected. Verified narrow Profile →
   reload → 0, and desktop 1440×900 Projects (y 5428, row −4071px) → reload → y 0, row 0px,
   hash cleared, query retained, loader counting. Item 1 concerns loader playback; this item controls
   which panel is shown after it.

## Not done / open

- **Not verified live**: the in-app browser pane was hidden all session, so animation frames and CSS
  transitions did not run; checks used paused/finished animations and screenshots. Ask the user to
  watch: loader timing, cursor transitions, laptop reveal, every project loop (Go2/Beachboy use rAF).
- LCS and Go2/Beachboy screens are designed from `PROJECT_CONCEPTS.md`, not from recordings. If the user
  sends recordings (as for oneD), rebuild to match the real layout.
- Brand: oneD uses plain "oneD" text and the portfolio red, not its logo/pink; ThaiThai uses the
  portfolio red, not its blue — pending the user's confirmation that brand use is allowed.
- `robot-buddy-dashboard` (C:\dev) was deliberately **not** used: no evidence in `PROJECT_CONCEPTS.md`
  that the user wrote it.
- Console shows a pre-existing React warning about the inline `<script>` in `layout.jsx` (loader skip).
- The user may want a commit next; never commit without being asked.

## Ways of working the user responded well to

- Show **3 examples** (inline interactive demos) before building when the user asks for a design;
  then build the chosen one exactly.
- Measure reference videos frame by frame (ffmpeg contact sheets in the scratchpad) and state observed
  timings vs implemented ones in `MOTION_SPEC.md`.
- Keep claims honest to `PROJECT_CONCEPTS.md` (only the user's own work; label simulations as such).
