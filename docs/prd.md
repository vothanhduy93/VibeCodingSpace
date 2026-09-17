# VibeSpace — Product Requirements Document (PRD)

| **Document Version** | **1.2.0** |
| :--- | :--- |
| **Status** | Approved / Phase 2 Complete ➔ Entering Phase 3 (Design on Google Stitch) |
| **Governance Model** | **Standard 6-Phase SDLC (ISO/IEC 12207 & Agile Stage-Gate Framework)** |
| **Target Release** | V1.0.0 MVP (Zero-Setup Focus Workspace) |
| **Repository Scope** | Client-Side SPA (Local-First) |
| **Lead Roles** | Principal Project Manager & Lead Business Analyst (15+ Years Exp) |
| **Last Updated** | 2026-09-16 |

---

## 1. Executive Summary (Tóm tắt điều hành)

### 1.1. Bối cảnh & Cơ hội thị trường (Problem Statement)
Trong kỷ nguyên làm việc từ xa và học tập trực tuyến, sự phân tâm kỹ thuật số (digital distraction) từ mạng xã hội, thông báo email và giao diện ứng dụng phức tạp đã làm suy giảm nghiêm trọng trạng thái tập trung sâu (Deep Work / Flow State). Các công cụ hiện nay thường gặp phải các vấn đề:
1. **Rào cản gia nhập cao (High Friction):** Yêu cầu đăng ký tài khoản, xác thực email, trả phí định kỳ hoặc thiết lập cấu hình rườm rà trước khi có thể bắt đầu phiên học/làm việc.
2. **Giao diện phân mảnh (Fragmented Experience):** Người dùng phải mở đồng thời 3-5 tab trình duyệt: 1 tab phát YouTube Lofi, 1 tab nghe tiếng mưa, 1 web Pomodoro timer, 1 app Todo list. Điều này làm ngốn RAM, gây xao nhãng và phá vỡ sự liền mạch.
3. **Thẩm mỹ công nghiệp thô cứng (Lack of Aesthetic Immersion):** Thiếu đi cảm giác dễ chịu, thư giãn thị giác và âm thanh được đồng bộ hóa.

### 1.2. Tầm nhìn sản phẩm (Product Vision)
**VibeSpace** là một không gian làm việc số (digital workspace) cá nhân hóa, tối giản và mang tính thẩm mỹ cao, hoạt động theo mô hình **Zero-Setup & Local-First**. Người dùng chỉ cần mở trình duyệt là ngay lập tức bước vào một không gian làm việc tĩnh lặng (Zen environment) tích hợp sẵn:
- Đồng hồ Pomodoro chính tâm.
- Trình phát YouTube Lofi dạng kép (Compact Audio & Floating Video).
- Bộ trộn âm thanh nền Ambient White Noise với cơ chế bù âm không ngắt quãng (Gapless Loop) và các Preset phối sẵn.
- Bộ sưu tập hình nền và video nền thư giãn Glassmorphism tùy biến.
- Danh sách công việc hàng ngày (Daily Todo List) với cơ chế tự động chuyển việc dang dở (Smart Rollover) theo múi giờ địa phương.

---

## 2. Standard 6-Phase SDLC Governance & Role Matrix

Dự án VibeSpace tuân thủ nghiêm ngặt **Quy trình Phát triển Phần mềm Chuẩn 6 Giai đoạn (SDLC)**. Tại mỗi giai đoạn, AI Agent và Người dùng đóng vai trò chuyên trách để đảm bảo chất lượng cao nhất:

```
[ GIAI ĐOẠN 1: PLANNING & FEASIBILITY ]
                  │ (Gate 1: Project Scope Sign-off)
                  ▼
[ GIAI ĐOẠN 2: REQUIREMENTS & ARCHITECTURE ] ── (Hiện tại: ĐÃ HOÀN TẤT)
                  │ (Gate 2: PRD & Architecture Sign-off)
                  ▼
[ GIAI ĐOẠN 3: UI/UX DESIGN & PROTOTYPING ]  ── (BẮT ĐẦU: Anh thiết kế trên Google Stitch)
                  │ (Gate 3: Stitch Mockups & Tokens Sign-off)
                  ▼
[ GIAI ĐOẠN 4: IMPLEMENTATION & CODING ]
                  │ (Gate 4: Feature-Complete Sprint Review)
                  ▼
[ GIAI ĐOẠN 5: TESTING & QUALITY ASSURANCE ]
                  │ (Gate 5: QA Quality Gate & Pixel Parity Pass)
                  ▼
[ GIAI ĐOẠN 6: DEPLOYMENT, CI/CD & MAINTENANCE ]
                  │ (Gate 6: Production Launch Sign-off)
                  ▼
             [ LIVE V1.0.0 ]
```

