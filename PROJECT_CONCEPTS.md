# Project Concepts — คลังเทคนิคสำหรับพอร์ต

รวม concept / เทคนิคที่ได้เรียนรู้และลงมือทำจริงจากแต่ละโปรเจกต์ ตรวจจาก commit และ `git blame` แล้วว่าเป็นโค้ดที่เขียนเอง
ใช้เป็นวัตถุดิบตอนเขียนหน้า portfolio — **ไม่ใช่ข้อความที่จะเผยแพร่ตรงๆ**

> ⚠️ ทุกโปรเจกต์ในไฟล์นี้เป็นโค้ดของบริษัท: เล่าเป็นแนวคิด / architecture หรือทำ demo เล็กๆ เอง อย่า copy ไฟล์ไปลง
> และอย่าใส่ค่าจาก `.env`, hostname จริง หรือ token ในสิ่งที่เผยแพร่

## สารบัญ

| โปรเจกต์ | Stack | commit ของฉัน / ทั้งหมด | ช่วงเวลา |
|---|---|---|---|
| [oneD (oned-app-tv)](#oned-oned-app-tv) | Nuxt 3, Vue, Pinia, VePlayer | 362 (นับทุก branch) | 2025-09 → 2026-02 |
| [ThaiThai — Flutter](#thaithai--flutter-thaithai-flutter) | Flutter, ChangeNotifier, video_player | 405 / 720 | 2025-12 → 2026-10 |
| [ThaiThai — Backend](#thaithai--backend-thaithai-backend) | NestJS monorepo, TypeORM, PostgreSQL, BullMQ | 161 / 388 | 2026-03 → 2026-10 |
| [Beachboy — Autonomous Robot (beachboy-v2)](#beachboy--autonomous-robot-beachboy-v2) | ROS 2 Humble, Nav2, Python, Arduino C++, MQTT, Webots | 14 / 14 | 2026-10-06 → 2026-10-09 |
| [Go2 Autonomous Navigation](#go2-autonomous-navigation-robot-buddy-workspace) | Python, ROS 2 Foxy, Nav2, FAST-LIO, OpenCV, MQTT | 6 / 6 | 2026-08-25 |
| [LCS — Frontend](#lcs--tank-depot-management-lcs-frontend--lcs-backend) | Nuxt 3, Vue, Nuxt UI, Pinia, Yup | 308 / 1,552 | 2025-02 → 2026-10 |
| [LCS — Backend](#lcs--tank-depot-management-lcs-frontend--lcs-backend) | NestJS, TypeORM, MySQL, ExcelJS | 256 / 1,671 | 2025-03 → 2026-10 |

<!-- เพิ่มโปรเจกต์ใหม่: เพิ่ม 1 แถวในตารางนี้ แล้วคัดลอก "แม่แบบสำหรับโปรเจกต์ใหม่" ท้ายไฟล์ -->

---

## oneD (oned-app-tv)

**Stack:** Nuxt 3, Vue 3, Pinia, Tailwind, VePlayer (BytePlus), Google IMA / GPT ads
**บทบาท:** เขียนฟีเจอร์ Shorts เกือบทั้งหมด — `GlobalShortsPlayer.vue`, `forYou/index.vue`, `[id].vue`, `PlayerShortIMA.vue`, `useDimensions.js`

**ไม่เจอ:** cache (ไม่มี HTTP/API cache) และ preload segment แรกของวิดีโอ — อย่าเคลมสองข้อนี้จากโปรเจกต์นี้ (ของที่ใกล้เคียงจริงคือข้อ 6, 15, 16)

### ประสิทธิภาพวิดีโอ
1. **ใช้ video player ตัวเดียวทั้งฟีด** — ย้าย VePlayer ตัวเดียวไปไว้ในช่องที่กำลังดูด้วย `appendChild` (`movePlayerTo`) ช่องอื่นแสดงแค่ thumbnail · `56caa4e4`, `39e1f23e`
2. **mount เฉพาะตัวที่อยู่ใกล้ (virtualization แบบง่าย)** — `shouldDestroy` เก็บแค่ตัวปัจจุบัน ±1 ที่ไกลกว่านั้นทำลายทิ้ง ทั้ง player และช่องโฆษณา · `a44254b9`
3. **เปลี่ยน source แทนการ mount ใหม่** — `changeSourceFunc` ใช้ `playNext` ข้ามถ้า source เดิม บน Safari ใช้ `src` + `load()` แทน · `b1af62f9`
4. **URL สำรอง** — URL หลักเล่นไม่ได้จะลอง `backupPlayUrls` · `5de2d880`, `3c1a0308`
5. **กันจอกระพริบตอนเปลี่ยนคลิป** — โชว์ poster ค้างไว้จนกว่า player พร้อม · `87784681`, `ad3c917a`, `422b4a0d`
6. **preload โฆษณา** — IMA ใช้ flag `_preloaded` กันโหลดซ้ำ (`67aecb7c`), GPT สร้าง slot ไว้ก่อนตอนใกล้ถึงแล้วค่อยแสดงตอนถึงจริง (`requestAnimationFrame`), event `nearEnd` ยิงก่อนคลิปจบ N วินาที
7. **รับมือกฎ autoplay ของเบราว์เซอร์** — เริ่มแบบปิดเสียง แชร์สถานะเสียงผ่าน `provide`/`inject` และปุ่ม "แตะเพื่อเปิดเสียง" จำค่าใน `localStorage` · `62bc51cd`, `a663652a`
8. **ตรรกะโฆษณา** — แทรกทุก N คลิป, ไม่แสดงให้สมาชิก (`7b1e3274`), รองรับไม่มีโฆษณากลับมา (`685cef62`), ข้ามอัตโนมัติเมื่อหมดเวลา (`14ca316f`, `1fba0d31`)

### การดึงข้อมูล
9. **Infinite scroll แบบ cursor** — โหลดหน้าถัดไปเมื่อเหลืออีก 3–5 คลิป หน้าแรกโหลดเยอะกว่าหน้าถัดๆ ไป
10. **cursor สองทิศทาง + placeholder** — เปิดลิงก์ตรงเข้ากลาง playlist ได้ แล้วเติมข้อมูลตอนเลื่อนขึ้นโดยแทนที่ placeholder ในตำแหน่งเดิม scroll จึงไม่กระโดด · `fd47fbf9`, `setShortsMockSpace` (branch `merge/phase2/following`)
11. **แบ่งหน้าแบบเลขหน้า** สำหรับคลิปของช่อง คำนวณเลขหน้าจากจำนวนที่โหลดแล้ว
12. **ตัดข้อมูลซ้ำโดยยังเรียงลำดับเดิม** ด้วย `new Map()` · `81016fa9`, `1db6b7b5`
13. **กันยิง request ซ้ำ** — `isLoadingMore`, `loadingMore`, `hasMore`
14. **map ข้อมูลให้เหลือแค่ฟิลด์ที่ใช้** และกรองคลิปที่ไม่มี URL หรือไม่มีช่อง · `f25b9bef` [ON-833], `3d1ecdee` [ON-831], `30c9730a`, `02148fe8`
15. **ส่งข้อมูลผ่าน Pinia store** — ลิสต์จากหน้าแรกส่งต่อไปหน้าเล่นคลิปโดยไม่ต้องดึงใหม่, `routeFrom` กำหนดข้อความปุ่มย้อนกลับ (ใกล้เคียง "cache" ที่สุดแบบซื่อตรง)
16. **preview ลิงก์แชร์ฝั่ง server** — `useFetch({server:true})` + `useServerSeoMeta` ตั้ง Open Graph tag

### การโต้ตอบและ UX
17. **Optimistic UI** — ติดตามอัปเดตจอทันทีแล้ว rollback ถ้าล้มเหลว, ไลก์/บุ๊กมาร์ก debounce 400 ms ส่งเฉพาะสถานะสุดท้าย, throttle คลิก 500 ms, ล็อกระหว่างรอ request, ยอดไลก์ไม่ติดลบ · `e68b969c`, `1db6b7b5`, `befbc44d`, `5419e5d8`
18. **ฟีดแบบ scroll-snap** — หาคลิปที่กำลังดูจากตำแหน่ง element บนจอ, เลื่อนเกินบนสุด/ล่างสุดจะย้อนกลับ (`b1742d65`), `history.replaceState` ให้ URL แชร์ได้โดยไม่เปลี่ยนหน้า
19. **seek bar ทำเอง** — ลากได้ทั้งเมาส์และนิ้ว (`c052ec9b`, `84f85609`), ปิด gesture seek บนมือถือ (`f1d08964`)
20. **พฤติกรรมบนมือถือ** — ปิด pull-to-refresh และล็อก scroll ของ body (`41c39b9e`, `63d4fabe`), ปิดคลิกขวา (`bbab6ad0`)
21. **แสดงตัวเลขแบบ TikTok** เช่น 12.3K · `979a62f4`
22. **ย้อนกลับแบบมีทางสำรอง** เมื่อไม่มีประวัติในเบราว์เซอร์ · `a6e427f9`, `c4c38668`
23. **ปุ่มที่ต้องล็อกอินก่อน** เปิด modal ล็อกอิน · `0cc92754`
24. **ไทยและอังกฤษ** ผ่าน i18n

### โครงสร้าง UI layout
25. **composable `useDimensions`** — คำนวณความสูงหลังหักแบนเนอร์, `100dvh`, breakpoint 768/1024 (`e879b94f`), player 9:16 กลางจอ
26. **แยก component** — GlobalShortsPlayer, PlayerShortThumbnail, ShortVideoController, PlayerShortIMA/GPT, ModalPlaylist + Nuxt layout (`short`, `profile` ที่มี Drawer ใน `9dc31670`)
27. **responsive + หน่วยแบบ fluid** (`1db6b7b5`) และ carousel ด้วย Keen Slider

### วิธีทำงาน
28. **mock route และ mock API ระหว่างรอ backend** · `b7b5890b`, `b9e6abbe`
29. **ปล่อยฟีเจอร์ทีละเฟส** — ซ่อนแท็บ Following ตอนทดสอบเฟส 1 แล้วเปิดคืน · `7067e524`, `446c8688`
30. **commit ผูกกับ ticket** (`[ON-xxx]`) และแยก branch ต่อบั๊ก

### เด่นสุดสำหรับพอร์ต
ข้อ 1–2 (player ตัวเดียว + virtualization), 10 (cursor สองทาง + placeholder), 17 (optimistic UI + debounce), 6 (preload โฆษณา), 14 (map ข้อมูล)

### ข้อควรระวัง
- commit `56caa4e4` มี video auth token ฝังอยู่ (หมดอายุไปแล้ว) — อย่าให้ติดในภาพหน้าจอ

---

## ThaiThai — Flutter (thaithai-flutter)

**Stack:** Flutter, `ChangeNotifier` stores, `video_player`, `cached_network_image`, RTMP / HLS, WebSocket, `.arb` i18n
**บทบาท:** ฟีดวิดีโอ, ตัวตัดต่อวิดีโอ, ไลฟ์สตรีม, หน้าคอมเมิร์ซ/affiliate/wallet, ค้นหา

**cache และ preload segment แรก — มีจริง** (ข้อ 1–5)

### ประสิทธิภาพฟีดวิดีโอ (`lib/components/video_player.dart`)
1. **preload ช่วงต้นของคลิปถัดไป** — เตรียม controller ของคลิปถัดไปโดยไม่เล่น ซึ่ง buffer ต้นสตรีมไว้ ปัดแล้วเล่นทันที และเริ่มหลังคลิปปัจจุบันขึ้นเฟรมแรกแล้วเท่านั้น จึงไม่แย่ง bandwidth
2. **debounce การ preload** — timer 400 ms ปัดผ่านหลายคลิปเร็วๆ จะ preload แค่คลิปที่หยุดดูจริง
3. **cache controller พร้อมการคัดทิ้ง** — เก็บ native player ไม่เกิน 3 ตัว ตัวที่ไกลจากคลิปปัจจุบันที่สุดถูก dispose ก่อน
4. **ไม่สร้าง player ซ้ำให้คลิปเดียวกัน** — preload กับการปัดขอคลิปเดียวกันพร้อมกันจะใช้การ setup ร่วมกันครั้งเดียว
5. **อุ่น thumbnail สองระดับ** (`feed_thumbnail_prefetcher.dart`) — ภาพที่จะมาถึงเก็บลงดิสก์, ถอดรหัสเข้า memory แค่ภาพถัดไป, จำ URL สูงสุด 60 รายการ
6. **ความปลอดภัยของ lifecycle** — กัน player setup เสร็จหลังปิดหน้า (กันรั่ว), หยุดเล่นเมื่อแอปไป background, cache รูปแบบย่อขนาด (`memCacheWidth`)

### ข้อมูลและ state
7. **Optimistic UI พร้อม rollback** — `FollowStore`, `LikeStore`, `MallWishlistStore`
8. **singleton แบบ `ChangeNotifier`** — ข้ามการ notify ถ้าค่าไม่เปลี่ยน ไม่ rebuild โดยไม่จำเป็น
9. **Search typeahead** (`features/search`) — debounce 260 ms, ทิ้งผลของคำค้นที่เก่าแล้ว, จำคำค้นล่าสุด
10. **ประวัติแชตไลฟ์แบบ cursor** — เก็บ cursor จาก server ตามที่ได้มา (`live_chat_message_page.dart`) และรวมข้อความใหม่โดยไม่ทิ้งของเดิม
11. **สินค้าที่ดูล่าสุดและตะกร้าฝั่งเครื่อง** ด้วย SharedPreferences

### การอัปโหลด (`video_upload_service.dart`)
12. **ยกเลิกการอัปโหลดได้** — abort request ที่ค้างทั้งหมดเพียงครั้งเดียว
13. **idempotency key + upload session ID** — ลองซ้ำแล้วไม่เกิดวิดีโอซ้ำ

### ไลฟ์สตรีม (`live_create_page.dart` และไฟล์ที่เกี่ยวข้อง)
14. **ถ่ายทอดผ่าน RTMP และเล่นผ่าน HLS** · `d6ebdb7`
15. **heartbeat ทุก 25 วินาที** — ส่งได้ทีละครั้ง และมีงานกวาดฝั่ง backend เป็นด่านสุดท้าย
16. **reconnect และกู้คืน** — reconnect ไม่สำเร็จจะไม่สร้างห้องใหม่และไม่ปิดห้องเดิมโดยไม่ตั้งใจ
17. **หน้าสรุปหลังจบไลฟ์** พร้อมสถิติ (`live_end_page.dart`)

### ฟีเจอร์ที่สร้าง
18. **ตัวตัดต่อวิดีโอ** — filmstrip timeline, เลือกเฟรมหน้าปก, ข้อความซ้อน, transform, preview, export service (~5,000 บรรทัด)
19. **หน้าคอมเมิร์ซ** — PromptPay QR, sheet วิธีจ่ายที่ค้าง, wallet, affiliate (รายได้, แคตตาล็อก, แบรนด์)
20. **UI ค้นหา** — แท็บ, typeahead, หน้าผลลัพธ์
21. **สองภาษา** ผ่าน `.arb`, design-system token, ไอคอน Tabler, build แยก dev/prod ด้วย `--dart-define=ENV`

### งานของเพื่อนร่วมทีม (อย่าใส่ในพอร์ต)
- Mermaid flow diagram และไฟล์ design system `AppTheme` (ส่วนใหญ่เป็นของ Vishal)
- หน้าตะกร้าใน Mall (Vishal และ Sariya)

---

## ThaiThai — Backend (thaithai-backend)

**Stack:** NestJS monorepo, TypeORM, PostgreSQL, BullMQ, `@nestjs/schedule`, WebSocket (`ws`), Bottleneck, AWS S3 / CloudFront
**บทบาท:** cart + checkout, เชื่อม Doovdo (video pipeline), ไลฟ์สตรีม, เชื่อมมาร์เก็ตเพลส, ค้นหา

### ความถูกต้องของ checkout (`checkout.service.ts`, `cart.service.ts` — ของฉันทั้งคู่)
22. **checkout ทั้งหมดอยู่ใน transaction เดียว**
    - idempotency key — กดส่งซ้ำได้ order เดิม
    - เช็กราคากับหน้า preview ถ้าเปลี่ยนตอบ **409**
    - **ล็อกแถวสต็อก** (`pessimistic_write`) กันขายเกิน
    - **จองสต็อกแบบมีเวลาหมดอายุ** แล้วให้งานตามเวลาคืนสต็อก
    - **snapshot ที่อยู่** เก็บไว้กับ order

### Cache และ concurrency
23. **รวม request + cache 5 วินาที** (`live-broadcast-admin.service.ts`) — หลาย request ที่ขอสถิติไลฟ์เดียวกันใช้การเรียก provider ร่วมกันครั้งเดียว (19/23 บรรทัดเป็นของฉัน)
24. **โควตารายวันด้วยการล็อก** (`live-quota-reader.ts`, `creator-live-admin.service.ts`) — SQL query เดียวรวมจำนวนครั้งและชั่วโมงไลฟ์วันนี้, โควตาเฉพาะ creator ยังมีผลแม้ปิดลิมิตส่วนกลาง
25. **จำกัดอัตราเรียก Lazada API** (`lazada.client.ts`) — Bottleneck จำกัด concurrency และโควตา request, ลองใหม่ตาม header `Retry-After`

### Video pipeline (เชื่อม Doovdo — ของฉันทั้งหมด)
26. **อัปโหลดตรงจากแอปไปผู้ให้บริการวิดีโอ** — upload session, endpoint ยกเลิก, เลือกเฟรมหน้าปกจากเวลาที่กำหนด · `4eb49d5`, `ff73b0a`, `ba9c51b`
27. **callback ที่มีลายเซ็นและหมดอายุได้** — ตรวจลายเซ็นก่อนเชื่อ · `a8c045f`
28. **งาน reconciliation** — ทุกนาทีพร้อมสุ่มหน่วงเวลา, ลองใหม่กับงานค้างพร้อมตัวนับ, รับอัปเดตจาก worker / callback / สั่งเอง · `ec8d4a2`
29. **คิว thumbnail ด้วย BullMQ** — ลองใหม่ตามตารางคงที่ 10 วิ, 30 วิ, 1 นาที, 3 นาที, 10 นาที
30. **URL ไฟล์มีเดียแบบ signed / presigned** · `d8c2331`

### Realtime
31. **WebSocket gateway ห้องไลฟ์** — room token ผูกกับจุดประสงค์และห้องนั้นๆ, event แชต / ping / analytics ตอนเข้า-ออก

### เชื่อมมาร์เก็ตเพลส (oms-api)
32. **TikTok Shop, Lazada, Shopee, LINE MyShop** — sync สินค้าสองทาง, push/pull สต็อก, fulfillment
33. **สถานะ order/fulfillment กลางชุดเดียว** แปลงจากสถานะของแต่ละเจ้า · `8854ba3`
34. **cursor pagination, sync แบรนด์รายวัน, โค้ดส่วนลดและโปรโมชัน** · `439cd8a`, `29f1178`

### การออกแบบ API และคุณภาพโค้ด
35. **ล็อกอินแบบไม่บังคับ** (`@OptionalAuth`), ล็อกอิน Google ด้วยการตรวจ ID token, ข้อความ error/validation หลายภาษา
36. **ค้นหาและคำแนะนำ, ค้นหาด้วยแฮชแท็ก**, soft delete สำหรับ variant และสต็อก
37. **unit test ด้วย Jest** — 38 commit แตะไฟล์ test (cart, โควตาไลฟ์, สิทธิ์เข้าถึง, analytics) + regression test มาร์เก็ตเพลส
38. **เขียน API contract เป็นเอกสาร** — `SHORT_VIDEO_COVER_CONTRACT.md`

### งานของเพื่อนร่วมทีม (อย่าใส่ในพอร์ต)
- Redis `CacheService`, งาน recommendation, analytics queue processor (Vishal)

### เด่นสุดสำหรับพอร์ต (ThaiThai ทั้งสองฝั่ง)
1. **ฟีดวิดีโอปัดแล้วเล่นทันที** — Flutter ข้อ 1–5
2. **checkout ที่ขายเกินสต็อกไม่ได้** — ข้อ 22
3. **video pipeline ที่เชื่อถือได้** — ข้อ 26–29
4. **ไลฟ์สตรีมครบวงจร** — RTMP, WebSocket, heartbeat, โควตา (Flutter 14–16, Backend 24, 31)
5. **sync หลายมาร์เก็ตเพลสพร้อม rate limiting** — ข้อ 25, 32–34

---

## Go2 Autonomous Navigation (robot-buddy-workspace)

**Stack:** Python, ROS 2 Foxy, Nav2 / DWB, FAST-LIO, Livox Mid-360, OpenCV / AprilTag, NumPy, MQTT, WebRTC, Bash / colcon
**บทบาทที่มีหลักฐานชัด:** เพิ่ม closed-loop simulator, แก้ navigation config, พัฒนา AprilTag detector, สร้าง MQTT test broker และ deployment / network diagnostic scripts
**ประวัติ:** author `sys20` จำนวน 6 / 6 commits ทุก branch ที่มีในเครื่อง (`master`, `origin/master`) วันที่ 2026-08-25

**ขอบเขตหลักฐาน:** ตรวจ diff และ blame แล้ว ไฟล์หลักเป็น author `sys20` ทั้งหมด แต่ `d9fabb0` เป็น initial import 191 ไฟล์ จึงยืนยันผู้เขียนต้นฉบับของโค้ดเดิมไม่ได้ ทั้ง 6 commits มี Claude เป็น co-author ควรเล่าบทบาทที่ลงมือทำและตรวจสอบผลได้จริง
**ไม่เจอ:** API cache / memoization, preload segment แรกของวิดีโอ, pagination / infinite scroll, optimistic UI / rollback, transaction / idempotency key และ exponential backoff — สิ่งใกล้เคียงคือเก็บ map กับเฟรมล่าสุดใน memory, request guard และ frame sampling

### Simulation และ navigation

1. **Closed-loop simulation** — เพิ่มหุ่นจำลองที่รับ velocity จาก Nav2 แล้วสร้าง pose, odometry, TF และ LaserScan กลับเข้าระบบ เพื่อทดสอบการถึง waypoint และจบ mission; เรียนรู้ feedback loop และ integration testing ของ robotics · `cfc245f`, `Systronic/src/go2_control/go2_control/fake_base.py`
2. **Root-cause debugging ของ Nav2 / DWB** — ไล่อาการหมุนได้แต่เดินหน้าไม่ได้จนพบ kinematic limits ที่ขาด โดยเฉพาะ `max_speed_xy`; เรียนรู้การเชื่อมพฤติกรรม controller กับ configuration และยืนยันผลด้วย goal ใน simulation · `cfc245f`, `Systronic/src/go2_control/config/nav2_livox_go2.yaml`
3. **Occupancy-grid semantics** — แก้ `free_thresh` จาก 0.25 เป็น 0.19 เพื่อรักษาความหมายของพื้นที่ unknown ใน map; เรียนรู้ว่าการแปลงข้อมูลผิดส่งผลต่อพื้นที่ที่ planner ยอมให้เดินผ่าน · `cfc245f`, `Systronic/src/go2_control/map/livox_slam_02loop.yaml`

### Performance และ data handling

4. **NumPy vectorization** — คำนวณ ray casting หลายลำแสงพร้อมกันด้วย array operations เพื่อสร้าง scan; เรียนรู้การลด Python loops ในงานข้อมูลเซนเซอร์ · `cfc245f`, `Systronic/src/go2_control/go2_control/fake_base.py`
5. **Frame sampling** — เรียก AprilTag detector ทุก N เฟรม ค่าเริ่มต้นทุก 3 เฟรม เพื่อลดงานตรวจภาพบนบอร์ดที่ใช้ CPU ร่วมกับระบบอื่น; เรียนรู้การแลกความถี่ประมวลผลกับทรัพยากร โดยยังแปลงภาพก่อนข้ามเฟรม · `dacdc71`, `Systronic/src/go2_control/go2_control/apriltag_detect.py`
6. **Async request guard + service fallback** — ขอ map ผ่าน ROS service เมื่อ topic ยังไม่ส่งข้อมูล ใช้ `map_request_sent` กันคำขอซ้ำระหว่างรอ และเปิดให้ลองใหม่เมื่อ exception; เรียนรู้ async callback และ fallback ระหว่างช่องทางรับข้อมูล · `cfc245f`, `Systronic/src/go2_control/go2_control/fake_base.py`

### Computer vision

7. **AprilTag detection และ geometry contract** — เพิ่ม OpenCV detector ที่รักษาลำดับ corners ให้ตรงกับ `solvePnP` ของ localizer พร้อม camera TF แบบเปิดผ่าน launch argument; เรียนรู้ corner ordering, camera intrinsics และ coordinate transforms ที่มีผลต่อ pose · `dacdc71`, `Systronic/src/go2_control/go2_control/apriltag_detect.py`, `Systronic/src/go2_control/launch/livox_robot.launch.py`

### Realtime และ concurrency

8. **MQTT protocol test fixture** — สร้าง broker สำหรับทดสอบที่รองรับ packet parsing, variable-length encoding และ topic wildcard `+` / `#` แบบ QoS 0; เรียนรู้ publish / subscribe และการสร้างเครื่องมือทดสอบเฉพาะระบบ · `622d517`, `Systronic/src/go2_control/test/mini_mqtt_broker.py`
9. **Thread synchronization + cleanup** — ป้องกัน shared subscription state ด้วย `threading.Lock` แล้วเก็บรายชื่อผู้รับก่อนออกจาก lock ไปส่งข้อมูล พร้อมลบ subscription และปิด socket ใน `finally`; เรียนรู้การดูแล shared state และ connection lifecycle · `622d517`, `Systronic/src/go2_control/test/mini_mqtt_broker.py`

### Deployment และ workflow

10. **SSH / rsync deployment + colcon** — เพิ่มสคริปต์ sync package, แยกโหมด sync / build และตรวจ dependency ที่ยังขาด ใช้ `--symlink-install` ลดการ rebuild ระหว่างแก้ Python; เรียนรู้ deployment workflow สำหรับ ROS workspace · `bb5af52`, `Systronic/scripts/deploy_to_board.sh`
11. **DDS / network diagnostics** — เพิ่มเครื่องมือตรวจ ROS domain, RMW, interface binding และ connectivity เพื่อจำกัดสาเหตุเมื่อค้นหา node ไม่เจอ; เรียนรู้การไล่ปัญหาระบบกระจายจาก network ไปถึง middleware · `dacdc71`, `Systronic/scripts/check_robot_link.sh`

### ส่วนใน initial import ที่ต้องยืนยันบทบาทก่อนใช้เป็นผลงานหลัก

- **Layered watchdog** — มี command timeout และ sensor freshness gate ใช้ monotonic time วัด timeout; เรียนรู้ clock dependency และ safe defaults · `d9fabb0`, `Systronic/src/go2_control/go2_control/sensor_watchdog.py`, `Systronic/src/go2_control/go2_control/cmd_vel_node.py`
- **Odometry adaptation** — แปลง pose จาก TF เป็น odometry, ประมาณ velocity จาก pose difference และทำ exponential smoothing · `d9fabb0`, `Systronic/src/go2_control/go2_control/lio_odom_relay.py`
- **Robot / ground-station split** — แยก sensor processing ฝั่งหุ่นออกจาก localization / planning ฝั่ง ground station เพื่อจำกัด point cloud บนเครือข่าย · `d9fabb0`, `Systronic/src/go2_control/launch/livox_robot.launch.py`, `Systronic/src/go2_control/launch/livox_ground.launch.py`
- **WebRTC signaling + lifecycle** — มี SDP offer / answer ผ่าน WebSocket และปิด peer connection เมื่อ client หลุด · `d9fabb0`, `Systronic/src/go2_control/go2_control/Stream.py`

### งานของเพื่อนร่วมทีม (อย่าใส่ในพอร์ต)

- ไม่พบ author คนอื่นในประวัติที่มี จึงระบุผลงานเพื่อนร่วมทีมรายบุคคลไม่ได้ และ initial import ไม่ได้ยืนยันผู้เขียนต้นฉบับ
- FAST-LIO, Nav2, Livox driver, Unitree SDK และ TurtleBot3 เป็น upstream; อ้างบทบาท integrate / configure / patch ตามส่วนที่ทำจริง

### เด่นสุดสำหรับพอร์ต

1. **Closed-loop Simulation** — จำลอง feedback จากหุ่นเพื่อทดสอบ mission สอง waypoint
2. **Navigation Debugging** — วิเคราะห์และแก้ DWB ที่สั่งหมุนแต่ไม่เดินหน้า
3. **AprilTag Detection** — เชื่อม computer vision กับ ROS messages และ camera TF
4. **MQTT Mission Testing** — สร้าง test broker พร้อม protocol parsing และ concurrency handling
5. **Deployment Automation** — ทำ workflow ส่ง package และ build บนบอร์ด พร้อม network diagnostics

ใช้ 5 ข้อนี้เป็น concept cards ได้ โดยแต่ละการ์ดแสดงชื่อสั้น, สิ่งที่ทำ, learning และภาพ flow ที่สัมพันธ์กับโค้ดจริง

### ข้อควรระวัง

- ผลทดสอบตามบันทึกคือ goal สำเร็จและ mission สอง waypoint ถึงครบใน simulation; ยังรอยืนยัน real movement SDK, photo upload, aarch64 build และ idle Wi-Fi baseline ครั้งที่วิเคราะห์อ่านโค้ดและประวัติเท่านั้น · `Systronic/src/go2_control/LIVOX_PREP_DAY_2026-08-25.md`
- `deploy_to_board.sh --dry-run` ยังเรียก SSH สร้าง directory จึงมี side effect และไม่ควรอ้างว่าไม่เปลี่ยนอะไรเลย
- ตรวจสิทธิ์โค้ดบริษัท / NDA ก่อนเผยแพร่ ใช้แนวคิดหรือ demo ที่สร้างเอง และปิดข้อมูลสถานที่จาก map / network config
- ไม่พบ credential patterns ต้องสงสัยใน source history ที่ค้น แต่ข้ามไฟล์ `.env`, ไฟล์ชื่อสื่อถึง secret และ archive จึงยังรับรองว่าไม่มี secret ทั้ง repository ไม่ได้

---

## Beachboy — Autonomous Robot (beachboy-v2)

**Stack:** ROS 2 Humble, Nav2, Python, Shapely, robot_localization / EKF, MQTT (Paho / Mosquitto), Arduino C++, Webots; เว็บในประวัติใช้ Vue 3, Pinia, Vuetify, Vite
**บทบาท:** พัฒนาระบบควบคุมและนำทางหุ่นยนต์ทำความสะอาดชายหาด ตั้งแต่ firmware / driver, localization, coverage planning, mission / safety จนถึงการเชื่อมเว็บและ simulator
**ประวัติ:** 14 / 14 commit ทุก branch ที่มีในเครื่อง ผู้ใช้ยืนยันว่า `nuttawat saepan` และ `Pong7th` เป็นตนเอง ตรวจ diff และ blame ของไฟล์หลักประกอบแล้ว

**ไม่เจอ:** preload segment แรกของวิดีโอ, infinite scroll / pagination, virtualization, optimistic UI + rollback และ request coalescing จากส่วนที่ตรวจ ไม่ควรเคลมจากโปรเจกต์นี้ ส่วน cache ที่พบจริงคือ TF lookup cache และ request-result cache (ข้อ 7, 10)

### การวางเส้นทางและระบุตำแหน่ง
1. **Coverage path planning** — สร้างแถววิ่งจาก polygon หดขอบตาม margin ตัด exclusion zones และหมุนแนวตาม bearing ได้เรียนรู้ polygon operations และการสร้าง waypoint เพื่อครอบคลุมพื้นที่ทำงาน · `512b143`, `ros2_ws/src/beachboy_mission/beachboy_mission/coverage.py`
2. **Coordinate transformation และ antenna compensation** — แปลง GNSS เป็น local ENU และใช้ TF ชดเชยระยะเสาอากาศเทียบกับตัวรถ ได้เรียนรู้การจัด coordinate frames ให้ข้อมูล sensor อ้างอิงตำแหน่งเดียวกัน · `512b143`, `ros2_ws/src/beachboy_gnss/beachboy_gnss/gnss_odom.py`
3. **GNSS / wheel odometry และ EKF integration** — เชื่อมข้อมูลตำแหน่ง ทิศทาง และ odometry เข้ากับ localization stack ได้เรียนรู้การแยก frame map / odom และการใช้ข้อมูลหลายแหล่งสำหรับ navigation · `7f27500`, `512b143`
4. **ROS 2 / Nav2 action integration** — ส่ง navigation goals และรับผลผ่าน asynchronous callbacks แล้วเชื่อมคำสั่งความเร็วไปยัง motor bridge ได้เรียนรู้การต่อ mission ระดับสูงเข้ากับระบบขับเคลื่อน · `256c682`, `512b143`, `ros2_ws/src/beachboy_mission/beachboy_mission/mission_executor.py`

### Embedded และ safety
5. **Command watchdog และ PWM ramp** — Firmware ตั้งเป้าหมายมอเตอร์เป็นศูนย์เมื่อขาดคำสั่งที่ถูกต้องเกิน 300 ms พร้อมจำกัดอัตราเปลี่ยน PWM และอ่าน encoder ผ่าน interrupt ได้เรียนรู้การควบคุมมอเตอร์เมื่อคำสั่งขาดหายและการลดการกระชาก · `5c98af9`, `firmware/beachboy_mcu/beachboy_mcu.ino`
6. **Safety monitor และ motion interlock** — ตรวจ RTK, sensor timeout, geofence และกรณีสั่งมอเตอร์แล้วล้อไม่หมุน เพื่อตัดสินใจ pause / cancel / lock ได้เรียนรู้การออกแบบเงื่อนไขหยุดและปลดล็อกก่อนกลับมาเคลื่อนที่ · `512b143`, `ros2_ws/src/beachboy_mission/beachboy_mission/safety_monitor.py`

### ข้อมูลและ asynchronous correctness
7. **Idempotency ด้วย plan ID และ payload hash** — เก็บคำตอบตาม `plan_id` กับ SHA-256 fingerprint คำขอเดิมซ้ำได้คำตอบเดิม ส่วน ID เดิมที่เปลี่ยน payload ถูกปฏิเสธ ได้เรียนรู้ request deduplication ภายใน session ของ executor · `c70070e`, `ros2_ws/src/beachboy_mission/beachboy_mission/web_route.py`
8. **Stale-response guard และ cancellation ownership** — ใช้ sequence / epoch กัน callback ของ navigation goal เก่ามาเปลี่ยนสถานะปัจจุบัน และติดตาม action จนจบจริงก่อนรับแผนใหม่ ได้เรียนรู้ race conditions ระหว่างส่ง goal, pause, stop และ cancel · `c70070e`, `ros2_ws/src/beachboy_mission/beachboy_mission/route_runner.py`
9. **Route validation และ resource limits** — ตรวจ finite numbers, segment continuity, จำนวนจุด, ขอบเขตพื้นที่และ footprint clearance พร้อมจำกัดขนาด occupancy grid ได้เรียนรู้การตรวจคำขอก่อนนำไปใช้ควบคุมรถ · `c70070e`, `ros2_ws/src/beachboy_mission/beachboy_mission/web_route.py`

### Performance และ resource lifecycle
10. **Cache ค่าคงที่จาก TF** — เก็บ antenna lever arm ใน dictionary หลัง lookup สำเร็จ เพื่อลดการ lookup ซ้ำเมื่อรับ GNSS ครั้งถัดไป ได้เรียนรู้การ cache ข้อมูล geometry ที่คงที่ตาม URDF · `ros2_ws/src/beachboy_gnss/beachboy_gnss/gnss_odom.py`, `GnssOdom.lever_arm()`
11. **Timer / event cleanup ในปุ่มบังคับรถ** — ส่งคำสั่งซ้ำทุก 200 ms ระหว่างกด จัดการปล่อยปุ่มนอกพื้นที่หรือเสีย focus และล้าง timer / listeners เมื่อ unmount ได้เรียนรู้ lifecycle cleanup ควบคู่กับพฤติกรรมการหยุดรถ · `4c0b078`, `web/src/components/Pad.vue` (ไฟล์ในประวัติ)

### Realtime และ UX
12. **MQTT reconnect และ retained-command protection** — ตั้ง reconnect delay ส่ง retained state กลับหลังเชื่อมต่อใหม่ และกรอง retained mission commands ได้เรียนรู้การแยกสถานะที่ต้องกู้คืนกับคำสั่งที่มีผลต่อการเคลื่อนที่ · `256c682`, `c70070e`, `ros2_ws/src/beachboy_mission/beachboy_mission/mqtt_bridge.py`
13. **Change-based publishing** — เทียบ safety status กับค่าที่เคยส่งและตรวจเวลาที่ผ่านไปก่อนส่งซ้ำ ได้เรียนรู้การลดข้อความสถานะซ้ำโดยส่งเมื่อสถานะเปลี่ยน · `512b143`, `ros2_ws/src/beachboy_mission/beachboy_mission/mqtt_bridge.py`
14. **Mission state machine** — จัดสถานะ idle / planned / running / paused พร้อมตรวจ safety ก่อน start / resume ได้เรียนรู้ state transitions และเงื่อนไขอนุญาตคำสั่งจากเว็บ · `512b143`, `c70070e`, `ros2_ws/src/beachboy_mission/beachboy_mission/mission_executor.py`
15. **Coverage control component** — ทำ panel ตั้งพื้นที่, spacing, margin, bearing, preview และ start / pause / resume / stop ผ่าน MQTT ได้เรียนรู้การเชื่อม UI กับสถานะภารกิจของหุ่นยนต์ · `99781f0`, `web/src/components/CoveragePanel.vue` (ไฟล์ในประวัติ)

### Simulation และการทดสอบ
16. **Device-level mocks ผ่าน pseudo-terminal** — จำลอง MCU และ UM982 ด้วย serial protocol ที่ driver ใช้งานจริง ได้เรียนรู้การทดสอบระบบส่วนบนผ่าน interface ของอุปกรณ์ก่อนมีฮาร์ดแวร์ · `256c682`, `7f27500`, `ros2_ws/src/beachboy_sim/beachboy_sim/sim_robot.py`
17. **Webots และ simulation clock** — เชื่อม wheel motors, encoder, LiDAR และ `/clock` เข้ากับ ROS ได้เรียนรู้การใช้ physics simulator ร่วมกับ driver และ navigation stack · `c70070e`, `ros2_ws/src/beachboy_sim/webots/controllers/beachboy/beachboy.py`
18. **Regression tests และ fault injection** — เขียน tests สำหรับ route validation, duplicate requests และ retained commands พร้อม scenario RTK หลุด, สิ่งกีดขวาง และมอเตอร์ไม่ตอบสนอง ได้เรียนรู้การตรวจทั้ง happy path และ failure / recovery paths · `c70070e`, `ros2_ws/src/beachboy_mission/test/test_web_route.py`, `docs/TEST_REPORT.md`

### งานของเพื่อนร่วมทีม (อย่าใส่ในพอร์ต)
- ไม่มีรายการที่ต้องแยกตามสองชื่อ author ข้างต้น ตามที่ผู้ใช้ยืนยันว่าเป็นคนเดียวกัน
- เว็บบางส่วนถูกนำมาจาก v1 ตามประวัติ commit ควรระบุงานต่อยอดและ integration ตามขอบเขตที่ทำจริง

### เด่นสุดสำหรับพอร์ต
1. **Coverage Path Planning** — เปลี่ยนพื้นที่บนแผนที่เป็นเส้นทางทำงาน พร้อม margin และ exclusion zones (ข้อ 1)
2. **GNSS & Sensor Fusion** — เชื่อมพิกัด, TF และ odometry สำหรับ localization (ข้อ 2–3)
3. **Safety Watchdog** — watchdog, PWM ramp และ motion interlock เมื่อระบบผิดปกติ (ข้อ 5–6)
4. **Async Result Guard** — กัน callback เก่าและจัดการ cancellation ของ Nav2 (ข้อ 8)
5. **Simulation & Fault Injection** — device mocks, Webots และ scenario ทดสอบความผิดปกติ (ข้อ 16–18)

### ข้อควรระวัง
- ผลในรายงานเป็น simulation: รายงานบันทึก 90 tests ผ่าน และ kinematic coverage scenario พื้นที่ 8 × 6 m ได้ coverage 89% โดยไม่ชนในเคสนั้น ยังไม่มีผลภาคสนามในหลักฐานที่ตรวจ และครั้งนี้ไม่ได้รัน tests ใหม่
- โฟลเดอร์ `web/` ถูกลบใน `d570367` หลักฐาน UI จึงอ้างอิง revision ก่อนหน้า ส่วนไฟล์ที่ยังไม่ commit ไม่ได้นับรวมในการยืนยันผลงานจาก Git
- package ระบุ license เป็น Proprietary ตรวจสิทธิ์บริษัท / NDA ก่อนเผยแพร่ source code หรือภาพระบบ
- ไม่ได้เปิด `.env` หรือไฟล์ secret การตรวจนี้ยังไม่ยืนยันว่า commit history ทั้งหมดปลอด secret

---

## LCS — Tank Depot Management (lcs-frontend + lcs-backend)

**Stack:** Frontend: Nuxt 3, Vue, Nuxt UI, Tailwind, Pinia, Yup · Backend: NestJS, TypeScript, TypeORM, MySQL, ExcelJS
**บทบาท:** พัฒนาและปรับปรุง workflow ใบประเมินค่าซ่อม (Estimate), ใบแจ้งหนี้ (Invoice), การเบิกคืนอะไหล่ และรายงาน — เป็น contribution ร่วมกับทีม ไม่ใช่ผู้สร้างระบบทั้งหมด
**Commit:** รวมสองอีเมลของฉัน: Frontend 308 / 1,552 และ Backend 256 / 1,671 รวม 564 / 3,223 (รวม merge); เมื่อตัด merge ออกเป็น 230 / 1,099 และ 186 / 1,121 ตามลำดับ
**ขอบเขตหลักฐาน:** ตรวจทุก branch/ref ที่มีในเครื่อง ณ วันที่ 17 พ.ย. 2026; FE branch `fix-vuln`, BE branch `bugfix/sparepart-export` ไม่ได้ยืนยันว่าโค้ดทุก commit ขึ้น production แล้ว อ้างอิงเฉพาะ committed code ไม่รวมไฟล์ที่ยังแก้ค้าง

**ไม่เจอในงานที่ยืนยันว่าเป็นของฉัน:** application cache/memoization, preload segment วิดีโอ, explicit lazy loading/prefetch, virtualization, cursor pagination/infinite scroll, stale-response guard, optimistic UI พร้อม rollback, skeleton, i18n, idempotency key, queue/backoff, rate limiting, WebSocket, signed URL/HMAC และ automated tests/migrations ที่ฉันเขียน
สิ่งที่ใกล้เคียงจริงคือ debounce, page pagination, transaction rollback และการตรวจสถานะก่อนทำรายการ ซึ่งไม่ใช่เทคนิคเดียวกับรายการข้างต้น ส่วน profile request coalescing มีในโปรเจกต์ แต่เป็นงานทีม

### Performance และ resource lifecycle
1. **Debounced search** — รอ 250 ms หลังเปลี่ยนตัวกรองก่อนเรียกค้นหา ยกเลิก timer เดิมและล้าง timer เมื่อปิด modal ลดการเรียก API ระหว่างปรับตัวกรอง · FE `662b8ac`, `components/InvoiceModal.vue`
   - **Learning:** Vue watchers, async scheduling และ timer cleanup; debounce ไม่ได้ป้องกัน response เก่าเขียนทับ response ใหม่
2. **Debounced form validation** — ใช้ `nextTick()` รอ reactive state อัปเดตก่อนเรียก validation และรวมการตรวจที่เกิดติดกันด้วย debounce · FE `2b620d0`, `pages/estimate/[id].vue`
   - **Learning:** จังหวะอัปเดต state กับการตรวจฟอร์ม และการลดงานซ้ำ; ไม่ควรอ้างว่าปัญหา validation ทุกกรณีถูกแก้แล้ว
3. **Image processing integration + object URL cleanup** — เชื่อม helper resize รูปเข้ากับ upload workflow ก่อนสร้าง preview และ revoke object URL หลังอ่านขนาดรูปสำเร็จ · FE `06fd47b`, `components/upload.vue`
   - **Learning:** FileReader, image dimensions, async file processing และ resource cleanup; helper resize หลักเป็นของทีม ไม่ได้เขียน image compression algorithm เอง
4. **Parallel report generation** — สร้าง Excel แยกลูกค้าด้วย `Promise.all()` แล้วรวม ZIP แบบ `compression: 'STORE'` · BE `6127872`, `src/modules/report/report.service.ts`
   - **Learning:** การรวมผล async หลายงาน และ trade-off ระหว่าง CPU ที่ใช้บีบอัด ขนาดไฟล์ และ memory; ไม่มี benchmark ยืนยันเปอร์เซ็นต์ความเร็ว

### Data handling และการเลือกข้อมูล
5. **Persistent selection across pages** — แยก selected IDs ออกจากข้อมูลหน้าปัจจุบัน คืนสถานะ checkbox เมื่อเปลี่ยนหน้า และให้เลือกทั้งหมดเฉพาะรายการที่เลือกได้ในหน้านั้น · FE `662b8ac`, `components/InvoiceModal.vue`
   - **Learning:** แยก selection state ออกจาก presentation data และออกแบบการเลือก/ยกเลิกเลือกข้ามหน้า
6. **Deduplication + ID normalization** — ใช้ `Set` กรองตัวเลือกซ้ำ และ normalize customer ID ก่อนเปรียบเทียบ ลดปัญหา string/number ต่างชนิดกัน · FE `662b8ac`, `components/InvoiceModal.vue`
   - **Learning:** Stable identity, unique collections และการ normalize ข้อมูลจาก API
7. **Explicit payload mapping** — เลือก field ที่ API ต้องการด้วย allowlist แทนส่ง reactive state ทั้งก้อน พร้อมจัดรูป array และค่าวันที่ว่าง · FE `7bcbd5c`, `pages/estimate/[id].vue`
   - **Learning:** แยก UI state ออกจาก request payload และกำหนดขอบเขตข้อมูลก่อนส่ง API; ไม่ใช่ตัวแทนของ validation ฝั่ง server
8. **Customer-aware invoice listing** — ปรับ backend ให้แยกแทงก์ตาม customer และใช้กติกาประเภท invoice ของลูกค้านั้น ก่อนแบ่งหน้าผลลัพธ์ · BE `1cc8eb3`, `src/modules/invoice/invoice.service.ts`
   - **Learning:** Grouping ด้วย Map และ business-specific filtering; pagination ส่วนนี้ใช้ `.slice()` หลังโหลดข้อมูล จึงไม่ควรเคลมว่าเป็น DB pagination สำหรับข้อมูลขนาดใหญ่

### UX และ form workflow
9. **Customer-constrained selection** — ล็อกการเลือกแทงก์ให้อยู่ใน customer เดียวกัน ปิด checkbox ที่เลือกไม่ได้ และ reset selection เมื่อเปลี่ยนลูกค้า · FE `662b8ac`, `components/InvoiceModal.vue`
   - **Learning:** ออกแบบ UI ให้สะท้อน business constraints และดูแล state ที่สัมพันธ์กัน; ไม่ใช่การรับประกันความถูกต้องฝั่ง server
10. **Conditional validation + date masking** — บังคับวันตัดยอดตามประเภท invoice และเคยเพิ่ม mask `DD/MM/YYYY` พร้อมข้อความเตือนรูปแบบวันที่ · FE `662b8ac`, `751192a`, `components/InvoiceModal.vue`, `components/InputDatepicker.vue`
    - **Learning:** Yup conditional validation, input masking และการแสดงข้อผิดพลาด; datepicker ยืนยันจาก blame ณ commit เก่า เพราะเวอร์ชันปัจจุบันถูกทีมเขียนทับแล้ว
11. **Bulk edit + unsaved-change confirmation** — สร้าง Apply modal ที่ส่งเฉพาะ field ที่เลือก และเพิ่มคำเตือนก่อนสร้าง event เมื่อ estimate มีการเปลี่ยนแปลงที่ยังไม่บันทึก · FE `d414da5`, `6c32264`, `components/ApplyModal.vue`, `components/EventsModal.vue`
    - **Learning:** Props/emits, modal state, reset lifecycle และการขอให้ผู้ใช้ยืนยันก่อนทำขั้นตอนที่กระทบข้อมูล

### Backend correctness และข้อมูลย้อนหลัง
12. **Transactional estimate–event workflow** — เชื่อม cleaning/LOLO event กับ estimate item ภายใน transaction ตรวจว่า event ถูกออก invoice หรือผูก estimate แล้วหรือไม่ พร้อม commit/rollback/release · BE `ebde036`, `src/modules/estimate/estimate.service.ts`
    - **Learning:** Atomic workflow, transaction-scoped repositories และ business-rule validation; การตรวจสถานะนี้ยังไม่ใช่ idempotency key หรือหลักฐานว่าปลอด race condition ทุกกรณี
13. **Lot-based withdrawal + return validation** — ปรับการเบิกให้ตัดจำนวนจาก lot ตามลำดับเวลา เก็บ withdrawal log เชื่อม estimate item และตรวจจำนวนคืนเทียบยอดเบิก/คืนของ issue · BE `05ed1da`, `cf2e78c`, `src/modules/spare-part/spare-part.service.ts`
    - **Learning:** การจัดสรรจำนวนข้ามหลาย lot, inventory balances และความสัมพันธ์ของ transaction data; เป็นการต่อยอดระบบคลังของทีม
14. **Monthly snapshot + historical reporting** — เพิ่ม entity ยอด lot รายเดือนและปรับรายงานย้อนหลังให้ใช้ยอดปลายงวด แทนเอายอดคงเหลือปัจจุบันไปคำนวณเดือนเก่า · BE `8105204`, `3c28781`, `src/modules/spare-part/entities/spare-part-lot-monthly.entity.ts`, `src/modules/report/report.service.ts`
    - **Learning:** Current state เทียบกับ historical snapshot, ยอดยกมา/ยกไป และ reporting period; ไม่ได้หมายความว่าเขียน cron snapshot ทั้งระบบเอง
15. **Temporal data mapping** — เลือกข้อมูลผู้ขายจาก lot/transaction ที่เกี่ยวข้อง และเลือก lot ล่าสุดที่ไม่เกินวันสิ้นงวด โดยใช้ ID ตัดสินเมื่อเวลาเท่ากัน · BE `78bae20`, `src/modules/report/report.service.ts`
    - **Learning:** Cutoff time, deterministic tie-breaking และการไม่ใช้ master data ปัจจุบันแทนข้อเท็จจริงในอดีต
16. **Decimal columns + TypeORM transformer** — เปลี่ยนราคา `int` เป็น `decimal` พร้อม precision/scale และแปลงค่าที่อ่านจากฐานข้อมูล · BE `023a2bf`, `src/modules/spare-part/entities/spare-part-lot-monthly.entity.ts`
    - **Learning:** Database numeric types กับการแปลงค่าระหว่าง DB/TypeScript; commit อยู่ใน `origin/bugfix/sparepart-export` แต่ยังไม่อยู่ใน HEAD ที่ตรวจ และการใช้ `parseFloat` ไม่ใช่ exact decimal arithmetic ตลอดระบบ

### Architecture และวิธีทำงาน
17. **Reusable components + Pinia modal state** — สร้าง modal store สำหรับข้อความส่วนกลาง และแยก Apply/Event workflow เป็น components ที่รับ props และส่ง events · FE `07c02d2`, `d414da5`, `2fda6bb`, `stores/modalStore.js`, `components/EventsModal.vue`
    - **Learning:** Shared state เทียบกับ local state และขอบเขตความรับผิดชอบของ component
18. **Refresh-token integration + session validation** — ปรับ API client ให้ refresh แล้วลอง request เดิมใหม่ ล้าง session เมื่อ refresh ไม่สำเร็จ และเพิ่ม profile validation ก่อนเข้า dashboard พร้อมปรับ endpoint backend ให้สอดคล้องกัน · FE `3c33710`, `4a66e39`; BE `25c1e2f`, `composables/api.ts`, `middleware/auth.global.ts`, `src/modules/auth/auth.controller.ts`
    - **Learning:** Authentication lifecycle และการเชื่อม frontend/backend; ใช้คำว่า “ปรับปรุง auth flow” ไม่ใช่เขียนระบบ JWT/auth ทั้งหมดเอง
19. **Dependency version pinning** — ล็อก Yup เป็น `1.6.1` แบบ exact version · FE `3d54f7a`, `package.json`
    - **Learning:** ผลของ version range และความต่างระหว่าง manifest/lockfile/เวอร์ชันที่ติดตั้ง; commit นี้ไม่ใช่หลักฐานว่า Yup เป็น root cause ของปัญหา production

### งานของเพื่อนร่วมทีม (อย่าใส่ในพอร์ตเป็นผู้เขียนเอง)
- **Profile request coalescing / in-flight guard** — `profileSyncPromise`, `runProfileSync`, `isProfileSyncLoading` เป็นงาน Pichetkunakorn · FE `7d02d2e`, `middleware/auth.global.ts`; แยกจาก `syncProfile` และ clear session ที่ฉันเพิ่ม
- **Loading store และตัวนับ active requests** — store เดิมเป็นงาน Thanapob และตัวนับหลาย request เป็นงาน Pichetkunakorn · FE `3221abe`, `7d02d2e`, `stores/loadingStore.js`
- **Canvas resize helper หลัก** — เป็นงาน Kasem/author ที่เกี่ยวข้อง ฉันเชื่อมเข้ากับ upload component · FE `5bda80d`, `44f5826`, `plugins/global-function.js`
- **Running-number transaction/row lock เดิม** — ส่วนหลักเป็นงาน jeeraprapa และ Tee; ฉันปรับ query กรณีไม่ reset โดยคง `pessimistic_write` ใน BE `5d34c37` จึงเล่าได้แค่ว่าต่อยอด query บนระบบที่ใช้ row lock · `src/modules/running-number/running-number.service.ts`
- **Cron, migration และ auth test scaffold ที่ตรวจ** — เป็นงาน Tee/jeeraprapa ไม่พบ automated test หรือ migration ที่ฉันเขียนในเส้นทางที่ค้น · BE `1a990e6`, `6489d34`, `3541f9f`

### เด่นสุดสำหรับพอร์ต
1. **Invoice selection workflow** — ข้อ 1, 5, 6, 8, 9: debounce + เลือกข้ามหน้า + จำกัด customer
2. **Estimate–event transaction** — ข้อ 12: เชื่อมค่าล้าง/ค่ายกกับใบประเมิน พร้อมตรวจ business rules
3. **Lot-based inventory** — ข้อ 13: ตัดหลาย lot และตรวจยอดคืน
4. **Historical reporting** — ข้อ 14–16: snapshot รายเดือน, ข้อมูลตามงวด และชนิดข้อมูลราคา
5. **Excel/ZIP reporting** — ข้อ 4: สร้างรายงานแยกลูกค้าด้วย async orchestration

### ไอเดีย 7 concept cards สำหรับหน้า portfolio
ใช้แต่ละใบเป็น “ชื่อสั้น → คำอธิบาย → Learning → ภาพจำลอง” โดยทำภาพจากข้อมูลสมมติ ไม่ใช้ข้อมูลลูกค้าจริง

| Card title | คำอธิบายสั้นบน UI | Learning | ภาพจำลอง |
|---|---|---|---|
| Debounced Search | ค้นหาเมื่อผู้ใช้หยุดปรับตัวกรอง | Watchers, timers, cleanup | พิมพ์หลายครั้ง → reset timer → request |
| Persistent Selection | เปลี่ยนหน้าแล้วรายการที่เลือกยังอยู่ | State separation, Set, identity | เลือกหน้า 1 → หน้า 2 → กลับมาแล้วยังเลือกอยู่ |
| Conditional Forms | ฟอร์มปรับตามกติกาของงาน | Yup, reactive state, validation | เลือกประเภท invoice → วันตัดยอดเป็น required |
| Transactional Workflow | บันทึกข้อมูลที่สัมพันธ์กันใน transaction | Commit, rollback, business rules | ตรวจ event → สร้าง item → เชื่อมข้อมูล → commit/rollback |
| Lot-based Inventory | เบิกอะไหล่ข้ามหลาย lot | Quantity allocation, inventory logs | ขอ 8 ชิ้น → lot A 5 + lot B 3 |
| Historical Reporting | รายงานอ้างอิงข้อมูลของงวดนั้น | Snapshot, cutoff, temporal mapping | snapshot เดือนก่อน → รายการใหม่ → รายงานย้อนหลังใช้ snapshot |
| Parallel Report Export | สร้าง Excel แยกลูกค้าแล้วรวม ZIP | Promise.all, ExcelJS, compression trade-off | ลูกค้า A/B/C → Excel แยก → ZIP |

### ข้อควรระวัง
- โค้ดบริษัท/NDA: เล่าเฉพาะ contribution ของฉัน ใช้ภาพจำลองและข้อมูลสมมติ ไม่เผยแพร่ชื่อ/อีเมลลูกค้า เลขแทงก์ ราคา หรือเอกสารจริง
- ไม่มี benchmark ยืนยัน performance และไม่ได้ทดสอบ runtime ใหม่ในการตรวจครั้งนี้ อย่าใส่ตัวเลขความเร็ว/ประสิทธิภาพที่ไม่ได้วัด
- ไม่เปิด `.env` หรือไฟล์ secret และไม่ได้ทำ secret scan ทั้ง repo; พบประวัติแก้ `.env.example` เช่น FE `3e7671a`, `ad848cd` และ BE `25c1e2f`, `c25c5b8`, `5059d7d` แต่ไม่ได้อ่านเนื้อหา จึงยังไม่ยืนยันว่ามี secret — ควรตรวจภายในก่อนเผยแพร่ repository/history
- หลักฐานข้าม branch หรือโค้ดเก่าที่ถูกเขียนทับยังใช้เล่าการเรียนรู้ได้ แต่ไม่ควรอ้างว่าเป็น implementation ปัจจุบันหรือ production โดยไม่ตรวจเพิ่ม

---

## แม่แบบสำหรับโปรเจกต์ใหม่

<!-- คัดลอกส่วนนี้ไปวางเหนือ "แม่แบบสำหรับโปรเจกต์ใหม่" แล้วเติมข้อมูล -->

```markdown
## <ชื่อโปรเจกต์> (<ชื่อ repo>)

**Stack:** 
**บทบาท:** 

**ไม่เจอ:** <concept ที่หาไม่เจอ — ถ้ามี>

### <หมวด เช่น Performance>
1. **<ชื่อ concept>** — <ทำอะไร ทำไม 1–2 ประโยค> · `<commit>`, `<ไฟล์>`

### งานของเพื่อนร่วมทีม (อย่าใส่ในพอร์ต)
- 

### เด่นสุดสำหรับพอร์ต
1. 

### ข้อควรระวัง
- 
```

## Prompt สำหรับวิเคราะห์โปรเจกต์ใหม่

เปิดเซสชันใหม่ในโฟลเดอร์ของโปรเจกต์นั้น แก้ 3 บรรทัดบนสุด แล้ววาง

```text
โปรเจกต์: <path ของโปรเจกต์ เช่น C:\dev\my-project>
ชื่อ author ของฉันใน git: <เช่น nuttawat, Nuttawat Saepan>
อีเมลที่ใช้ commit: <เช่น อีเมลบริษัท, อีเมลส่วนตัว>

ช่วยวิเคราะห์ commit ของฉันในโปรเจกต์นี้ แล้วสรุปเป็นลิสต์ "concept / เทคนิคที่ฉันได้เรียนรู้และลงมือทำจริง" เพื่อเอาไปใส่ portfolio

ขั้นตอน:
1. ดูภาพรวมก่อน: README, CLAUDE.md/AGENTS.md, docs, โครงสร้างโฟลเดอร์, dependencies (package.json / pubspec.yaml ฯลฯ) และ branch ปัจจุบัน
2. นับ commit ทั้งหมดเทียบกับของฉัน (git shortlog -sne --all) และดู commit ของฉันทุก branch (git log --all --no-merges --author=...) จัดกลุ่มตาม scope/feature
3. ค้นหาเทคนิคใน diff ของฉันด้วย git log -E -G"<regex>" ครอบคลุมอย่างน้อย:
   - performance: cache, memoize, preload/prefetch (โดยเฉพาะ preload segment แรกของวิดีโอ), lazy load, virtualization/windowing, debounce/throttle, dispose/cleanup, memory leak
   - data: cursor/page pagination, infinite scroll, dedupe, data mapping/normalization, request guard (in-flight lock), stale-response guard, request coalescing
   - UX: optimistic UI + rollback, skeleton/placeholder, gesture, scroll-snap, autoplay policy, i18n
   - backend: transaction, row lock, idempotency key, snapshot, queue/retry/backoff, cron, rate limit, websocket, signed URL/HMAC, migration, test
   - architecture: state management, component split, layout/responsive, design tokens, env config, mock API, feature flag
   และเพิ่มคำค้นที่เหมาะกับ stack ของโปรเจกต์นี้เอง
4. เปิดอ่าน diff หรือโค้ดจริงของ commit สำคัญ เพื่อยืนยันว่าเทคนิคนั้นมีจริงและทำงานยังไง ไม่ใช่แค่ชื่อ commit ตรงคำค้น
5. ใช้ git blame กับไฟล์หลักทุกไฟล์ที่จะยกมาเป็นหลักฐาน เพื่อยืนยันว่าโค้ดส่วนนั้นฉันเขียนเอง ถ้าส่วนใหญ่เป็นของคนอื่นให้แยกไว้ใน "งานของเพื่อนร่วมทีม" ห้ามใส่ปนในลิสต์ของฉัน
6. ห้ามแก้ไข, commit, push หรือ checkout อะไรในโปรเจกต์ ทำแค่อ่าน
7. ห้ามเปิดอ่านไฟล์ .env หรือไฟล์ที่มี secret

รูปแบบคำตอบ: ใช้หัวข้อตาม "แม่แบบสำหรับโปรเจกต์ใหม่" ในไฟล์ C:\dev\dev-career\portfolio\PROJECT_CONCEPTS.md (ภาษาไทย ศัพท์เทคนิคใช้อังกฤษได้)
- บรรทัดแรกบอกจำนวน commit ของฉันเทียบกับทั้งหมด และ stack ของโปรเจกต์
- concept ที่หาไม่เจอ (เช่น cache, preload segment แรก) ให้บอกตรงๆ อย่าเดา และบอกสิ่งที่ใกล้เคียงที่สุดแบบซื่อตรง
- แต่ละข้อ: ชื่อ concept ตัวหนา + อธิบาย 1–2 ประโยค + หลักฐาน (commit hash และ/หรือ path ไฟล์)
- ปิดท้ายด้วยข้อควรระวังเรื่องโค้ดบริษัท/NDA และ secret ที่อาจหลุดใน commit (บอก hash ได้ แต่ห้ามพิมพ์ค่า secret)
```
