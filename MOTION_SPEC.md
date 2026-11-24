# ThaiThai preview cleanup — 24 November 2026

User screenshot showed a partial next feed clip as a flat green band and the folded laptop stretching behind the phone.

- Feed clips now overlap and cross-fade over 400 ms, replacing the vertical track translation. Each clip fills the feed viewport throughout the transition; the scripted fingertip gesture and feed → live → order → payment sequence remain.
- The laptop lid still folds when ThaiThai is selected, but both lid and base fade out (350 ms), leaving a standalone phone. They fade back in for web projects; their dimensions stay in flow to avoid a layout jump.
- Browser check at 1440×900: both clips match the 309 px feed height with top 0; phone mode lid/base opacity is 0. Live/order overlay also rendered in the phone.

---

# Desktop wheel smoothing — 24 November 2026 (latest correction)

User reports no visible smooth scroll using a mouse wheel on desktop.

- Removed `fromTrackpad`: `wheelDelta % 120` is not a reliable device test and could send precision mouse input down the instant-scroll path. All desktop wheel input now eases toward its target, vertical or sideways.
- Increased the easing time constant from 180 to 240 ms for a more visible glide (about 95% of remaining distance in 720 ms). Reduced motion still moves immediately; touch scrolling and nested scrollable panels keep native behavior.
- Browser verification at 1440×900, reduced motion off: wheel input moved the document and horizontal row gradually, y 562 → 626 → 740 → 888 → 979 over 335 ms, rather than jumping to the target. This verifies the browser test input; the user's physical mouse feel still needs their assessment.

---

# Refresh returns to Home — 24 November 2026 (latest correction)

User clarification: refreshing Home should return to the first panel, not keep the previous scroll position. This supersedes the scroll-restoration note below.

- Removed the `ns-scroll` save/restore and `pagehide` handler in `app/motion.jsx`.
- On reload, keep manual browser scroll restoration, clear a section hash with `replaceState` (preserving history state and query parameters), scroll to 0 and reset the horizontal row before the loader reveals Home.
- A fresh visit with a section URL such as `/#projects` still goes to that section; in-site section navigation remains unchanged. Project routes are not redirected by this change.
- Verified in the browser: narrow layout Profile → reload gives scrollY 0; desktop 1440×900 direct Projects link gives scrollY 5428 / row −4071px → reload gives scrollY 0 / row 0px, no hash, query retained, loader counting.

---

# Selected projects: device reveal and a live mock per project — 24 November 2026

User decision: the Selected projects laptop shows each project as a short live mock instead of its first concept slide, using motion like the user's references (kisracorp.com `service1–3.mp4`), starting with oneD. What's inside stays on the project pages. The references are Kisra's marketing clips (service1 is oneD's movie side); none of their footage is used.

Observed in the references (4.5 s each, 1920×1080, white background): the laptop rises from flat while its lid swings open (0.1–0.6 s), settles, then a phone (and in service2 a tablet) slides in from the side and settles over the laptop's corner (0.9–2.0 s, ease-out); the screens hold real product screenshots. service3 instead types into a search bar on the laptop.

Implemented (`app/selected-work.jsx`, `app/oned-showcase.jsx`, `app/showcases.jsx`, `app/style.css`; desktop only, as the preview is hidden on phones):
- **Reveal**: the lid starts closed (rotateX(-88deg), hinge at the bottom, perspective 1600 px). The first time the laptop is 45% in view it rises (translateY 10% → −2% → 0, scale .94 → 1, 900 ms) while the lid opens with a small overshoot (−88° → 5° → 0, 750 ms, cubic-bezier(.22, 1, .36, 1)); the phone follows 850 ms later.
- **Switching project**: the lid flips up again from −50° with the screen dimmed to 55% (600 ms). To or from ThaiThai the lid instead closes (rotateX(−84deg), brightness .5, 700 ms) or reopens.
- **oneD laptop screen** — rebuilt to the real layout (user: "Rebuild like real", after recording the live site, `C:\Users\nutta\Videos\2026-11-24 21-54-01.mp4`; the first version invented a nav and a HUD the real page does not have). Mock content only: fictional Thai titles on flat colour posters instead of the channel's artwork, "oneD" as text and the portfolio red instead of the oneD logo and pink, until the user confirms the brand may be used.
  - *Shorts list* (as on the live site): top bar with "oneD", หน้าหลัก · ดูทีวีสด · ละครแนวตั้ง (red, current) · รายการของฉัน, a search box, an avatar and a "สมัคร PREMIUM" button; a row of large 2:3 posters with "พากย์ไทย" badges and a › button; "เข้าใหม่ล่าสุด" with a row of smaller posters.
  - *Player* (as on the live site): black, ✕ top-left and a sound icon, a 9:16 player in the middle (caption "<title> · EP.n" at the bottom), an action column to its right (like with count, ตอนทั้งหมด, รายการของฉัน, แชร์) and ↑ ↓ buttons at the far right. Clips are flat colour with two soft figure shapes drifting slowly.
  - *Flow* (11.2 s, repeats; a pointer acts it out like a screen recording): list → pointer to the second poster, press (scale .96 with a ring) → the player fades in → ↓ (next episode) → like (heart fills red) → ↓ → ✕ → back to the list. The pointer glides 700 ms between targets; pages cross-fade 400 ms.