### Bảng Phân công Trách nhiệm & Vai trò (Role Responsibility Matrix)

| Giai đoạn SDLC | Vai trò của Anh (User) | Vai trò của Em (AI Agent) | Sản phẩm đầu ra (Deliverables) |
| :--- | :--- | :--- | :--- |
| **1. Planning & Feasibility** | Product Owner (PO) / Stakeholder định hình tầm nhìn, mục tiêu và giới hạn phạm vi. | **Principal Project Manager**: Khảo sát, phỏng vấn (/grill-me), đánh giá khả thi kỹ thuật và lập kế hoạch tổng thể. | Project Scope, Feasibility Analysis, WBS sơ bộ. |
| **2. Requirements & Architecture** | Thẩm định và ký duyệt yêu cầu nghiệp vụ và cấu trúc kỹ thuật. | **Lead Business Analyst & System Architect**: Soạn thảo PRD chi tiết, thiết kế Web Audio Graph, Data Schema, NFRs. | `prd.md` (v1.2), `architecture.md` (v1.2), `plan.md` (v1.2). |
| **3. UI/UX Design & Prototyping** | **Lead UI/UX Designer trực tiếp thiết kế trên Google Stitch**. | **UI/UX Consultant & Design System Specifier**: Cung cấp prompt mẫu, cấu trúc Design MD, schema tokens và review đối soát giao diện. | 8 Màn hình trên Google Stitch (`SCR-01` đến `SCR-08`), `design.md`, `tokens.json`. |
| **4. Implementation & Coding** | Product Owner theo dõi tiến độ từng Sprint và nghiệm thu tính năng. | **Senior Frontend & Audio Engineer**: Hiện thực hóa mã nguồn (React 19 + TypeScript + Tailwind + Web Audio) bám sát 100% bản vẽ Stitch. | Source code sạch trong `src/`, Unit tests, Zero compilation warnings. |
| **5. Testing & QA** | Tham gia User Acceptance Testing (UAT), trải nghiệm thực tế. | **QA/QC Lead & Performance Auditor**: Kiểm thử E2E Playwright, đo đạc 8 thuộc tính vi mô, Pixel Heatmap, kiểm tra Gapless loop và rò rỉ RAM. | QA Test Report, Pixel Parity Audit, Lighthouse score $\ge 95$. |
| **6. Deployment & Maintenance** | Phê duyệt bản phát hành chính thức (Production Go-Live). | **DevOps & Release Engineer**: Đóng gói production build, cấu hình CI/CD, PWA Service Worker, tài liệu hướng dẫn vận hành. | Production Build, CI/CD Pipeline, Vercel/Cloudflare deploy, Release Notes. |

---

## 3. Product Principles (Nguyên tắc định hình sản phẩm)

1. **Instant Gratification (Trải nghiệm tức thì - Zero-Setup):**
   - Tuyệt đối không có màn hình đăng ký/đăng nhập (No Auth Gate).
   - Thời gian từ khi nhập URL đến khi sẵn sàng bắt đầu phiên làm việc $\le 1.5$ giây.
2. **Aesthetic Excellence & Visual Serenity (Thẩm mỹ đỉnh cao):**
   - Ngôn ngữ thiết kế: **Glassmorphism cao cấp** (nền kính mờ frosted-glass, viền sáng tinh tế 1px, shadow dịu nhẹ, chuyển động vi mô micro-interactions 60fps).
   - Thiết kế trực quan trên **Google Stitch** do Anh trực tiếp thực hiện, Agent bảo đảm tính khả thi kỹ thuật và token hóa chuẩn xác.
   - Tương phản đạt chuẩn WCAG AA trên mọi nền sáng/tối.
3. **Local-First & Privacy Sovereign (Bảo mật cục bộ tuyệt đối):**
   - 100% dữ liệu (Todo items, tùy chỉnh âm lượng, danh sách phát, cấu hình thời gian Pomodoro) được lưu trữ trong `localStorage` của trình duyệt.
   - Không theo dõi cookie, không thu thập telemetry xâm lấn, không phụ thuộc máy chủ backend để lưu trạng thái.
4. **Radical Minimalism & Zen Focus (Tối giản triệt để):**
   - Không gian trung tâm chỉ dành cho sự tập trung: Đồng hồ Pomodoro tối giản.
   - Cơ chế **Auto-Hide thông minh**: Mọi thanh điều khiển và FABs tự động mờ dần sau 5 giây người dùng không tương tác chuột, trả lại toàn bộ màn hình cho thị giác và âm thanh.

---

## 4. User Personas & User Journeys

### 4.1. Chân dung người dùng mục tiêu

