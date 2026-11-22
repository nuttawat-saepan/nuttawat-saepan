# Projects opening grows from zero — 22 November 2026

Following the reference's "THE WORK" opening: the laptop now starts at scale 0, so "Selected Projects" reads as one phrase. Scroll grows it from nothing, and each word stays pinned to the laptop's edge (half the laptop width plus .16em), so the laptop pushes the words apart until they reach the panel edges. The words stay solid until 70% of the dive and fade by 100%, when case mode starts. The dive is longer (1.0 viewport of travel instead of 0.7) so the growth reads slowly. The title is 6.4vw.

---

# Menu toggle, scroll feel and Profile colour — 22 November 2026

- Hamburger (option A, Cross): opening the menu morphs the three lines into an X (outer lines rotate ±45°, middle line shrinks away, 350 ms, cubic-bezier(.65, 0, .35, 1)). The same button closes the menu. The menu is now a non-modal dialog so the rail button stays clickable; the page content is made inert, Tab loops between the button and the menu, Escape closes it and focus returns to the button. The separate close button inside the menu is removed. The rail turns ink while the menu is open. On mobile the top bar is sticky and sits above the menu, which opens below it.
- Wheel smoothing time constant rises from 105 ms to 180 ms, so each wheel step glides further and settles more softly.
- Profile switches to ink so it reads as a different chapter from the paper Home. Section rhythm is now paper, ink, ink, paper, red.
- Profile layout on desktop: the reference's indented copy column with a small portrait left large screens half empty, so Profile is now two columns centred as one composition (max 128rem, 8% panel padding on both sides). The copy column holds the label at the top, the intro centred vertically (up to 30em wide, min(2.4vw, 4.6dvh), max 2.9rem), and the caption and View projects link at the bottom. The portrait spans the full panel height on the right (min(34vw, the content height at 3:4)). Entrance timing is unchanged.

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