- **No oneD phone** (user: "oneD I didn't do phone app, remove it"). The engineering annotations of the first version (shared-player frame, HUD, debounce note) are off the screen; they belong to What's inside.
- **ThaiThai** (user: "ThaiThai is a phone app"): the laptop folds shut and a phone (27% of the laptop width, 9:19.5) rises in the middle (translateY 25% → 0, 800 ms). Tab names are the real app's, read from `thaithai-flutter` (`footer_menu_bar.dart`, `top_floating_menu.dart`, `app_th.arb`): top สำหรับคุณ · ไลฟ์ · ครีเอเตอร์; bottom หน้าแรก · มอลล์ · + · Fortune AI · โปรไฟล์; ชำระเงิน, ยืนยันสั่งซื้อ, ส่งฟรี. Flow (11.6 s, a fingertip disc acts it out): feed swipe to the next clip → tap ไลฟ์ → live room (host, LIVE, viewers, chat lines arriving, pinned product "เซรั่มหน้าใส ฿299 · ส่งฟรี") → ซื้อเลย → order sheet (total, ยืนยันสั่งซื้อ) → PromptPay QR → สั่งซื้อสำเร็จ → back to the feed. Mock users/products; portfolio red, not the app's blue.
- **Unitree Go2** (ground station): top bar "Ground station · ROS 2 · Nav2 · FAST-LIO" with a blinking "closed-loop simulation" tag; left, a top-down map (walls, dotted grid) with the red dashed plan through W1 and W2, the robot driving it (0.16 px/ms, 700 ms stop at W1) with 24 scan rays clipped by the walls and a white trail; right, mission n / 2, cmd_vel, an AprilTag camera whose red brackets snap in when the tag locks, and a log (nav2 goals, "mqtt mission/status → W1/W2 reached", "apriltag: id 07 · pose locked"). Ends on "Simulation result — Mission complete — 2 / 2 waypoints", then repeats.
- **LCS** (invoice tank selection, light admin UI): sidebar แดชบอร์ด · ใบประเมินค่าซ่อม · ใบแจ้งหนี้ (current) · เบิกคืนอะไหล่ · รายงาน; modal "เลือกแทงก์". Flow (11.4 s, pointer): type "TK-01" → spinner for 250 ms (debounce) → results; tick two tanks; a tank of another customer is greyed and shows "คนละลูกค้า — เลือกไม่ได้"; page 2, tick one; back to page 1, the ticks are still there; ยืนยัน → toast "สร้างใบแจ้งหนี้แล้ว · 3 แทงก์" and a new invoice row. Fictional customers (Alpha Logistics, Bravo Chemicals) and tank numbers. Not checked against the real LCS screens (no recording, repo not on this machine).
- **Beachboy** (mission control): state chip IDLE → PLANNED → RUNNING → COMPLETE, RTK FIX, simulation tag; map with sea strip, dashed work area, margin and a hatched exclusion zone; Coverage panel (spacing 0.8 m, margin 0.5 m, bearing 0°, Preview / Start / Stop). Pointer presses Preview → nine lanes draw in (the top three stop short of the exclusion zone) → Start → the robot runs the serpentine with a wide trail while "Covered" climbs to 89% → "Simulation · 8 × 6 m — 89% covered, no collisions" (the figures in the user's test report).
- The loops run only for the project on show, after the reveal; reduced motion holds a still frame and skips the reveal.
- The note under the laptop now reads "Screens are redrawn on mock data from my notes; live sites stay private for NDA or internal projects".

---

# Loader: hairline under the counter (concept B) — 24 November 2026

User decision: concept B of three adaptations of the hairline loader in the user's reference recording (`C:\Users\nutta\Videos\2026-11-24 19-42-49.mp4`, 6.3 s, 1280×720, 30 fps). It keeps the slot-machine counter and its timings from the 23 November entry and adds the hairline beneath it.

Observed in that reference (pixel rows measured per frame): at 0.40 s a "Media loading" label appears and a gray hairline draws left→right (about 400 ms, ease-out) with a white "000%" tag at its start; it holds at 000% for about 1.4 s; from 1.93 s a white fill runs to the right end in about 1.2 s (slow start, fast middle, long glide), the tag riding its tip; it holds at 100% about 400 ms; the fill clears off to the right (about 130 ms), the gray rule retracts (about 300 ms), the label and tag fade; about 0.5 s later the page fades in (about 750 ms).

Implemented (`app/motion.jsx`, `app/style.css`):
- A 1 px rule (paper at 22%) sits under the counter, clamp(1.5rem, 5dvh, 3rem) below it, across the frame. It draws in left→right (420 ms, +300 ms, cubic-bezier(.16, 1, .3, 1)).
- A paper fill runs from the tens wheel's start to the ones wheel's landing (1,550 ms, cubic-bezier(.7, 0, .15, 1)) and stops at 97%. A paper tag with ink text rides its tip; instead of a number it names the stage: "fetching web" (from 0), "building apps" (from 34%), "booting robotics" (from 67%).
- During the 1 s wait at "99%" the tag reads "shipping the last 1%" with a red ● blinking every 500 ms. At the swap it reads "ready" and the fill completes (150 ms).
- After "100%" settles, the fill clears off to the right (140 ms), then 150 ms later the rule retracts towards the right (300 ms) as the tag fades. This replaces the 450 ms hold on "100%". Then "100%" fades and the ink fades as before.
- The fill's progress is the registered custom property `--p` (`@property`), animated on `.opening-line`; the fill width and tag position derive from it, and a frame loop re-labels the tag.
- When it plays (user asked where the loader went, since reloads no longer showed it): on every full load of home, a reload included. It is still skipped when home is reached from inside the site, which was the goal of the earlier "once per visit" rule: after it has played in this document (client navigation back from a project page), or when the visit began on another page. This replaces the sessionStorage flag; the layout's inline script now drops `data-opening` only on pages other than home.
- Reload keeps the place (user: "why refresh it now start on top/left"): the browser can't restore the scroll itself — the page is one screen long until `measureTrack` sets `--travel`, and the loader locks scrolling — so it fell back to the start. `motion.jsx` now saves `{ path, y }` to sessionStorage (`ns-scroll`) on `pagehide`, sets `history.scrollRestoration = "manual"`, and on a reload of the same path scrolls back to that y under the loader; when the ink fades the visitor is where they left. Without a saved position a URL hash still goes to its panel.

---

# Custom cursor — 24 November 2026

User decision: a custom cursor like bennet.clapat.com's, with six states the user specified from screenshots of that site. Our colours replace its orange (red), and its "eyes" become a smiley face.

Observed on the reference (its `common.js` and computed styles): an 80 px ball shown at scale .5 with a 4 px #999 border, following the pointer with GSAP easing; a 100 px ring rotating every 0.8 s while the preloader runs; on links with a label, scale 1.4, filled with the primary colour, blurred backdrop and a centred text line; on magnetic ("parallax") buttons the ball hides and the button follows the pointer; native cursor hidden.

Implemented (`app/cursor.jsx`, mounted in `app/layout.jsx`; styles in `app/style.css`), desktop pointers only (`hover: hover` and `pointer: fine`); phones keep their native behaviour:
1. **Default**: a 28 px gray ring (1.5 px, rgb(150 150 146 / .8); first built at 40 px / 3 px, which the user found too big and heavy) that trails the pointer with a 90 ms time constant. The native pointer is hidden.
2. **Name** (`.hero-name`): **Hello badge** (user's pick N2 of three; replaces the first-built smiley). A 100 px red disc; "HELLO • สวัสดี • HELLO • สวัสดี •" in paper (600, 10.5/100 of the disc) runs round its edge, turning once every 7 s, with a paper dot in the centre. It scales in from .5 (450 ms).
3. **Top bar and rail controls** (`.site-header a, button`): a 120 px disc of the section's text colour at 7–9% opacity.
4. **Text buttons** (Scroll, View projects, View all work, Back to home): **Ink sweep** (user's pick B1; replaces the red arrow disc). The ring hides and the button leans towards the pointer (a quarter of the offset, at most 14 px across, 10 px down), easing back when left. A pill in the section's text colour (`--fg`), .35em × .7em larger than the label, sweeps in from the left (450 ms, cubic-bezier(.65, 0, .35, 1)); the label turns the section's background colour (`--bg`) and its underline fades. On the red footer the pill is ink with red text.
5. **Project routes** (Related work rows and "What's inside", What I do "Seen in" links, `/projects` cards, next project): **Viewfinder** (user's pick R3; replaces the frosted "[ Open ]" disc). The ring opens to a 104 px square of four 16 px corner brackets (2 px, the section's text colour) with a 5 px red centre dot and "[ OPEN ]" (.62rem, tracked .1em) just below the centre.
6. **Loading** (while `data-opening` is loading, counting or exiting): a 120 px frosted disc (paper at 5% with a 6 px backdrop blur — first 10% / 10 px, user asked for lower opacity; before that a solid #1f1f1e) with "[ Loading ]" in paper, the label filling the disc so its text sits exactly in the centre; the cursor is centred on screen until the pointer moves.
- Any other control: the ring grows to 56 px and turns red. Pressing shrinks the cursor to 85%.
- Size changes take 450 ms (var(--ease)); fills 350 ms. Text colour and tints follow the `data-theme` of the section under the pointer, and the state is re-read on scroll and wheel as well as on movement.
- A modal dialog (the slide viewer) sits in the top layer above the cursor, so the native pointer returns while one is open. Reduced motion: the ring follows exactly and nothing is magnetic.

---

# Home follows the reference: THE WORK → Chapter II, project pages — 24 November 2026

User decision: copy khanhnguyen.design's structure; the case study / example app move to separate pages, as the reference has `/works/<slug>`. Font: a modern sans, not the reference's serif. Video: the user generates it (prompt given in chat) as `public/assets/the-work.mp4`; until then the old montage plays as a fallback `<source>`.

Observed on the reference (1440×900): THE WORK is one panel with "THE" and "WORK" in large type and a 16:9 film between them. The row holds still for 900 px of scroll while the film grows linearly from 0 to about 1615×908 (just past full screen), pushing the words off the sides; the row then carries on and the full-screen film slides out left as Chapter II slides in. Chapter II (Related work): a big list of project names on the right; hovering lights one (↗, the rest grey) and shows its thumbnail; each links to `/works/<slug>`; "View all work →" links to `/works`. Project page: back link, big title, overview, details table, next project, large images. `/works`: numbered cards with category — year.

Implemented:
- **Order and themes**: Home (paper) → (01) Quick intro (ink) → THE WORK (paper) → (02) Selected projects (ink) → (03) What I do (paper) → (04) Contact (red). The menu follows: Home, Profile, Projects, What I do, Contact. The in-page cases, laptop dive and screen tabs are gone from home.
- **Font**: Geist (headings and Latin text); Thai stays IBM Plex Sans Thai.
- **THE WORK** (desktop): the row holds still for one panel of scroll (`--dive-len: 1`); the film scales from 0 to 110% of the larger of the panel width and the screen height at 16:9, linearly with that scroll; "The" and "Work" stay pinned to its edges, so they are pushed off the sides. `--dive` is written only onto the film and the two words. Phones: the words sit above a 16:9 film, no scroll-driven growth. Reduced motion: no hold, the film shows full size.
- **Chapter II** (`selected-work.jsx`): left, the hovered project's summary and stack above a laptop showing its first slide (cross-fade 350 ms), and a footnote; right, "Hover to preview · Click to explore", "Related work" and the numbered list. The lit row turns from grey to white with ↗, and its meta (scope — year, "What's inside (n) →") slides open (grid row 0fr→1fr, 450 ms). Every name links to `/projects/<slug>`; "View all work →" links to `/projects`. Phones: list only, every row's meta open, footnote last.
- **Project pages** (`/projects/<slug>`, `/projects`): see the 23–24 November build; What I do's "Seen in" links now go there.
- **Loader once per visit**: motion.jsx sets a sessionStorage flag; an inline script in the layout drops `data-opening` before first paint on a return visit or on any page other than home, so coming back from a project page doesn't replay the loader.

---

# Slot-machine loader — 23 November 2026

User decision: concept A ("Slot machine") from three merges of the old portfolio-2026 loader (`LoadingV3`) with the current counter, with each wheel sliding in one continuous ease-in-out move instead of stepping digit by digit. The user then supplied a reference recording (`C:\Users\nutta\Videos\2026-11-23 23-40-10.mp4`, 5.6 s, 1280×720, 30 fps) and asked to match its speed ratios and transitions only, not its content. This supersedes the 0→100 real count, the ink wipe and the name's mask rise in the 21 November entry; the ink overlay, caption, rail and the rest of the Home entrance stay as specified there.

Observed in the reference (30 fps frames, ±35 ms):
- "00" holds still, then the tens wheel starts at 0.40 s and the ones wheel at 0.65 s. Each slides 0→9 in about 1.3 s, slow at both ends and fast in the middle, so "99" lands at about 2.0 s.
- "99" holds about 1.0 s, with a "wait, wait.." caption rising in beneath it.
- 3.0 s: "99" and the caption slide up out of a top mask while fading (about 300 ms). From 3.15 s, "100" rises from below and fades in (about 400 ms), settling at 3.4 s.
- "100" holds about 450 ms, then fades out in place (3.85–4.25 s, no movement).
- Near the end of that fade (4.15 s), the whole black background fades to the light page in about 250 ms.
- About 350 ms later (4.7 s) the name fades in with a slight upward drift, fully dark by about 5.5 s.
- Not used: the "wait, wait.." caption, the smaller "100", the light-grey page colour, the orange eyed cursor and the name "bennet".

Implemented (`app/motion.jsx`, `app/style.css`):
- "00%" rises from the mask (700 ms, +100 ms) and holds; the tens wheel starts at 1.0 s, the ones wheel 250 ms later, each sliding 0→9 in 1,300 ms with cubic-bezier(.65, 0, .35, 1). Earlier tries at 1,100 ms and 1,700 ms are superseded.
- "99%" holds 1,000 ms. "99%" and "100%" share one grid cell inside the mask: "99%" moves up 100% and fades (300 ms, cubic-bezier(.5, 0, .75, 0)); "100%" starts 150 ms later, from 100% below to place, fading in (400 ms, cubic-bezier(.22, 1, .36, 1)). "100%" stays the same size as the counter.
- Hold 450 ms; "100%" fades out in place (400 ms, ease-out). 300 ms into that fade the ink overlay fades out (250 ms, ease-out). This replaces the bottom-to-top wipe.
- The name lines now fade up from .12em below (800 ms, var(--ease), +600 ms and +800 ms after the ink starts fading) instead of rising out of their masks. Grid lines, role, disciplines, Scroll and the sentence keep their 21 November timings.
- The ink is gone about 5.1 s after the first frame, and the name finishes about 1.4 s later.
- The wheel and row moves are Web Animations; Escape, focus or reduced motion cancel them and end the opening at once.

---

# Mobile layout and the concept accordion — 23 November 2026

User decision: build all 8 items of the mobile proposal.

**Concept list (desktop and mobile).** It is now an icon accordion, replacing the flat list.
- Each row shows the concept's icon in a circle, then the title, then the skill tag as plain small text.
- The open row's icon fills red. A red dot on an icon marks concepts already opened.
- The detail (eyebrow, text, Learning, Measured) opens right under its row, not below the list.
- Rows are at least 2.9rem tall on phones and 2.55rem on desktop.
- Phones and narrower desktops (≤1279px wide or ≤819px tall) show the first four rows plus "+N more". The open row always shows.
- On desktop the case column sits above the laptop, and the laptop base is 108% wide (was 116%) so it no longer runs under the column.

**Phones** (anything that isn't the horizontal desktop layout):
1. *What I do*: the three areas are a row of cards you swipe sideways (scroll-snap, each 84% wide), so the next card peeks in. The chapter shrinks from 1,508px to about 780px.
2. *Sticky screen*: the laptop sticks under the top bar on a full-width ink band. It shows the case crossing a reading line 60% down the screen. Above the first case the intro montage plays; past the last case, the last case stays shown. Picking a concept changes the slide as on desktop.
3. *Diagram viewer*: tapping the screen ("⤢ Tap to zoom") opens the current slide full screen. It is drawn at up to 0.7 scale (text about 15px) and pans sideways. The arrows step through the concepts, and ✕, Escape or a swipe down closes it.
4. *Compact ticket*: the name, then scope · stack · period on one wrapped line. The labels and bottom punch holes are dropped.
5. *Preview app*: opens full screen below the top bar, with the feed in the top 70% and the readout below. ✕ sits at the top centre, and the page behind can't scroll.
6. *Home*: less empty space (78svh), and the scroll cue points down.

Checked at 360, 390 and 430 wide: no sideways overflow and no console errors. All desktop checks still pass.

---

# What I do replaces Techstack — 22 November 2026

User decision: What I do replaces Techstack and sits between Profile and Projects. The story reads who → what I can do → proof → contact. Section labels are now (01) Quick intro, (02) What I do, (03) Selected projects, (04) Contact. The menu lists Home, Profile, What I do, Projects, Contact. Theme rhythm: paper, ink, paper, ink, red.

- Layout follows the reference's "Chapter III · What I do".
  - Desktop: one wide chapter in the row. A half-panel intro holds the label, "What I do." large in the middle, and a kicker plus lead sentence at the bottom. Then come three columns (each 0.29 panel, at least 21rem): 01 Web, 02 Apps, 03 Robotics.
  - Each column has a big number at the top, the area name in the middle, and at the bottom a one-line description, "Used" tool chips and "Seen in" links. The bottom block has the same height in every column, so the three names line up. Hovering a column turns its number red.
  - Mobile: the intro and then the columns stack.
- Tools come only from the stacks of the projects listed under each area. Nothing is rated. The descriptions are drafts for the user to confirm.
- "Seen in" links go to the case itself. On desktop they scroll into that case's step of the Projects hold, so the case is already open. On mobile they jump to the case, below the sticky top bar.
- No entrance animation yet.

---

# Chapter 04 cases: labelled concepts, slides and screen tabs — 22 November 2026

User decision: merge this session's prototype with the "Shorts Laptop Preview" from another chat. Keep that file's slide visuals, screen tabs and app-to-concept link, but write all content from PROJECT_CONCEPTS.md. Several of that file's details (prefetch at 2 clips, ad as 5th slot, impression after 1 s, `useFeed()`, ~180 ms) are not in the source and were not used.

Each case has three layers:
1. **Glance (left column).** The ticket, then a one-line summary, then "// What's inside" with "Explored n / N". Below that, a labelled list replaces the icon circles. Each row shows its number, title and skill tag (PERF, DATA, UX, BACKEND, …; tag wording is a draft for the user to confirm). A red dot marks rows already opened. The column now starts at 13dvh (11dvh on narrower desktops) and runs down to just above the case buttons.
2. **Concept (left + laptop).** Clicking a row shows its detail (and Learning, where present) and changes the laptop screen.
   - oneD: a node-graph slide per concept, drawn on a fixed 1200 × 750 stage scaled to the screen (`--stage-scale`). The slides sit in a vertical track that glides to the selected one (1 s, cubic-bezier(.72, 0, .18, 1)). Nodes rise in sequence (700 ms, staggered 90 ms), red edges draw in (900 ms, +350 ms), and the title drops in. A pager down the right side shows which slide is shown. The wheel is never captured inside the screen.
   - Update (user decision, 22 Nov): every project now uses slides, 32 in all (oneD 7, ThaiThai 7, Go2 5, LCS 7, Beachboy 6). They replace ThaiThai's phone sketch and the "coming soon" screens. Every label is taken from PROJECT_CONCEPTS.md. LCS slides show only the user's own contributions. Sample values (clip 12, T-01, Lot A) are placeholders. ThaiThai's checkout slide carries the measured result (no lock oversold by 37–40, this one sold exactly 10).
   - When the Beachboy and Go2 photos arrive, the photo + lens design becomes an extra "Photo" tab next to What's inside.
3. **Try it (laptop, oneD only).** Tabs above the laptop read "What's inside | ▶ Preview app", with a red pill that slides between them. They appear only in case mode and only for cases with an example app. While the app is open, its actions report the concept they demonstrate (scroll → shared player, next page → cursor feed, like → optimistic UI, sound → autoplay). The matching row flashes red (900 ms) and the detail reads "Just used · Concept 0n / 07". Clicking any row closes the app and goes back to that row's slide.

On mobile there are no tabs or slides. The case keeps its Preview button, and the list and detail stack as before.

Also fixed: a URL with a hash on load threw before the wheel state existed, which stopped the loader and every scroll effect.

---

# Desktop scroll model follows the reference — 22 November 2026

Observed on the reference (1440×900): the document scrolls vertically (about 11,400 px tall). A GSAP ScrollTrigger pin holds a full-screen row of panels while that scroll moves it with translateX, one to one, and Lenis smooths the scroll. The row stops moving for one viewport of scroll during "THE WORK", where the scroll drives the zoom instead.

Implemented (user decision: switch to the reference's model, without GSAP or Lenis):
- The page scrolls vertically. `.portfolio-viewport` is sticky at the top and clips; `main` and the footer move by a `translate3d()` that motion.jsx writes straight onto them (an inherited `--x` on the viewport re-styled all ~2,500 nodes every frame, about 12 ms). `--dive` is likewise written only onto `.work-title` and `.laptop`, and registered with `@property … inherits: false` so the slides inside the laptop are not re-styled. `body::after` adds `--travel` of height, which is the row's horizontal distance plus the Projects pause. The page scrollbar is hidden so 100vw stays the rail plus one panel.
- Scroll maps to the row one to one, except at Projects, where the row holds still for `(--dive-len + --case-len × cases)` panel widths. The laptop dive and the case steps read their progress from that held stretch, so their timing is unchanged.
- The mouse wheel is still eased (180 ms time constant). Trackpad input, vertical or sideways, moves the page one to one, because the OS has already smoothed it and easing it again made the page lag behind the fingers. A wheel notch is recognized by `wheelDelta` in multiples of 120 or by line/page `deltaMode`. Anything else counts as a trackpad, including free-spinning high-resolution wheels. Space, PageDown, arrow keys, scroll restoration and the Back button now work natively.
- In-page links (Scroll, View projects, menu, Back to home, a hash in the URL on load) go to the panel's place in the row instead of the browser's anchor jump. Each push adds a history entry.
- The page is locked while the loader counts and exits, and while the menu is open.
- Mobile is unchanged: a plain vertical document.

---

# Projects opening grows from zero — 22 November 2026

Following the reference's "THE WORK" opening: the laptop now starts at scale 0, so "Selected Projects" reads as one phrase. Scroll grows it from nothing, and each word stays pinned to the laptop's edge (half the laptop width plus .16em), so the laptop pushes the words apart until they reach the panel edges. The words stay solid until 70% of the dive and fade by 100%, when case mode starts. The dive is longer (1.0 viewport of travel instead of 0.7) so the growth reads slowly. The title is 6.4vw.

---

# Menu toggle, scroll feel and Profile colour — 22 November 2026

- Hamburger (option A, Cross): opening the menu morphs the three lines into an X (outer lines rotate ±45°, middle line shrinks away, 350 ms, cubic-bezier(.65, 0, .35, 1)). The same button closes the menu. The menu is now a non-modal dialog so the rail button stays clickable; the page content is made inert, Tab loops between the button and the menu, Escape closes it and focus returns to the button. The separate close button inside the menu is removed. The rail turns ink while the menu is open. On mobile the top bar is sticky and sits above the menu, which opens below it.
- Wheel smoothing time constant rises from 105 ms to 180 ms, so each wheel step glides further and settles more softly.
- Profile switches to ink so it reads as a different chapter from the paper Home. Section rhythm is now paper, ink, ink, paper, red.
- Profile layout on desktop (user decision: match the reference, centred like it): one block centred in the panel, 46% of the panel wide (at least 34rem, at most 62rem). Label, then the intro across the full block (min(2.15vw, 4.4dvh), max 2.75rem), then two equal halves: the caption at the top and View projects at the bottom of the left half, and the 3:4 portrait filling the right half, sitting on the bottom edge (cropped if the height runs short). Entrance timing is unchanged. A two-column full-height version was tried and rejected.

---

# Loading, Home and Profile polish — 21 November 2026

Batch 1 of a frame-by-frame comparison with the reference at 1440×900 (one frame every 250 ms). The user approved all 12 items.

- The server renders `<html data-opening="loading">`, so the first paint is the ink loader with an ink rail and the Home copy held back; there is no flash of Home before hydration. JS moves through `counting → exiting → revealing` and removes the attribute. Reduced motion removes it at once; CSS failsafes reveal everything after 9 s if JS never runs.
- Loader: digits rise from a mask (700 ms), then count 0→100 over 2.8 s with ease-in-out, hold 450 ms, roll up out of the mask (350 ms), and the ink wipes off bottom-to-top (650 ms, cubic-bezier(.65, 0, .35, 1)). The caption fades in at 250 ms and out on exit. The rail stays ink until the wipe, then fades to paper over 500 ms.
- The counter sits in the same slot and size as the first name line (`--name-size`), so the digits hand over to "Nuttawat" like the reference's year strip hands over to the name.
- Home entrance after the wipe starts: grid hairlines draw down (800 ms, +250 ms), bottom row rises (500 ms, 250 / 320 / 390 ms), "Nuttawat" (750 ms, +500 ms), "Saepan" (+700 ms), sentence (600 ms, +900 ms).
- Home layout: name size `min(panel × .155, 25dvh)` (about 210 px at 1440×900, down from about 278 px). The hero sentence moves to the top of column 3 at about 21 px; Scroll moves to the bottom-right cell.
- Profile enters once when 60% of the panel is in view (25% on mobile): label and intro rise (600–700 ms, intro +100 ms), the portrait reveals bottom-up with a slight scale settle (800 ms, +250 ms), then the caption and View projects link (+550 ms). The caption reuses the existing role line.

---

# Fullscreen navigation — 17 November 2026

User selected concept 1 from the proposed navigation mockups. The user subsequently corrected the origin: on desktop the menu begins at the right boundary of the left sidebar and reveals from left to right across the remaining viewport (600 ms), keeping the rail visible. The panel uses a right-edge clip reveal so it never sweeps across the sidebar. Five masked labels rise from below with 65 ms stagger and a 170 ms initial delay. Closing retracts the panel toward the sidebar. These are implementation timings chosen for this version.

- The desktop rail opens a dark menu covering the content area. Mobile uses a hamburger in the top bar and a left-to-right reveal across the full viewport. Links keep the existing Home / Profile / Projects / Techstack / Contact destinations.
- A native modal dialog provides focus containment, background inertness, Escape dismissal and focus restoration. An explicit close button remains visible in the menu. Selecting a section closes the dialog and follows the section anchor.
- Current hash destination is accented red on opening. Hover / keyboard focus reveals an underline and arrow.
- Reduced motion removes transitions and stagger. Short viewports allow menu scrolling.

---

# Swiss grotesk + laptop dive — 17 November 2026

The user chose direction B (Swiss grotesk) and the laptop-dive Projects section. This supersedes the colour, type and Projects-panel decisions below; Loading timing, horizontal scrolling, smooth wheel and the mobile vertical layout stay as specified.

- Palette: paper `#f1f0eb`, ink `#0e0e0e`, mute `#55554f`, one accent red `#ff3b1f` (name dot, punch hole, counters, Contact panel). The blue-violet theme is retired (kept in `git stash` as "backup: apple-contrast theme…").
- Type: Inter Tight 400/500/600 for everything Latin; IBM Plex Sans Thai for Thai copy.
- Section rhythm: Home paper → Profile paper → Projects ink → Techstack paper → Contact red. Section labels read (01) Quick intro, (02) Selected projects, (03) Tools, (04) Contact.
- Sidebar: follows the theme of the panel that covers the viewport's left edge, fading background and text over 500 ms. This replaces the earlier "dark until Profile fully enters" rule, since Home is now paper.
- Home: name across three ruled columns, red dot after Saepan; bottom row is role / disciplines + Scroll / hero sentence above a hairline. Loading counter is ink with a red %.
- Projects (desktop): a sticky stage inside a track of `panel × (1 + 0.7 + 0.45 × cases)`.
  - Dive (first 0.7 viewport of travel, smoothstep): the laptop grows from 0.2 to full scale between SELECTED and PROJECTS while the words slide out and fade; the laptop screen plays the placeholder montage.
  - Case mode (each further 0.45 viewport = one project): ticket card top-right (name, scope, stack), contributions left, prev / next bottom-left. Switching drops the ticket in (750 ms overshoot), staggers the copy (70 ms), and flashes the screen. Prev on case 1 zooms back out; next on case 5 scrolls to Techstack. Fully reversible because it is driven by scroll position, not a wheel lock.
  - Screen content is a labelled placeholder ("Screen recording coming soon") until real recordings arrive.
- Concepts (user's term, replaces "perks"): each case lists clickable round concept nodes under "// What's inside", inspired by game perk icons. The selected node is a paper disc with a red ring and red number badge. Clicking swaps the detail (Concept NN, title, Thai text; 320 ms rise), sets the laptop screen's `data-demo` state, updates the red chip on the screen, and flashes the screen lightly. Nodes are real buttons with `aria-pressed`; the detail region is `aria-live`.
  - Screens by project: oneD and ThaiThai show small UI mocks whose state follows the concept (oneD: feed, shared player, next clip, like, data panel; ThaiThai: a phone with feed, cache, checkout, pipeline, live, marketplace and editor states). Unitree Go2, LCS and Beachboy show a "Video preview coming soon" panel until the user's AI-generated videos arrive; concepts then get an `at` timestamp so a click seeks the video.
  - Content comes from `PROJECT_CONCEPTS.md` (the user's git-verified notes), rewritten for the page in `app/projects.jsx` without commit hashes, file paths, teammate work or unmeasured numbers. Each concept has a title, a Thai description and, where the notes give one, a Learning line. Precaching the next clip's first segment belongs to ThaiThai, not oneD. LCS is the Tank Depot project; Beachboy is the beach cleaning robot.
  - oneD has a "Preview example app" button. It opens an interactive rebuild on mock data inside the laptop screen (`app/preview.jsx`): a scroll-snap feed with one shared player, only the clips beside it mounted, cursor paging when three clips remain, optimistic likes with a 400 ms debounced sync, and muted autoplay with tap to unmute, plus a live readout of that state. It is not company code. The preview closes on case change, on leaving case mode and on concept clicks; on mobile it scrolls the laptop into view.
  - The ticket shows Scope, Stack and Period. Previous case sits bottom-left, next case bottom-right.
- Projects (mobile): laptop with the montage under the heading, then the tickets, concept nodes and details stacked.
- Reduced motion: no opening, no dive (track has no dive length), cases switch without animation.
- Pending from the user: screen recordings per project, Tank Depot and Beach Robot stack, Beach Robot responsibilities, contact links, case-study content (deferred).

---

# Editorial redesign — 16 November 2026

This specification applies to the editorial redesign. The previous design and reference history follow below.

- Reference observation: the new clip opens with changing year numerals and moves into a large serif name, alternating dark and light sections.
- Loading: roll individual digit wheels from 0% to 100% over 2,800 ms, hold for 450 ms, then move the overlay left on desktop and up on mobile over 460 ms. This is an opening animation.
- Home: reveal the name over 650 ms with a 60 ms offset for the second line. The English summary follows with a 160 ms delay. SOFTWARE ENGINEER is visible as the overlay clears.
- Desktop: Home → Profile → Projects → Techstack → Contact sit side by side in a horizontal viewport. A fixed navigation rail stays on the left. Vertical wheel input moves horizontally once the current panel or project entry reaches its vertical scroll boundary. Trackpad horizontal input and section links use native scrolling. Mobile uses a vertical document.
- Profile: the light panel enters from the right as the horizontal viewport scrolls. The real portrait is derived from Kisra-665.jpg.
- Projects, Techstack, Contact: the Projects heading enters over 400 ms. On desktop the white Selected Work chapter opens into five horizontal dark project panels, followed by the Techstack chapter. On mobile the project entries stack vertically. The Contact heading enters over 300 ms.
- Projects opening: a muted local project-title montage sits between SELECTED and PROJECTS. On desktop it expands over the first 68% of a viewport of horizontal travel, holds full size until 85%, and then scrolls away as the project cards arrive from the right. Mobile uses a video below the heading. Reduced motion uses the poster without a pinned expansion.
- Keyboard focus or Escape skips the opening. Reloads including section hashes play the opening. Reduced-motion preferences bypass it. Mobile uses stacked layouts.

---

# Implementation update — 16 November 2026

This update supersedes unresolved implementation choices below. User requested implementation after the Projects-before-Techstack recommendation.

- Implemented order: Loading → Home → Profile → Projects → Techstack → Contact footer.
- Hero keeps SOFTWARE / ENGINEER readable and stationary as role labels; no rotating role claims.
- Loading: WEB → APPS → ROBOTICS → SOFTWARE, paired with ENGINEER. Final words match Hero before moving to their destinations. Starts: 0 / 1.2 / 2.4 / 3.5 seconds; expansion 4.1s; handoff ends 5.4s. Trial timings.
- Five projects: oneD, ThaiThai, Unitree Go2, Tank Depot, Beach Robotics. Contributions links open in-page details.
- Profile: scroll-driven black frame contraction into portrait, grey background reveal, biography entrance.
- Projects: sticky stage, stacked scaling visuals, blurred matching background, masked vertical copy transitions, reversible scrolling and reading holds.
- Techstack: Flutter, Pinia, ROS 2, Nav2, FAST-LIO, MQTT text marquee with edge fade. Actual logo assets remain needed.
- Responsive layouts and reduced-motion fallback implemented. Reduced motion disables intro/marquee and presents all project text in normal flow.
- Temporary assets: reference portrait and loading media with attribution; CSS concept visuals for projects (explicitly labelled, not product screenshots); abstract stack background. Need user's portrait, project screenshots, contact information, and fuller beach-robot details.
- Validation: production build passed; browser checked loading, profile contraction, forward/reverse project scrolling and stack marquee. No frame-by-frame video comparison or recording completed yet.

The original reference analysis and earlier decision history are retained below; unchecked items are not claims of completed verification.

---

# Portfolio motion specification

สถานะ — เลือกแนวภาพร่างและบทบาท SOFTWARE ENGINEER แล้ว ยังรอปรับจูน word wheel, คำ Loading, ลำดับ section และจำนวน Projects

## ข้อสรุปล่าสุดเรื่องข้อความและภาพร่าง — 15 พฤศจิกายน 2026

ส่วนนี้เป็นข้อกำหนดสำหรับพอร์ตของ Nuttawat และมีลำดับเหนือข้อความตัวอย่างจาก reference ด้านล่าง ข้อมูล timeline ของ reference ยังคงไว้เป็นหลักฐาน ไม่ใช่ข้อความที่จะใช้จริงทั้งหมด

### ผู้ใช้ยืนยันแล้ว

- ใช้แนวจัดวางตามภาพ draft: พื้นดำ ภาพบุคคลขาวดำกลางจอพร้อม distortion แนวตั้ง ตัวอักษรใหญ่ขวาบนและซ้ายล่าง และข้อความย่อยกระจายรอบภาพ
- บทบาทหลักคือ SOFTWARE ENGINEER: SOFTWARE ขวาบน และ ENGINEER ซ้ายล่าง
- ผู้ใช้ไม่ต้องการชู MOBILE DEVELOPER เป็นชื่อตำแหน่งในวงล้อ เพราะไม่ต้องการให้เป็นจุดขายที่คาดหวังความเชี่ยวชาญเชิงลึก
- ยังเล่าประสบการณ์ Flutter / หน้าฝั่งผู้ขาย ThaiThai ในรายละเอียดผลงานได้ โดยระบุเฉพาะส่วนที่รับผิดชอบจริง
- รูปบุคคลใน draft เป็น placeholder ต้องเปลี่ยนเป็นภาพของผู้ใช้ก่อนใช้จริง

### ข้อเสนอที่ยังไม่ได้ยืนยัน

- คงคำ SOFTWARE / ENGINEER ใน Hero และย้ายการสลับคำไป Loading
- ชุดคำ Loading ที่เสนอล่าสุดคือ WEB → APPS → ROBOTICS
- ผู้ใช้เคยเสนอ word wheel สำหรับ Hero แต่ยังไม่ได้ตกลงชุดคำสุดท้ายหรือยืนยันให้เลิกใช้ wheel จึงห้ามถือว่าคำ Hero คงที่เป็นข้อสรุปแล้ว
- ไม่ใส่ FRONTEND / BACKEND / FULL STACK / MOBILE DEVELOPER เป็นชุดตำแหน่งหมุนเวียนโดยอัตโนมัติ
- วิธีเปลี่ยนคำ Loading ไปเป็น SOFTWARE / ENGINEER ตอน handoff ยังต้องออกแบบให้ต่อเนื่อง

### สถานะ implementation

- ภาพ draft และการคุยเรื่อง wording ยังไม่ได้นำไปแก้หน้าเว็บ
- Loading ในโค้ดรอบก่อนยังใช้ BRAND → DIGITAL → MOTION คู่กับ DESIGN เพื่อจูน motion ตาม reference
- การอัปเดตครั้งนี้แก้เอกสารเท่านั้น ไม่ใช่การยืนยันว่า word wheel หรือคำชุดใหม่ implement แล้ว

### รอบจูน Loading วันที่ 15 พฤศจิกายน 2026

- ใช้ BRAND → DIGITAL → MOTION คู่กับ DESIGN ตามคำที่ผู้ใช้ระบุให้จูน
- ตัวอักษรเข้าและออกผ่านกรอบบังแยกตัว พร้อม stagger 28ms และช่วงเข้า 460ms
- เริ่มเปลี่ยนคำที่ 1.5s และ 2.7s พร้อมช่วงเข้า/ออกเหลื่อมกัน
- DESIGN มี entrance ของตัวเอง จากนั้นอยู่ทางขวาระหว่างเปลี่ยนคำซ้าย
- เริ่มขยายเข้า Home ที่ 3.9s และส่งต่อครบประมาณ 5.15s
- ค่า timing เหล่านี้เป็นค่าทดลองสำหรับรอบตรวจ ไม่ใช่ค่าที่ดึงจาก source ของ reference

เอกสารสำหรับปรับจูนก่อน implement อ้างอิงวิดีโอ 5 ไฟล์ที่ผู้ใช้ส่ง วันที่ 15 พฤศจิกายน 2026

## วิธีอ่าน

- เวลาทั้งหมดนับจากต้นไฟล์วิดีโอ เป็นเวลาประมาณจากเฟรมตัวอย่าง ไม่ใช่ duration ที่ยืนยันจาก source code
- ตรวจภาพรวมทุก 0.5 วินาที และช่วง Loading/Hero ทุก 0.2 วินาที ความแม่นยำของขอบเขตช่วงละเอียดประมาณ ±0.2 วินาที
- loading_and_home1 และ loading_and_home2 มี desktop และ OBS อยู่รอบเว็บ วิเคราะห์เฉพาะหน้าต่างเว็บต้นฉบับด้านซ้าย
- ช่วงที่ดูเหมือนตาม scroll ต้องทำเป็น scroll progress เมื่อ implement เวลาที่เห็นในคลิปขึ้นกับความเร็วการเลื่อน
- คลิปไม่ยืนยัน easing function, shader, trigger ที่แท้จริง, breakpoint มือถือ หรือพฤติกรรมทุกสถานะ รายการเทคนิคด้านล่างเป็นแนวทางทำซ้ำ

## ภาพรวม component

| Section | องค์ประกอบภายใน | ลักษณะการเคลื่อนไหว |
|---|---|---|
| Loading | พื้นเทา, คำซ้ายเปลี่ยนได้, DESIGN ทางขวา, ชุดภาพผลงาน, motion clip, ภาพบุคคลสุดท้าย, การกลับสีข้อความ | เล่นตามเวลาหลังเริ่มหน้า |
| Home | ภาพบุคคลเต็ม section, DESIGN ด้านขวาบน, คำหมุนเวียนด้านซ้ายล่าง, ข้อความประกอบ, วงเล็บ, monogram, navigation | ช่วงเข้า + motion ต่อเนื่อง |
| Profile | พื้นเทา, กรอบดำที่หดตัว, ภาพบุคคลแนวตั้ง, ประวัติ, inline links, navigation | transition ตามการเลื่อนที่ต้องยืนยัน trigger |
| Techstack | ภาพพื้นหลังเต็มจอ, หัวข้อสองบรรทัด, แถวโลโก้, ข้อความด้านขวา, CTA, navigation | แถวโลโก้เคลื่อนต่อเนื่อง + section เลื่อนออก |
| Projects | ฉากหลังภาพขยายเบลอ, ภาพหลักด้านซ้าย, ภาพใหม่ซ้อนกลาง, ข้อความด้านขวา, counter, CTA | ภาพขยายซ้อนและข้อความเลื่อนตาม scroll |

## 1. Loading

หลักฐานหลัก loading_and_home1.mp4

### องค์ประกอบ

1. พื้นเทาครอบ viewport
2. แถวข้อความใหญ่อยู่กึ่งกลางแนวตั้ง คำซ้าย BRAND → DIGITAL → MOTION และ DESIGN อยู่ขวา
3. ฟอนต์หนา กว้าง ระยะตัวอักษรแน่น มี glyph ที่ดูสะท้อนกลับด้าน
4. ภาพผลงานขนาดเล็กกว่าข้อความ วางตรงรอยต่อระหว่างสองคำ
5. ภาพหลายชิ้นสลับเร็วในกลุ่ม BRAND และ DIGITAL
6. คลิปวัตถุสามมิติช่วง MOTION
7. ภาพบุคคลพื้นดำเป็นภาพสุดท้าย
8. ข้อความอ่านได้ผ่านพื้นที่ภาพ โดยสีของส่วนที่ทับภาพเปลี่ยนตามภาพด้านล่าง

### Timeline

| เวลาในคลิป | ภาพที่สังเกตได้ | รายละเอียดที่ต้องรักษา |
|---|---|---|
| 0.0–0.8s | Home เดิมก่อน refresh | ช่วงนี้อยู่นอก intro ใหม่ |
| 0.8–1.1s | ภาพเดิมหาย พื้นสว่าง/เทาเข้ามา | สีแฟลชสว่างอาจเป็นการโหลดของเบราว์เซอร์ ไม่ควรบังคับทำจนกว่าจะยืนยัน |
| 1.1–1.5s | BRAND และ DESIGN ประกอบเข้ากลางจอ | เห็นตัวอักษรเป็นชิ้น/ถูกบังบางส่วนก่อนครบคำ |
| 1.5–2.6s | BRAND DESIGN และภาพหลายใบสลับกลางจอ | ภาพเริ่มเล็กแล้วโตขึ้นเล็กน้อย มีทั้งภาพสว่างและมืด ทำให้การกลับสีเห็นชัด |
| 2.6–3.1s | BRAND เปลี่ยนเป็น DIGITAL | ตัวอักษรออกและเข้าไม่พร้อมกัน เห็นชิ้นส่วนคำสองสถานะชั่วครู่ |
| 3.1–3.8s | DIGITAL DESIGN พร้อมภาพ/คลิปผลงาน | หลายภาพต่อหนึ่งคำ จบช่วงด้วยวัตถุสามมิติ |
| 3.8–4.2s | DIGITAL เปลี่ยนเป็น MOTION | ใช้การตัด/เลื่อนส่วนตัวอักษรต่อเนื่องจากรูปแบบเดิม |
| 4.2–4.5s | MOTION DESIGN กับ motion clip | ข้อความและภาพเป็นคนละชั้น สีข้อความเปลี่ยนตามภาพที่ซ้อน |
| 4.5–4.7s | เปลี่ยนมาเป็นภาพบุคคลพื้นดำ | เตรียมใช้ภาพเดียวกันต่อเข้า Hero |
| 4.7–5.4s | กรอบภาพขยายเป็นฉากเต็มจอ | DESIGN ไปขวาบน, MOTION ไปซ้ายล่าง, ข้อความย่อยเริ่มปรากฏ |
| 5.4–6.7s | Hero ทำงานเต็มรูปแบบ | motion ภาพและส่วนประกอบกลางจอเริ่มเด่นขึ้น |

### รายละเอียดสำคัญ

- การกลับสีต้องเกิดตามพิกเซลภาพที่อยู่ใต้ glyph รวมถึงตอนภาพเคลื่อน ไม่ใช่เปลี่ยนสีข้อความทั้งคำพร้อมกัน
- การเปลี่ยนคำควรมี mask/clip และ offset แยกตัวอักษร การแทน textContent ทันทีจะขาดจังหวะนี้
- ต้องมีรายการ media ต่อหมวด แยกจากรายการคำ เพื่อให้หนึ่งคำแสดงได้หลายภาพ
- glyph ที่สะท้อนกลับด้านเห็นในหลายเฟรม แต่คลิปยังไม่ยืนยันว่าทุกตัวต้องหมุนวน 180 องศาตลอดเวลา
- สีเทา ขนาดฟอนต์ ความกว้างคำ และอัตราส่วนภาพเป็นค่าที่ต้องวัดอีกครั้งบน viewport เป้าหมาย

![Loading detail](../output/motion-analysis/loading-detail.jpg)

## 2. Home และการเข้า Home

หลักฐาน loading_and_home2.mp4 ซึ่งเริ่มกลาง Loading

### องค์ประกอบ

- ภาพบุคคลขาวดำพื้นดำ ครอบพื้นที่หลัก
- DESIGN ขวาบน และคำใหญ่ซ้ายล่าง
- ข้อความชื่อ/บทบาทมุมซ้ายบน
- กลุ่ม navigation ด้านบน มีรายการซ้อนหลายบรรทัดและปุ่ม CONTACT ทรงแคปซูล
- คำแนะนำตัวขนาดเล็กด้านซ้าย และข้อความประกอบอีกกลุ่มด้านขวา
- ข้อความกึ่งกลางอยู่ภายในวงเล็บใหญ่
- monogram ใต้ข้อความกลาง
- ข้อความมุมล่างขวา

### Timeline

| เวลาในคลิป 2 | สถานะ |
|---|---|
| 0.0–0.5s | MOTION DESIGN ซ้อน motion clip กลางจอ |
| 0.5–0.7s | ภาพบุคคลเข้ามาในกรอบเดิม |
| 0.7–1.3s | ภาพขยายจากกลางสู่ขอบจอ คำสองฝั่งย้ายออกจากแถวเดียวกัน ระยะห่างแนวตั้งเพิ่มขึ้น |
| 1.1–1.6s | ข้อความประกอบและ navigation ปรากฏระหว่างภาพเข้าเต็มพื้นที่ |
| 1.5–1.9s | ส่วนกลาง/วงเล็บปรากฏครบ ภาพเริ่มมีลายยืดแนวตั้ง |
| 1.9–3.7s | เห็นรูปคนสลับช่วงคมกับช่วงบิดเป็นเส้น โดยศีรษะและแขนมีความแรงต่างกัน |
| 3.8–4.3s | คำซ้ายล่างเริ่มเปลี่ยน MOTION → BRAND |

### รายละเอียดสำคัญ

- ใช้ภาพสุดท้ายของ Loading ต่อเข้าภาพ Hero และรักษาตำแหน่ง crop ระหว่างเปลี่ยนขนาด
- ภาพขยาย คำแยกตำแหน่ง และข้อความย่อยเข้าจอ เป็นหลาย track ที่ซ้อนเวลากัน
- distortion คล้ายการเลื่อนตัวอย่างภาพในแถบแนวตั้ง ความยาวและแรงแตกต่างกันตามตำแหน่ง
- คลิปนี้แสดงการเปลี่ยนคำล่างเพียง MOTION → BRAND รอบครบทั้งหมดต้องยืนยันเพิ่มเติม
- คลิปยังแยกไม่ชัดว่าความแรง distortion มาจากเวลา การเคลื่อนเมาส์ หรือทั้งสองอย่าง
- Cookie consent ที่เห็นใน reference ก่อนหน้านี้เป็น UI แยกจากการเล่าเรื่อง Hero

![Loading to Home](../output/motion-analysis/handoff-detail.jpg)

## 3. Home → Profile

หลักฐาน home_transition_to_profile.mp4

### องค์ประกอบ

- ฉากสีดำขนาดใหญ่
- พื้นเทาที่เผยออกจากขอบ
- กรอบดำกลางจอซึ่งค่อย ๆ เปลี่ยนอัตราส่วนเป็นแนวตั้ง
- ภาพบุคคลแบบ headshot ภายในกรอบปลายทาง
- ประวัติเป็นย่อหน้ายาวพร้อมลิงก์บางคำ
- navigation และโลโก้ยังอยู่ด้านบน พร้อมเปลี่ยนสีให้เข้ากับพื้น

### Timeline

| เวลา | สถานะ |
|---|---|
| 0.0–1.0s | จอส่วนใหญ่เป็นดำ มี navigation ด้านบน คลิปไม่แสดงจังหวะ Hero content ออกจากจอ |
| 1.0–2.0s | พื้นเทาเริ่มโผล่จากขอบ กรอบดำยังเป็นแนวนอนกว้าง |
| 2.0–3.0s | กรอบดำหดเข้ากลางอย่างต่อเนื่อง อัตราส่วนกว้างลดลง |
| 3.0–3.7s | กรอบเข้าใกล้แนวตั้ง ข้อความประวัติเริ่มเข้ามาจากล่าง |
| 3.7–4.3s | ภาพใบหน้าเริ่มปรากฏในกรอบ มีความพร่าหรือบิดช่วงแรก |
| 4.3–5.0s | ภาพคมขึ้น ย่อหน้าอ่านได้ครบมากขึ้น |
| 5.0–6.2s | Profile อยู่ในสภาพอ่านได้ ภาพและย่อหน้ามีการเคลื่อนขึ้นลงเล็กน้อยในคลิป |

### ข้อจำกัดของหลักฐาน

- คลิปเริ่มหลัง Home content หายไปแล้ว จึงยังระบุ exit ของคำใหญ่และ portrait เดิมไม่ได้
- การหดกรอบดูสอดคล้องกับ scroll แต่ไม่มีข้อมูล wheel/scroll position ให้คำนวณระยะ scroll จริง
- ต้องยืนยันว่าต้องการคลิกเมนู Profile แล้วข้าม section ด้วย หรือใช้การ scroll ตามลำดับหน้า
- ภาพ headshot ของ Profile เป็นคนละ composition กับรูปครึ่งตัวใน Hero ต้องเตรียมภาพแยกหรือกำหนด crop

![Profile storyboard](../output/motion-analysis/profile-storyboard.jpg)

## 4. Techstack

ใช้การจัดวางจากส่วน Our Approach To Every Build ใน techstach_section.mp4

### องค์ประกอบ

1. ภาพงานเย็บหนังเต็ม viewport มีมือและด้ายแดงเป็นจุดสนใจ
2. พื้นภาพมืดพอสำหรับข้อความขาว
3. หัวข้อ serif ขนาดใหญ่สองบรรทัด มุมซ้ายบนประมาณ 10% จากขอบซ้าย
4. แถวโลโก้อยู่ใต้หัวข้อ กินพื้นที่ฝั่งซ้ายถึงกลาง
5. ข้อความสั้นด้านขวาช่วงกลางถึงล่าง
6. CTA ใต้ข้อความด้านขวา มีตัวอักษรเล็กและ letter spacing กว้าง
7. โลโก้เว็บกึ่งกลางด้านบน และ NAVIGATE มุมขวาบน
8. เส้นบางใกล้ล่างซ้าย ซึ่งยังยืนยันหน้าที่ไม่ได้จากคลิป

### Timeline

| เวลา | สถานะ |
|---|---|
| 0.0–1.0s | section อยู่เต็มจอ หัวข้อและข้อความนิ่ง โลโก้เริ่มเห็นเคลื่อนซ้าย |
| 1.0–3.0s | โลโก้เดิมเลื่อนออกทางซ้าย โลโก้ชุดถัดไปเข้าจากขวา ความทึบลดลงบริเวณขอบ |
| 3.0–5.0s | การเคลื่อนแถวต่อเนื่อง หัวข้อ CTA และภาพหลักยังอยู่ตำแหน่งเดิม |

### เมื่อนำมาใช้กับพอร์ต

- เปลี่ยนแบรนด์รถเป็นโลโก้เทคโนโลยีที่ผู้ใช้ใช้จริง
- ข้อมูลที่มีรองรับ Flutter, ROS 2, Nav2, FAST-LIO, MQTT และ Pinia ส่วน framework ของเว็บต่าง ๆ ต้องยืนยันก่อนใส่
- หลักฐานแสดงการเคลื่อนของ logo strip ชัดเจน แต่ยังไม่แสดงจุดต่อครบหนึ่งรอบของ marquee
- การหยุดเมื่อ hover, การลากแถว และการกดโลโก้ ยังไม่มีหลักฐานในคลิป
- ภาพพื้นหลังดูแทบคงที่ในช่วงที่ส่งมา จึงยังยืนยันไม่ได้ว่าต้นฉบับใช้ภาพนิ่งหรือวิดีโอ
- ถ้าจะใช้วิดีโอที่สื่อถึง coding/robotics เป็นพื้นหลัง ต้องเลือก composition ที่รองรับข้อความด้านซ้ายด้วย

![Techstack storyboard](../output/motion-analysis/techstack-storyboard.jpg)

## 5. Techstack → Projects และภายใน Projects

หลักฐาน techstack_to_projects.mp4

### องค์ประกอบ

- section เดิมเลื่อนขึ้นและ section ใหม่เข้าจากด้านล่าง
- ฉากหลังภาพขยายและเบลอ พร้อม overlay มืด
- ภาพผลงานคมชัดด้านซ้าย ราว 40% ของความกว้าง viewport และ 65–75% ของความสูงเมื่ออยู่ในสถานะอ่าน
- ข้อมูลด้านขวา ราว 30–35% ของความกว้าง มี counter 01/03, title serif, คำอธิบาย และ CTA
- ภาพรายการใหม่ขนาดเล็กปรากฏกลางภาพเดิมแล้วค่อยขยายคลุม
- ฉากหลังเปลี่ยนให้สัมพันธ์กับรายการใหม่
- navigation ด้านบนยังเห็นระหว่างการเลื่อน

### Timeline

| เวลา | สถานะ |
|---|---|
| 0.0–0.7s | ส่วน Techstack เต็มจอ |
| 0.7–1.7s | Techstack เลื่อนขึ้น ภาพแรกของ Projects เข้าจากขอบล่าง |
| 1.7–2.8s | ภาพแรกชัดขึ้นในพื้นที่หลัก counter 01/03 และ Identity ค่อยปรากฏ ข้อความบางส่วนมีโทนแดง/เทาระหว่าง reveal |
| 2.8–3.7s | รายการแรกอยู่ในสถานะอ่าน มีภาพซ้ายและข้อมูลขวา |
| 3.7–4.5s | ภาพของรายการที่สองเริ่มเป็นกรอบเล็กกลางภาพแรก |
| 4.5–6.5s | ภาพที่สองขยายทับภาพแรก ข้อมูล Identity เลื่อนขึ้นออก และ 02/03 / Insight เข้ามาจากล่าง ฉากหลังค่อยเปลี่ยน |
| 6.5–7.2s | รายการที่สองอยู่ในสถานะอ่าน |
| 7.2–8.0s | ภาพของรายการที่สามเริ่มซ้อนในภาพที่สอง |
| 8.0–9.8s | ภาพที่สามขยาย counter เป็น 03/03 ข้อความ Cohesion เข้ามา ฉากหลังเปลี่ยนตาม |
| 9.8–10.3s | รายการที่สามอยู่ในสถานะอ่าน |
| 10.3–11.1s | section เริ่มเลื่อนออกด้านบน เผย section ถัดไปพื้นดำจากล่าง |
| 11.1–12.5s | มีการเลื่อนย้อนกลับ รายการที่สามกลับมาใน viewport |

### รายละเอียดสำคัญ

- ภาพใหม่ขยายในพื้นที่ภาพเดิม ต้องมีอย่างน้อยสองชั้นภาพระหว่าง transition
- ภาพกับข้อความไม่ได้เคลื่อนแบบเดียวกัน ภาพมีช่วงตรึงตำแหน่งและขยาย ข้อความเดินทางในแนวตั้ง
- ระหว่างภาพใหม่ยังเล็ก ภาพเก่ายังเห็นอยู่รอบขอบ
- ฉากหลังใช้ภาพเดียวกับรายการหรือภาพสัมพันธ์กัน ทำให้การเปลี่ยนรายการเชื่อมทั้ง foreground และ background
- ข้อความ title มีการ reveal แบบค่อยอ่านชัด รวมถึงสีแดง/เทาบางส่วนที่สังเกตเห็น แต่ยังยืนยันกลไก masking ไม่ได้
- คลิปแสดงการย้อน scroll ตรงปลาย section แต่ยังไม่ยืนยันการย้อนทุกขั้น 03 → 02 → 01
- ไม่เห็นการคลิก CTA หรือการเปิดหน้ารายละเอียด จึงต้องกำหนดปลายทางต่างหาก

### เมื่อนำมาใช้กับพอร์ต

เสนอใช้ 3 รายการหลักเป็น oneD, ThaiThai, Tank Depot ตามเนื้อหาที่มี แล้วมี Unitree Go2 และหุ่นยนต์ชายหาดในรายการเพิ่มเติม หรือขยายเป็น 5 รายการตามที่ผู้ใช้เลือก

![Projects storyboard](../output/motion-analysis/projects-storyboard.jpg)

## จุดที่ต้องตัดสินใจก่อน implement

1. ลำดับหน้า — คลิปสนับสนุน Loading → Home → Profile → Techstack → Projects ส่วนรายการผู้ใช้วาง Projects ก่อน Techstack ต้องเลือกว่าจะรักษา transition Techstack → Projects หรือกลับทิศทาง
2. การรักษาความเหมือน — รอบแรกคงคำ BRAND / DIGITAL / MOTION / DESIGN เพื่อเทียบภาพ หรือใช้คำของพอร์ตทันที ความยาวคำมีผลต่อ layout และ mask
3. จำนวน Projects — 3 รายการเด่น หรือทั้ง 5 โปรเจกต์
4. ภาพและวิดีโอ — ใช้ reference media ชั่วคราวเพื่อปรับ motion แล้วเปลี่ยนภายหลัง หรือเตรียมภาพจริงก่อน
5. หน้า Profile — ประวัติที่จะแสดงและรูป headshot
6. เมนู/CTA — ใช้ชื่อเมนูตาม 5 section และ CTA ไปหน้ารายละเอียด, GitHub หรือ Demo
7. มือถือ — ต้องออกแบบใหม่ตามพื้นที่ เช่น ภาพเหนือข้อความ และใช้ motion ที่เหมาะกับการแตะ คลิปทั้งหมดเป็น desktop

## Checklist สำหรับรอบ implement

- [ ] แยกคำ/ภาพของ Loading เป็นข้อมูลคนละชุด
- [ ] มีภาพหลายใบต่อคำและคลิป motion
- [ ] มี word reveal แบบแบ่งชิ้น
- [ ] มีสีข้อความเปลี่ยนเฉพาะบริเวณซ้อนภาพ
- [ ] รูปสุดท้ายต่อเนื่องเข้า Hero โดย crop ไม่กระโดด
- [ ] คำสองฝั่งเคลื่อนออกสู่ตำแหน่งปลายทาง
- [ ] ข้อความย่อยและ navigation มีจังหวะเข้าจอ
- [ ] Home มี distortion ที่รักษารายละเอียดใบหน้าในบางช่วง
- [ ] คำล่างของ Home เปลี่ยนตามลูปที่ตกลง
- [ ] Profile หดกรอบและเปลี่ยนอัตราส่วน พร้อมเผยพื้นเทา
- [ ] Profile แสดง headshot และข้อความตามลำดับ
- [ ] Techstack มี marquee และขอบ fade
- [ ] Techstack → Projects ต่อเนื่องตาม scroll
- [ ] Projects มีภาพเก่า/ใหม่ซ้อนกัน พร้อมฉากหลังเปลี่ยน
- [ ] counter/title/body/CTA เปลี่ยนสัมพันธ์กับภาพ
- [ ] มีช่วงให้อ่านแต่ละ Project
- [ ] ทดสอบ scroll ย้อนและหยุดกลาง transition
- [ ] ทดสอบ refresh, resize, โหลดสื่อช้า/ไม่สำเร็จ, reduced motion และ keyboard
- [ ] ตรวจเปรียบเทียบภาพที่ viewport เดียวกับ reference
- [ ] อัด transition ที่ทำเสร็จเทียบคลิปก่อนส่งรอบตรวจ

## สิ่งที่ยังต้องสังเกตเพิ่ม

- จุดเริ่มและการออกจาก Home ก่อนเฟรมดำในคลิป Profile
- ความสัมพันธ์ของเมาส์กับ distortion
- ลูปคำล่าง Home ครบทุกคำ
- การวน logo marquee ครบหนึ่งรอบ
- trigger และระยะ scroll ของการหดกรอบ Profile และของแต่ละ Project
- hover/focus ของเมนูและปุ่ม CTA
- ทุก section บนมือถือ

รายการเหล่านี้เป็นงานตรวจ reference เพิ่มเติมที่ทำต่อได้ โดยผู้ใช้ไม่จำเป็นต้องอธิบาย motion ทุกเฟรมเอง