#### Persona A: Minh Nhật (21 tuổi - Sinh viên Đại học / Đang ôn thi chứng chỉ)
- **Hành vi:** Cần học tập liên tục từ 4 - 8 tiếng mỗi ngày tại nhà hoặc thư viện. Dễ bị xao nhãng bởi thông báo điện thoại và YouTube recommendations.
- **Nỗi đau (Pain Points):** Mở YouTube nghe nhạc lofi thì bị gợi ý video giải trí lôi cuốn; không theo dõi được thời gian học và nghỉ hợp lý; các app pomodoro khác đòi hỏi đăng ký rườm rà.
- **Mục tiêu tại VibeSpace:** Mở web lên là học ngay, bật preset "Mưa trong quán cà phê", cài Pomodoro 50/10, ghi 3 đầu việc ôn thi cần hoàn thành trong ngày.

#### Persona B: Sarah Linh (28 tuổi - Senior UI/UX Designer & Remote Writer)
- **Hành vi:** Làm việc tự do tại nhà, cần không gian thẩm mỹ cao để khơi gợi cảm hứng sáng tạo và duy trì trạng thái Flow State.
- **Nỗi đau:** Nhạy cảm với tiếng ồn xung quanh; yêu cầu giao diện làm việc phải đẹp mắt, không thô kệch; thích nghe tiếng lofi kết hợp tiếng sóng biển hoặc tiếng gõ phím nhẹ.
- **Mục tiêu tại VibeSpace:** Chỉnh background theo vibe căn phòng cozy ban đêm, mix tiếng lửa trại 40% + sóng biển 30% + YouTube Chillhop, bật chế độ Zen toàn màn hình.

---

## 5. UI/UX Specifications for Google Stitch Design (Giai đoạn 3)

Trong Giai đoạn 3, anh sẽ thực hiện thiết kế trên **Google Stitch**. Dưới đây là đặc tả chi tiết 8 màn hình để làm cơ sở thiết kế:

| Mã màn hình | Tên màn hình / Trạng thái | Yêu cầu nghiệp vụ & Thành phần bắt buộc |
| :--- | :--- | :--- |
| **SCR-01** | **Zen Desktop Canvas (Default Idle)** | Background thiên nhiên HD, TopBar giờ/ngày, Đồng hồ Pomodoro chính tâm (digits 80px), Bottom Floating Dock với 4 FABs tròn kính mờ. |
| **SCR-02** | **Pomodoro Timer Active States** | Vòng tròn tiến trình SVG phát sáng neon, nút Play/Pause lớn, nút Reset/Skip, 4 session dots đánh dấu chu kỳ, nhãn trạng thái (Focus / Break). |
| **SCR-03** | **YouTube Lofi Dual-Mode Player** | (1) Thanh Audio Pill gọn gàng kèm animation sóng âm, và (2) Cửa sổ nổi Mini-Video 16:9 bo góc mạ kính mờ có nút thu nhỏ/kéo thả. |
| **SCR-04** | **Ambient Sound Mixer Drawer** | Panel trượt Glassmorphism hiển thị 5 thanh trượt âm lượng độc lập (Mưa, Lửa trại, Gió rừng, Sóng biển, Quán cafe), Master Mute và các nút Presets. |
| **SCR-05** | **Daily Todo List Drawer** | Input thêm việc nhanh (Enter-to-add), checklist công việc bo tròn, hiệu ứng gạch ngang strikethrough mượt, nút xem Archive. |
| **SCR-06** | **Background & Filter Switcher** | Lưới ảnh thumbnail chọn hình nền/video nền, thanh trượt Dark Overlay (0-90%) và Blur Filter (0-20px). |
| **SCR-07** | **Keyboard Shortcuts Modal** | Bảng tra cứu phím tắt nổi giữa màn hình với các phím bấm kính mờ (`Space`, `M`, `F`, `T`, `S`, `P`, `?`). |
| **SCR-08** | **Mobile Responsive Viewport (390x844)** | Bố cục dọc cho điện thoại: Đồng hồ Pomodoro tối ưu tỷ lệ, các drawer chuyển thành Bottom Sheet vuốt chạm mượt mà. |

---

## 6. Detailed Functional Specifications (Đặc tả chi tiết tính năng)

```
+------------------------------------------------------------------------------------+
|                                    VibeSpace                                       |
|                                                                                    |
|   [Top Left: Brand/Clock]                                    [Top Right: Shortcuts]|
|                                                                                    |
|                                                                                    |
|                               +-------------------+                                |
|                               |     POMODORO      |                                |
|                               |       25:00       |                                |
|                               |  [Focus Session]  |                                |
|                               | [▶ Start] [↺ Res] |                                |
|                               +-------------------+                                |
|                                                                                    |
|                                                                                    |
|   [Bottom Floating Dock: Glassmorphism FABs]                                       |
|   [ 🎵 Lofi Player ]  [ 🎧 Sound Mixer ]  [ 📝 Todo List ]  [ 🖼️ Background ]   [⛶]|
+------------------------------------------------------------------------------------+
```

### Module 1: Zen Focus Canvas & Auto-Hide Engine
- **ID:** `FS-01`
- **Mô tả:** Hệ thống quản trị hiển thị tập trung và tự động ẩn các thành phần gây xao nhãng khi người dùng đang tập trung.
- **Chi tiết hành vi:**
  1. **Idle Detection:** Thiết lập đồng hồ đếm thời gian không hoạt động (Inactivity Timer). Khi không có tương tác chuột (`mousemove`, `mousedown`, `keydown`, `touchstart`) trong vòng **5.0 giây**, toàn bộ các nút bấm FABs, dock điều khiển và header mờ dần (`opacity: 0; pointer-events: none; transition: opacity 0.8s ease-in-out`).
  2. **Wake-up Event:** Bất kỳ chuyển động chuột hoặc phím bấm nào sẽ lập tức đánh thức giao diện (`opacity: 1; pointer-events: auto; transition: opacity 0.2s ease-out`).
  3. **Zen Mode Toggle (Hotkey `F`):** Người dùng có thể nhấn phím `F` hoặc click icon Fullscreen ở góc màn hình để chuyển đổi trạng thái Toàn màn hình (Browser Fullscreen API) và ép ẩn hoàn toàn các thanh công cụ phụ.
  4. **Active Panel Immunity:** Khi bất kỳ panel nào (Todo, Mixer, Music, Background) đang được mở (Open state), tính năng Auto-Hide tạm thời bị vô hiệu hóa để người dùng không bị gián đoạn thao tác nhập liệu/chọn nhạc.

---

### Module 2: Pomodoro Engine & Timer State Machine
- **ID:** `FS-02`
- **Mô tả:** Bộ máy đếm ngược chu kỳ tập trung chuẩn Pomodoro Technique, đóng vai trò trung tâm thị giác.
- **State Machine (Các trạng thái):**
  - `IDLE`: Đồng hồ ở trạng thái sẵn sàng, hiển thị thời gian ban đầu của chu kỳ.
  - `RUNNING`: Đang đếm ngược từng giây.
  - `PAUSED`: Tạm dừng đếm, lưu giữ số giây còn lại.
  - `COMPLETED`: Đạt mốc `00:00`, kích hoạt chuỗi báo hiệu âm thanh/thị giác.
- **Các chu kỳ hoạt động (Interval Modes):**
  - **Focus Session:** Mặc định `25 phút` (cho phép tùy chỉnh từ 1 - 90 phút).
  - **Short Break:** Mặc định `5 phút` (cho phép tùy chỉnh từ 1 - 30 phút).
  - **Long Break:** Mặc định `15 phút` (cho phép tùy chỉnh từ 1 - 45 phút).
  - **Long Break Interval:** Tự động kích hoạt Long Break sau mỗi `4 phiên Focus` liên tiếp.
- **Controls:**
  - `Start` / `Pause` (Phím tắt: `Space`).
  - `Reset` (Đặt lại thời gian chu kỳ hiện tại về ban đầu).
  - `Skip` (Bỏ qua chu kỳ hiện tại và chuyển sang chu kỳ kế tiếp).
- **Hành vi khi kết thúc chu kỳ (Completion Lifecycle):**
  1. **Chime Audio Sound:** Phát âm thanh chuông ngân thư thái (Tibetan Singing Bowl hoặc Soft Digital Bell) trong ~3 giây.
  2. **Audio Ducking:** Trong thời gian phát chuông (3 giây), hệ thống tự động giảm âm lượng của YouTube Player và White Noise Mixer xuống **50%**, sau đó nâng dần về mức cũ để người dùng nghe rõ chuông báo mà không giật mình.
  3. **Browser Tab Title Flashing:** Luân phiên thay đổi `document.title` giữa `(00:00) Hết giờ rồi! 🎉` và `VibeSpace — Focus Space` với tần suất 1s/lần cho đến khi người dùng kích hoạt tab trở lại.
  4. **Manual Transition Gate:** Hệ thống tự động chuyển mode sang Break (hoặc Focus tiếp theo), nhưng **chờ người dùng bấm Start** để bắt đầu chu kỳ mới (không tự chạy lướt qua khi người dùng vắng mặt).

---

### Module 3: YouTube Lofi Music Player (Dual-Mode)
- **ID:** `FS-03`
- **Mô tả:** Trình phát nhạc lofi stream từ YouTube, sử dụng kiến trúc chế độ kép (Dual Mode) cân bằng giữa tối giản và ngắm visual stream.
- **Chế độ hiển thị (Dual Mode):**
  - **Compact Audio Pill (Mặc định):** Một thanh điều khiển Glassmorphism nhỏ gọn đặt tại góc màn hình hoặc trong floating panel, hiển thị:
    - Ảnh thumbnail đĩa than xoay nhẹ / animation sóng âm thanh (soundwave bar).
    - Tên bài hát/luồng stream và tên Channel.
    - Nút `Play/Pause`, `Next/Prev` (nếu là playlist).
    - Thanh trượt âm lượng độc lập (0 - 100%).
    - Nút toggle mở cửa sổ Mini-Video nổi.
  - **Floating Mini-Video Player:** Khi người dùng muốn xem hình ảnh stream (ví dụ cô gái Lofi Girl ngồi viết bài bên cửa sổ mèo ngủ):
    - Bung mở một cửa sổ video nổi tỉ lệ 16:9 với lớp viền kính bóng.
    - Cửa sổ có thể kéo thả vị trí (Draggable) hoặc cố định ở góc phải màn hình.
    - Có nút thu nhỏ (Minimize) đưa về lại thanh Audio Pill bất kỳ lúc nào.
- **Danh sách phát mặc định (Curated Curations):**
  1. *Lofi Girl — beats to relax/study to* (Livestream 24/7).
  2. *Chillhop Radio — jazzy & lofi hip hop beats* (Livestream 24/7).
  3. *Cozy Coffee Shop Ambience & Bossa Nova Piano* (Curated Playlist).
  4. *Night City Anime Lofi Deep Focus* (Curated Stream).
- **Tùy biến URL cá nhân (Custom YouTube URL Support):**
  - Hỗ trợ parser linh hoạt: Video đơn lẻ (`watch?v=...`), URL rút gọn (`youtu.be/...`), Playlist (`playlist?list=...`), YouTube Shorts (`shorts/...`).
  - Tự động trích xuất Video ID / Playlist ID và nạp vào YouTube IFrame API instance.
- **Tuân thủ kỹ thuật (IFrame Engine & Autoplay):**
  - Đảm bảo iframe luôn tồn tại trong DOM (sử dụng CSS `position: fixed; opacity: 0.001; pointer-events: none` khi ở chế độ Audio Only) để tránh bị cơ chế Garbage Collection của trình duyệt ngắt audio khi chạy nền trên Safari/Mobile.

---

### Module 4: Ambient White Noise Mixer (Web Audio API Engine)
- **ID:** `FS-04`
- **Mô tả:** Bộ trộn âm thanh nền đa kênh sử dụng Web Audio API (`AudioContext`), cho phép hòa âm đồng thời nhiều nguồn tiếng ồn tự nhiên với âm lượng riêng biệt.
- **Danh mục 5 âm thanh cốt lõi (Catalog):**
  1. 🌧️ **Rain & Thunder (Mưa rào & Sấm xa):** Tiếng mưa rơi trên mái hiên kèm tiếng sấm rền êm dịu.
  2. 🔥 **Campfire Crackle (Lửa trại tách bách):** Tiếng gỗ cháy đượm tí tách sưởi ấm không gian.
  3. 🌲 **Pine Forest Wind (Gió luồn rừng thông):** Tiếng gió thổi vi vu qua tán lá và tiếng chim hót xa xa.
  4. 🌊 **Ocean Waves (Sóng biển êm đềm):** Tiếng sóng xô bờ cát thoai thoải nhịp nhàng.
  5. ☕ **Cozy Coffee Shop (Quán cà phê ấm cúng):** Tiếng trò chuyện thì thầm mờ ảo, tiếng cốc thìa khuấy sứ và tiếng máy pha espresso.
- **Bộ âm thanh mở rộng (Tùy chọn bổ sung):**
  - ⌨️ *Mechanical Keyboard (Gõ phím cơ êm tai)*.
  - 🌙 *Night Crickets (Tiếng dế mèn đêm thanh tĩnh)*.
- **Bộ Preset gợi ý sẵn (1-Click Sound Presets):**
  - `Rainy Cafe`: Rain 65% + Coffee Shop 50% + Campfire 15%.
  - `Deep Forest Night`: Forest Wind 60% + Night Crickets 40% + Campfire 30%.
  - `Ocean Sanctuary`: Ocean Waves 70% + Forest Breeze 30%.
  - `Cozy Winter Cabin`: Campfire 80% + Rain 30%.
- **Kiến trúc âm thanh (Web Audio Graph):**
  - `AudioContext` kết nối từng kênh âm thanh (`AudioBufferSourceNode` chạy chế độ `loop = true`).
  - Mỗi kênh gắn với 1 `Channel GainNode` độc lập để chỉnh volume riêng.
  - Toàn bộ kênh hội tụ về 1 `Master GainNode` kết nối đến `audioContext.destination`.
  - Hỗ trợ **Gapless Crossfade**: Xử lý 2 buffer gối đầu 0.5s ở ranh giới lặp để triệt tiêu hoàn toàn hiện tượng ngắt quãng micro-gap.
  - Nút **Master Mute/Unmute** (Phím tắt: `M`) với thời gian tăng/giảm âm lượng êm dịu (`linearRampToValueAtTime` 0.2s) tránh tiếng "bụp" (audio pop/click).

---

### Module 5: Aesthetic Background Switcher
- **ID:** `FS-05`
- **Mô tả:** Không gian thẩm mỹ nền tảng bao bọc toàn bộ ứng dụng, tạo cảm xúc thị giác sâu lắng cho người dùng.
- **Thư viện hình ảnh & video nền chất lượng cao:**
  - *Bộ sưu tập ảnh Unsplash HD tĩnh:* Rừng thông sương mù (Misty Pine Forest), Cửa sổ mưa đêm thành phố (Rainy City Window), Đỉnh núi tuyết lúc hoàng hôn (Sunset Alpine Peak), Thư viện gỗ cổ điển (Dark Academia Library), Phòng làm việc tối giản phong cách Bắc Âu (Nordic Minimalist Desk).
  - *Bộ sưu tập Video Ambient Loop (WebM/MP4 ~3-5MB tối ưu nén):* Ngọn lửa trại cháy chậm, Mưa rơi trên kính cửa sổ, Mặt hồ sóng gợn lăn tăn.
  - *Tùy chỉnh từ URL bên ngoài:* Cho phép dán link ảnh HD từ internet.
- **Bộ điều khiển Glassmorphism Filter:**
  - **Dark Overlay Opacity Slider (0% - 90%):** Tùy chỉnh lớp phủ đen để đồng hồ Pomodoro và các widget luôn nổi bật rõ ràng, chống mỏi mắt.
  - **Background Blur Slider (0px - 20px):** Cho phép làm mờ hậu cảnh để tăng tối đa độ tập trung và tăng hiệu ứng kính của các panel nổi.

---

### Module 6: Daily Todo List & Smart Rollover
- **ID:** `FS-06`
- **Mô tả:** Checklist quản lý công việc hàng ngày tối giản, tập trung vào những đầu việc cốt lõi của ngày làm việc (Eat That Frog / MIT - Most Important Tasks).
- **Tính năng cơ bản:**
  - Thêm công việc mới (`Enter` để add nhanh).
  - Đánh dấu hoàn thành / Hoàn tác (Checkbox toggle với hiệu ứng gạch ngang strikethrough mượt mà).
  - Xóa công việc khỏi danh sách.
  - Đếm số lượng: `Đã hoàn thành X / Tổng Y việc`.
- **Cơ chế Tự động Reset theo ngày thông minh (Smart Rollover):**
  - **Trigger Detection:** Mỗi khi ứng dụng được mở lại, tải lại, hoặc khi tab nhận lại sự chú ý (`visibilitychange` / `window.focus`), hệ thống kiểm tra:
    $$\text{currentDateString} = \text{new Date().toLocaleDateString('en-CA')}$$
  - So sánh với `lastActiveDate` lưu trong `localStorage`.
  - **Logic Rollover:**
    - Nếu $\text{currentDateString} \neq \text{lastActiveDate}$:
      1. Tự động chuyển toàn bộ các công việc **đã hoàn thành (`isCompleted: true`)** vào mảng lưu trữ lịch sử (`archivedTasks`) và xóa khỏi danh sách hiển thị hôm nay.
      2. **Giữ nguyên 100% các công việc chưa hoàn thành (`isCompleted: false`)** và cập nhật mốc thời gian sang ngày mới để người dùng tiếp tục xử lý việc dang dở mà không bị mất dữ liệu.
      3. Cập nhật `lastActiveDate = currentDateString`.

---

### Module 7: Global Hotkeys & Shortcut Cheat Sheet
- **ID:** `FS-07`
- **Mô tả:** Hệ thống phím tắt toàn cục dành cho lập trình viên, nhà văn và power-users thao tác siêu tốc mà không cần chạm chuột.
- **Danh mục phím tắt:**
  - `Space`: Bắt đầu / Tạm dừng (Start/Pause) Pomodoro Timer (với điều kiện con trỏ không focus trong input text).
  - `R`: Đặt lại (Reset) Pomodoro về mốc thời gian ban đầu.
  - `M`: Bật/Tắt toàn bộ âm thanh (Master Mute/Unmute cho cả YouTube và White Noise).
  - `F`: Bật/Tắt chế độ Toàn màn hình & Zen Mode (Fullscreen Toggle).
  - `T`: Mở/Đóng nhanh bảng Daily Todo List.
  - `S`: Mở/Đóng nhanh bảng Ambient Sound Mixer.
  - `P`: Mở/Đóng nhanh bảng YouTube Music Player.
  - `B`: Mở/Đóng bảng Background Switcher.
  - `?`: Hiển thị / Ẩn bảng tra cứu phím tắt (Keyboard Shortcut Cheat Sheet Modal).

---

## 7. Non-Functional Requirements (NFR - Yêu cầu phi chức năng)

| Nhóm yêu cầu | Chỉ số KPI / Tiêu chuẩn | Phương pháp kiểm chứng (Phase 5 QA) |
| :--- | :--- | :--- |
| **Tốc độ tải trang (Performance)** | - **LCP (Largest Contentful Paint)** $\le 1.2\text{s}$ trên mạng 4G tiêu chuẩn.<br>- **CLS (Cumulative Layout Shift)** $\le 0.05$.<br>- **FID / INP (Interaction to Next Paint)** $\le 50\text{ms}$. | Chạy Lighthouse Audit, Chrome DevTools Performance Trace. |
| **Dung lượng mã nguồn (Bundle Size)** | Tổng dung lượng JavaScript + CSS ban đầu (Initial chunk gzipped) $\le 150\text{KB}$. | Vite bundle visualizer / Rollup analyzer. |
| **Độ tin cậy âm thanh (Audio Reliability)** | - Vòng lặp White Noise đạt chuẩn Gapless Loop tuyệt đối (0ms ngắt quãng).<br>- Không rò rỉ bộ nhớ (Zero Memory Leak) khi chuyển đổi phát nhạc liên tục trong 8 giờ. | Chrome DevTools Memory Heap Snapshot qua 5 chu kỳ Pomodoro. |
| **Khả năng tương thích (Compatibility)** | Hoạt động trơn tru 100% trên: Chrome $\ge 110$, Safari $\ge 16$, Firefox $\ge 115$, Edge $\ge 110$ (cả Desktop, Tablet và Mobile Viewport). | Cross-browser manual testing & Playwright automated suite. |
| **Bảo mật & Quyền riêng tư (Privacy)** | Không truyền bất kỳ dữ liệu cá nhân hay todo list lên server ngoài. 100% client-side. Không dùng third-party trackers. | Network Tab inspection. |

---

## 8. Data Storage & Schema (LocalStorage Specification)

Mọi trạng thái của VibeSpace được phân định rõ ràng trong `localStorage` với tiền tố `vibespace_v1_`:

```typescript
// 1. Cấu hình Pomodoro
interface PomodoroStorage {
  focusDuration: number;      // Số phút (Default: 25)
  shortBreakDuration: number; // Số phút (Default: 5)
  longBreakDuration: number;  // Số phút (Default: 15)
  longBreakInterval: number;  // Số phiên focus trước long break (Default: 4)
  autoStartBreaks: boolean;   // Tự chạy break hay đợi bấm (Default: false)
  chimeSoundEnabled: boolean; // Bật chuông kết thúc (Default: true)
  chimeVolume: number;        // Âm lượng chuông 0-1 (Default: 0.8)
}

// 2. Cấu hình Ambient White Noise Mixer
interface SoundMixerStorage {
  masterMuted: boolean;
  masterVolume: number;       // 0 - 1
  channels: {
    [soundId: string]: {
      enabled: boolean;
      volume: number;         // 0 - 1
    }
  };
  activePresetId: string | null;
}

// 3. Cấu hình YouTube Player
interface YouTubePlayerStorage {
  currentTrackId: string;     // Video ID hoặc Playlist ID
  isPlaylist: boolean;
  volume: number;             // 0 - 100
  showMiniVideo: boolean;     // Trạng thái mở cửa sổ video nổi
  customUrls: Array<{ title: string; url: string; addedAt: number }>;
}

// 4. Danh sách Todo & Lịch sử
interface TodoItem {
  id: string;
  text: string;
  isCompleted: boolean;
  createdAt: number;
  completedAt?: number;
}

interface TodoStorage {
  lastActiveDate: string;     // Format YYYY-MM-DD (e.g. "2026-09-16")
  items: TodoItem[];
  archive: TodoItem[];        // Lưu trữ tối đa 100 task đã xong của các ngày trước
}

// 5. Cấu hình Background
interface BackgroundStorage {
  type: 'curated-image' | 'curated-video' | 'custom-url';
  src: string;
  darkOverlayOpacity: number; // 0.0 - 0.9 (Default: 0.4)
  blurAmount: number;         // 0 - 20 (px) (Default: 0)
}
```

---

## 9. Edge Cases & Exception Handling (Kịch bản ngoại lệ)

| Kịch bản sự cố (Edge Case) | Phân tích rủi ro | Chiến lược xử lý tự động (Mitigation Strategy) |
| :--- | :--- | :--- |
| **YouTube Video bị chặn nhúng (Error 150 / 101)** | Chủ video tắt tính năng nhúng ngoài web, gây màn hình đen lỗi trên IFrame. | Bắt sự kiện `onError` từ YouTube API, hiển thị thông báo dịu nhẹ "Video này bị chặn phát ngoài YouTube, đang tự động chuyển về luồng Lofi Girl chính thống". |
| **Mất kết nối mạng Internet (Offline State)** | Không tải được luồng YouTube và ảnh Unsplash mới. | Web Audio API đã cache sẵn các đoạn white noise ngắn trong CacheStorage (PWA Ready); hiển thị banner offline nhỏ; Pomodoro và Todo List hoạt động bình thường 100%. |
| **Chính sách Autoplay của trình duyệt (AudioContext Blocked)** | Trình duyệt Chrome/Safari chặn phát âm thanh nếu người dùng chưa tương tác click đầu tiên. | Thiết lập cơ chế "Click-to-Unlock": Khi người dùng bấm nút Play lần đầu tiên, gọi `audioContext.resume()` giải phóng trạng thái `suspended`. |
| **Dữ liệu LocalStorage bị lỗi/hỏng cấu trúc JSON** | Người dùng xóa dở dữ liệu hoặc phiên bản mới không tương thích schema cũ. | Bọc toàn bộ hàm nạp `localStorage` trong `try-catch`, nếu phát hiện cấu trúc không hợp lệ sẽ tự động khôi phục cấu hình mặc định (Safe Fallback Reset) mà không làm sập ứng dụng. |

---

## 10. Acceptance Criteria (Tiêu chí nghiệm thu - Gherkin Syntax)

### Kịch bản 1: Hoàn thành phiên Pomodoro và kích hoạt chuông báo kèm Audio Ducking
```gherkin
Given Đồng hồ Pomodoro đang đếm ngược ở giây cuối cùng (00:01) của phiên Focus
  And YouTube Player đang phát ở mức âm lượng 80%
  And White Noise tiếng mưa đang bật ở mức âm lượng 70%
When Đồng hồ chạm mốc 00:00
Then Chuông chime kết thúc chu kỳ phát vang ngân êm dịu
  And Âm lượng YouTube Player tự động hạ xuống 40% trong vòng 3 giây
  And Âm lượng tiếng mưa tự động hạ xuống 35% trong vòng 3 giây
  And Tiêu đề Tab trình duyệt bắt đầu nhấp nháy dòng chữ "(00:00) Nghỉ ngơi thôi! 🎉"
  And Trạng thái đồng hồ tự động chuyển sang "Short Break (05:00)" ở trạng thái tạm dừng, chờ người dùng bấm Start.
```

### Kịch bản 2: Tự động dọn dẹp task đã hoàn thành qua ngày mới (Smart Rollover)
```gherkin
Given Người dùng có 2 task chưa xong và 3 task đã tích hoàn thành trong ngày 2026-09-15
  And LocalStorage ghi nhận lastActiveDate là "2026-09-15"
When Người dùng mở lại VibeSpace vào sáng ngày 2026-09-16
Then Hệ thống phát hiện ngày hiện tại (2026-09-16) khác với lastActiveDate
  And 3 task đã tích hoàn thành tự động được xóa khỏi màn hình chính và chuyển vào mục Lưu trữ
  And 2 task chưa xong vẫn được giữ nguyên vẹn trên danh sách công việc của ngày mới
  And lastActiveDate được cập nhật thành "2026-09-16".
```

### Kịch bản 3: Tự động ẩn giao diện sau 5 giây không rê chuột (Zen Auto-Hide)
```gherkin
Given Người dùng đang ở màn hình chính và không mở bất kỳ panel cài đặt nào
When Người dùng không di chuyển chuột và không nhấn bất kỳ phím nào trong 5.0 giây
Then Toàn bộ các nút bấm FABs, dock điều khiển và header mờ dần về độ mờ 0%
  And Màn hình chỉ còn hiển thị hình nền thư giãn và số đếm Pomodoro mờ ảo
When Người dùng di chuyển chuột nhẹ
Then Toàn bộ giao diện lập tức hiện rõ trở lại bình thường.
```

---

## 11. Phê duyệt & Lộ trình thực hiện (Sign-off)
Tài liệu PRD này là chuẩn mực đầu ra của **Giai đoạn 2 (Requirements & Architecture)**, đồng thời là đầu vào trực tiếp cho **Giai đoạn 3: UI/UX Design & Prototyping trên Google Stitch (do Anh chủ trì thiết kế)**.
