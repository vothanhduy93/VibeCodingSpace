# VibeSpace — Software Architecture Document (SAD)

| **Document Version** | **1.2.0** |
| :--- | :--- |
| **Status** | Approved / Phase 2 Complete ➔ Entering Phase 3 (Design on Google Stitch) |
| **Governance Model** | **Standard 6-Phase SDLC (ISO/IEC 12207 & Agile Stage-Gate Framework)** |
| **Target Release** | V1.0.0 MVP |
| **Architecture Pattern** | Local-First Component-Driven SPA (Stitch Design-to-Code + Web Audio Graph) |
| **Lead Roles** | Principal System Architect & Lead Frontend Engineer (15+ Years Exp) |
| **Last Updated** | 2026-09-16 |

---

## 1. Architectural Overview & 6-Phase SDLC Governance

Hệ thống kiến trúc của VibeSpace được xây dựng theo mô hình **Client-Side Single-Page Application (SPA)** với nguyên tắc **Local-First**, đồng thời tương thích chặt chẽ với **Quy trình 6 Giai đoạn SDLC**:

```
[ PHASE 1: PLANNING ] ──(Scope)──> [ PHASE 2: ARCHITECTURE BASELINE (SAD) ]
                                                        │
                                                        ▼
[ PHASE 4: CODING ] <──(Tokens/Specs)── [ PHASE 3: STITCH DESIGN (Anh thiết kế) ]
         │
         ▼
[ PHASE 5: QA & TEST HARNESS ] ──(Pass Gate)──> [ PHASE 6: PROD BUILD & DEPLOY ]
```

### 1.1. Kiến trúc phân theo 6 Giai đoạn SDLC
1. **Giai đoạn 1 (Planning & Feasibility):** Khóa cứng mô hình Local-First, Zero-Backend, không phụ thuộc server xác thực, chạy hoàn toàn trên trình duyệt người dùng.
2. **Giai đoạn 2 (Requirements & Architecture - Hoàn tất):** Thiết lập tài liệu SAD, mô hình Web Audio Graph, State Machine Pomodoro, Data Schema và giải pháp kỹ thuật phòng ngừa rủi ro.
3. **Giai đoạn 3 (UI/UX Design trên Google Stitch - Bắt đầu):** Anh trực tiếp thiết kế trên Google Stitch. Hệ thống kiến trúc cung cấp bảng Design Tokens và Component Contracts để các màn hình Stitch dễ dàng ánh xạ 1:1 sang code mà không phát sinh sai lệch.
4. **Giai đoạn 4 (Implementation & Coding):** Lập trình React 19 + TypeScript + Tailwind CSS, module hóa thành các tầng Presentation Layer, State Store Layer, Audio Engine Layer và Storage Persistence Layer.
5. **Giai đoạn 5 (Testing & QA):** Kiến trúc hỗ trợ kiểm thử tự động với Playwright, Web Audio Context spy/mock, đo đạc Pixel Parity và Memory Heap profiling chống rò rỉ RAM.
6. **Giai đoạn 6 (Deployment & Maintenance):** Đóng gói bundle tĩnh tối ưu (<150KB gzipped), PWA Service Worker caching tài nguyên ambient audio, sẵn sàng triển khai trên Vercel / Cloudflare Pages.

---

## 2. Design-to-Code Pipeline (Google Stitch Integration Architecture)

Trong Giai đoạn 3, **Anh sẽ trực tiếp thiết kế các màn hình trên Google Stitch**. Vai trò kiến trúc của Agent là cầu nối kỹ thuật (Bridge) để chuyển hóa thiết kế của Anh thành mã nguồn sạch trong Giai đoạn 4:

```
+---------------------------------------------------------------------------------------+
|                       GOOGLE STITCH DESIGN SUITE (Anh thiết kế)                       |
|                                                                                       |
|  - Anh tạo Screens (SCR-01 đến SCR-08) & tinh chỉnh trực quan trên Google Stitch.    |
|  - Agent hỗ trợ: Soạn thảo Design Spec, Prompt mẫu, Token Schema và Review giao diện. |
+---------------------------------------------------------------------------------------+
                                           │
                                           ▼ (Export Tokens & CSS Contracts)
+---------------------------------------------------------------------------------------+
|                            DESIGN TOKEN SYNCHRONIZATION LAYER                         |
|                                                                                       |
|  +------------------------------------+   +----------------------------------------+  |
|  | tailwind.config.js & CSS Variables |   | src/components/ui (Glass Atoms)        |  |
|  | - Glassmorphism surface tiers      |──>| - GlassButton, GlassSlider, GlassModal |  |
|  | - Backdrop blur scales             |   | - 100% Pixel & Token Parity with Stitch|  |
|  +------------------------------------+   +----------------------------------------+  |
+---------------------------------------------------------------------------------------+
```

### 2.1. Bảng Ánh xạ Design Tokens (Stitch ➔ Codebase)

| Stitch Token Category | Thuộc tính CSS & CSS Variables | Tailwind Class Mapping | Ứng dụng thành phần |
| :--- | :--- | :--- | :--- |
| **Glass Surface Tier 1** | `rgba(18, 18, 23, 0.55)`, `blur(16px)` | `glass-dock` / `backdrop-blur-md` | Thanh Bottom Floating Dock, Header bar |
| **Glass Surface Tier 2** | `rgba(22, 24, 30, 0.75)`, `blur(24px)` | `glass-panel` / `backdrop-blur-xl` | Floating Drawers: Sound Mixer, Todo, Theme |
| **Glass Surface Tier 3** | `rgba(255, 255, 255, 0.06)`, `border-white/10` | `glass-card` / `hover:bg-white/12` | Sub-items: Task rows, Sound slider tracks |
| **Glass Borders** | `1px solid rgba(255, 255, 255, 0.12)` | `border border-white/10` | Đường viền phản chiếu ánh sáng kính |
| **Accent Glow** | `rgba(168, 85, 247, 0.4)` (Purple Zen) | `shadow-[0_0_25px_rgba(168,85,247,0.35)]` | Trạng thái Active: Pomodoro Play, Sound ON |

---

## 3. Technology Stack & Decision Matrix

| Thành phần kỹ thuật | Công nghệ lựa chọn | Lý do kiến trúc & Lợi ích kỹ thuật |
| :--- | :--- | :--- |
| **Design & Prototyping (Phase 3)** | **Google Stitch (StitchMCP)** | Tạo Design System chuẩn mực, sinh mockups màn hình trực quan và trích xuất design tokens trước khi bước vào giai đoạn code. |
| **Build Tool & Bundler (Phase 4)** | **Vite 6** | Tốc độ dev HMR tức thì (<50ms), cấu hình Rollup tối ưu hóa tree-shaking, sinh bundle production siêu nhỏ (<150KB gzipped). |
| **UI Framework (Phase 4)** | **React 19 (TypeScript)** | Hệ sinh thái hoàn chỉnh, kiểu dữ liệu tĩnh mạnh mẽ, xử lý reactive state hiệu năng cao với React Hooks và tối ưu rendering qua `memo` / `useCallback`. |
| **CSS & Styling Engine (Phase 4)** | **Tailwind CSS v3.4+** | Tiện ích hóa styling (Utility-first), loại bỏ CSS dư thừa (PurgeCSS), dễ dàng tích hợp các token Glassmorphism từ Google Stitch. |
| **State Management (Phase 4)** | **Zustand (v5)** | State store siêu nhẹ (~1KB), không boilerplate, không re-render không mong muốn như React Context, tích hợp middleware `persist` cho LocalStorage cực kỳ tinh gọn. |
| **Ambient Audio Engine (Phase 4)** | **Web Audio API (`AudioContext`)** | Khả năng kiểm soát âm thanh cấp thấp: Đạt chuẩn Gapless Looping tuyệt đối (0ms micro-gap), độc lập từng kênh âm lượng (`GainNode`), Master Muting không gây audio pop/click qua `linearRampToValueAtTime`, hỗ trợ Audio Ducking mượt mà. |
| **Music Streaming Engine (Phase 4)** | **YouTube IFrame Player API** | Tận dụng kho nhạc Lofi livestream và playlist khổng lồ toàn cầu không giới hạn, không tốn băng thông lưu trữ audio trên server riêng. |
| **Testing Harness (Phase 5)** | **Playwright & Vitest** | Kiểm thử E2E tương tác đa trình duyệt, chạy headless test kiểm tra pixel chênh lệch và đo đạc thuộc tính vi mô. |
| **Deployment & Hosting (Phase 6)** | **Vercel / Cloudflare Pages (PWA)** | Phân phối static toàn cầu qua Edge CDN, SSL tự động, zero server maintenance. |

---

## 4. High-Level System Architecture

Sơ đồ kiến trúc phân tầng của VibeSpace:

```
+---------------------------------------------------------------------------------------+
|                                    PRESENTATION LAYER                                 |
|                       (Hiện thực hóa 100% từ thiết kế Google Stitch)                  |
|                                                                                       |
|  +---------------------------------------------------------------------------------+  |
|  | [Background Engine] Curated HD Images / Seamless Looping WebM Videos / Filters  |  |
|  +---------------------------------------------------------------------------------+  |
|  | [Zen Overlay] Inactivity Watchdog (5s Auto-Hide) / Fullscreen Hotkey Controller |  |
|  +---------------------------------------------------------------------------------+  |
|  | [Core Center Widget] Pomodoro Digit Display / Circular Progress / State Controls|  |
|  +---------------------------------------------------------------------------------+  |
|  | [Glassmorphic Floating Dock] Audio FAB / Mixer FAB / Todo FAB / Theme FAB / Help|  |
|  +---------------------------------------------------------------------------------+  |
|  | [Floating Overlay Drawers & Modals]                                             |  |
|  |   - YouTube Player (Pill + Mini-Video Window)                                   |  |
|  |   - Ambient Sound Mixer (5+ Sliders & Presets)                                  |  |
|  |   - Daily Todo List (Checkbox, Enter-to-Add, Archive)                           |  |
|  |   - Background Selector & Filter Controls                                       |  |
|  |   - Keyboard Shortcuts Guide Modal                                              |  |
|  +---------------------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------------+
                                           │
                                           ▼
+---------------------------------------------------------------------------------------+
|                                APPLICATION STATE LAYER (ZUSTAND)                      |
|                                                                                       |
|  +----------------------+ +----------------------+ +-------------------------------+  |
|  |   usePomodoroStore   | |   useSoundMixerStore | |       useYouTubeStore         |  |
|  | - timer, mode, state | | - channels, presets  | | - currentTrack, isPlaying     |  |
|  | - interval countdown | | - masterVolume, mute | | - volume, miniVideoOpen       |  |
|  +----------------------+ +----------------------+ +-------------------------------+  |
|  +----------------------+ +----------------------+ +-------------------------------+  |
|  |     useTodoStore     | |  useBackgroundStore  | |         useUIStore            |  |
|  | - tasks, archive     | | - currentTheme, type | | - isIdle, activeModal         |  |
|  | - smartRolloverCheck | | - overlayOpacity,blur| | - isFullscreen                |  |
|  +----------------------+ +----------------------+ +-------------------------------+  |
+---------------------------------------------------------------------------------------+
                     │                                             │
                     ▼                                             ▼
+-------------------------------------------+ +-----------------------------------------+
|             AUDIO ENGINE LAYER            | |         DATA PERSISTENCE LAYER          |
|                                           | |                                         |
|  +-------------------------------------+  | |  +-----------------------------------+  |
|  | Web Audio API Graph:                |  | |  | LocalStorage Subsystem:            |  |
|  | - AudioContext (Auto-Unlock)        |  | |  | - Prefix: 'vibespace_v1_'         |  |
|  | - BufferSources (Gapless Loop)      |  | |  | - Debounced Sync Layer             |  |
|  | - Channel GainNodes (Independent)   |  | |  | - JSON Schema Safe Validation      |  |
|  | - Master GainNode & Audio Ducking   |  | |  | - Smart Rollover Timezone Worker   |  |
|  | - Chime Bell Synthesizer / Sampler  |  | |  +-----------------------------------+  |
|  +-------------------------------------+  | +-----------------------------------------+
|  +-------------------------------------+  |
|  | YouTube IFrame API Controller:      |  |
|  | - Hidden Headless Audio Anchor      |  |
|  | - Floating Pop-out Video Renderer   |  |
|  | - URL Parser (Video / Playlist / Sh)|  |
|  +-------------------------------------+  |
+-------------------------------------------+
```

---

## 5. Web Audio API Architecture (Ambient Engine & Audio Ducking)

### 5.1. Web Audio Graph Topology
Để đảm bảo chất lượng âm thanh không bị giật rè, không ngắt quãng và có thể hòa âm tự do nhiều nguồn, VibeSpace thiết lập đồ thị âm thanh (Audio Graph) như sau:

```
[Sound Buffer 1: Rain]     ---> [GainNode 1] ───┐
[Sound Buffer 2: Fire]     ---> [GainNode 2] ───┤
[Sound Buffer 3: Wind]     ---> [GainNode 3] ───┼──> [Master GainNode] ──> [AudioContext.destination]
[Sound Buffer 4: Ocean]    ---> [GainNode 4] ───┤          ▲
[Sound Buffer 5: Coffee]   ---> [GainNode 5] ───┘          │
                                                           │ (Ducking Control: 50% ramp-down)
[Pomodoro Chime Bell]      ────────────────────────────────┴──> [Chime GainNode] ──┘
```

### 5.2. Gapless Looping Mechanism (Kỹ thuật lặp không khoảng ngắt)
- **Vấn đề của thẻ `<audio loop>` thông thường:** Trình duyệt thường mất từ $50\text{ms} - 200\text{ms}$ để giải mã và tua lại đầu file âm thanh khi hết vòng lặp, tạo ra một khoảng lặng (micro-gap) rất khó chịu đối với tiếng mưa rơi hay tiếng sóng biển.
- **Giải pháp Web Audio API:**
  1. Tải file âm thanh dưới dạng nén (WebM/Opus hoặc MP3) qua `fetch()`.
  2. Giải mã trực tiếp thành mảng dữ liệu âm thanh thô (`AudioBuffer`) thông qua `audioContext.decodeAudioData()`.
  3. Khởi tạo `AudioBufferSourceNode`, gán thuộc tính `source.loop = true`.
  4. Quá trình lặp diễn ra ở tầng phần cứng DSP (Digital Signal Processing) của hệ điều hành, đảm bảo độ trễ chuyển tiếp là **chính xác 0 sample (True Gapless)**.

### 5.3. Smooth Transition & Audio Ducking Algorithm
- Khi người dùng bật/tắt (Toggle ON/OFF) một kênh âm thanh hoặc Master Mute:
  ```typescript
  // Tránh tiếng pop/click bằng cách thay đổi gain tuyến tính trong 0.2 giây
  channelGainNode.gain.cancelScheduledValues(audioContext.currentTime);
  channelGainNode.gain.linearRampToValueAtTime(targetVolume, audioContext.currentTime + 0.2);
  ```
- **Audio Ducking khi hết chu kỳ Pomodoro:**
  Khi đồng hồ chạm mốc `00:00`:
  1. `masterGainNode.gain.setTargetAtTime(currentMasterVolume * 0.5, audioContext.currentTime, 0.1);` (Hạ âm lượng nền xuống 50% trong 0.1s).
  2. Kích hoạt phát `chimeNode` với âm lượng rõ nét (100%).
  3. Sau 3.0 giây (khi chuông ngân tan biến):
  4. `masterGainNode.gain.setTargetAtTime(currentMasterVolume, audioContext.currentTime + 3.0, 0.5);` (Phục hồi âm lượng nền êm dịu).

---

## 6. YouTube IFrame Engine Architecture

### 6.1. Dual-Mode Integration Architecture
YouTube IFrame API đòi hỏi một phần tử DOM thực tế (`<div>` hoặc `<iframe>`). Để vừa hỗ trợ nghe nhạc ẩn (Audio Only), vừa hỗ trợ ngắm video Lofi nổi (Floating Mini-Video):
1. **Thành phần cố định (Persistent DOM Anchor):**
   - Một container `div#youtube-player-anchor` được render cố định ở tầng thấp nhất.
   - Khi ở chế độ **Audio Pill**: Container này được ẩn đi một cách thông minh (`position: fixed; width: 1px; height: 1px; opacity: 0.001; pointer-events: none; z-index: -1`). Cách này đảm bảo YouTube API không bị trình duyệt mobile/Safari đóng băng do `display: none`.
   - Khi ở chế độ **Mini-Video Window**: Container được gắn vào một thẻ Card Glassmorphism nổi có thể kéo thả (`draggable`), kích thước tỉ lệ 16:9 với độ phân giải linh hoạt (ví dụ: $360 \times 202\text{px}$).
2. **URL Parsing Subsystem (Trình phân tích URL thông minh):**
   - Hỗ trợ các mẫu URL:
     - Standard Watch: `youtube.com/watch?v={ID}`
     - Short Link: `youtu.be/{ID}`
     - YouTube Shorts: `youtube.com/shorts/{ID}`
     - Playlist: `youtube.com/playlist?list={LIST_ID}`
   - Regex trích xuất độc lập, tự động gọi phương thức `player.loadVideoById(id)` hoặc `player.loadPlaylist({ list: listId })`.

---

## 7. Daily Todo Engine & Smart Rollover Algorithm

### 7.1. Logic Flow Diagram

```
[App Starts / Window Focuses / Tab Visibility Active]
                         │
                         ▼
             [Read lastActiveDate from LocalStorage]
                         │
                         ▼
        [Is currentDateString !== lastActiveDate ?]
                     │                 │
                    YES                NO
                     │                 │
                     ▼                 ▼
  [Split Todos into Done & Pending]  [Do Nothing, Keep Current View]
                     │
  ┌──────────────────┴──────────────────────────────┐
  ▼                                                 ▼
[Filter tasks: isCompleted === true]   [Filter tasks: isCompleted === false]
  │                                                 │
  ▼                                                 ▼
[Push to 'archivedTasks' (Max 100)]    [Retain for Today (Rollover)]
  │                                                 │
  └──────────────────┬──────────────────────────────┘
                     ▼
  [Save new items + Set lastActiveDate = currentDateString]
                     │
                     ▼
  [Update Zustand Store & Render Pristine Daily Checklist]
```

---

## 8. Glassmorphism Visual Token Architecture

Để đảm bảo hiệu ứng giao diện kính mờ sang trọng, đạt chuẩn UI/UX Pro Max, hệ thống CSS xây dựng theo hệ phân cấp 3 tầng kính kế thừa từ Google Stitch:

```css
/* Glassmorphism Tier 1: Nền các thanh FABs và Dock */
.glass-dock {
  background: rgba(18, 18, 23, 0.55);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}

/* Glassmorphism Tier 2: Các Floating Panel & Modal Drawers */
.glass-panel {
  background: rgba(22, 24, 30, 0.75);
  backdrop-filter: blur(24px) saturate(190%);
  -webkit-backdrop-filter: blur(24px) saturate(190%);
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 16px 48px 0 rgba(0, 0, 0, 0.45);
}

/* Glassmorphism Tier 3: Các Card và Nút bấm con */
.glass-card {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.glass-card:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.22);
  transform: translateY(-1px);
}
```

---

## 9. Directory & Project Structure (Clean-Room Layout)

```
vibespace/
├── .agents/                        # AI Agent Rules & Governance Protocols
│   └── rules/
│       └── agent-rules.md          # Core AI Persona & Engineering Mandates
├── docs/                           # Master SDLC Documentation
│   ├── prd.md                      # Product Requirements Document (v1.2)
│   ├── architecture.md             # Software Architecture Document (v1.2)
│   └── plan.md                     # Master Implementation Plan (v1.2)
├── design/                         # Google Stitch Artifacts & Design Specs (Phase 3)
│   ├── design.md                   # Stitch Design System Specification
│   ├── screens/                    # Stitch Screen Exports (SCR-01 to SCR-08)
│   └── tokens.json                 # Exported Stitch Color & Glass Tokens
├── public/
│   ├── sounds/                     # Compressed WebM/Opus & MP3 ambient loops
│   │   ├── rain.webm
│   │   ├── campfire.webm
│   │   ├── wind.webm
│   │   ├── ocean.webm
│   │   ├── coffee.webm
│   │   └── chime.mp3               # Soft Tibetan bowl bell for timer completion
│   ├── backgrounds/                # Curated fallback high-res images & video loops
│   └── favicon.svg
├── src/
│   ├── audio/                      # Web Audio API Engine
│   │   ├── AudioContextManager.ts  # Singleton AudioContext & unlock listener
│   │   ├── SoundChannel.ts         # AudioBufferSource + GainNode wrapper
│   │   └── SoundCatalog.ts         # Metadata, sound URLs and curated Presets
│   ├── components/
│   │   ├── background/             # Background Canvas & Video Engine
│   │   │   ├── BackgroundCanvas.tsx
│   │   │   └── BackgroundPickerModal.tsx
│   │   ├── pomodoro/               # Pomodoro Core Widget & Settings
│   │   │   ├── PomodoroCenter.tsx
│   │   │   ├── PomodoroProgressRing.tsx
│   │   │   └── PomodoroSettingsModal.tsx
│   │   ├── music/                  # YouTube Lofi Engine
│   │   │   ├── YouTubePlayerPill.tsx
│   │   │   ├── YouTubeMiniVideoCard.tsx
│   │   │   └── YouTubeInputModal.tsx
│   │   ├── mixer/                  # Ambient White Noise Mixer
│   │   │   ├── SoundMixerDrawer.tsx
│   │   │   ├── SoundSliderItem.tsx
│   │   │   └── SoundPresetsBar.tsx
│   │   ├── todo/                   # Daily Todo & Smart Rollover
│   │   │   ├── TodoDrawer.tsx
│   │   │   ├── TodoItemRow.tsx
│   │   │   └── TodoArchiveView.tsx
│   │   ├── ui/                     # Reusable Glassmorphism Atoms (from Stitch)
│   │   │   ├── GlassButton.tsx
│   │   │   ├── GlassSlider.tsx
│   │   │   ├── GlassModal.tsx
│   │   │   └── Tooltip.tsx
│   │   └── dock/                   # Bottom FABs & Zen Auto-Hide
│   │       ├── FloatingDock.tsx
│   │       ├── KeyboardShortcutsModal.tsx
│   │       └── TopBarClock.tsx
│   ├── hooks/
│   │   ├── useAutoIdleHide.ts      # 5s Inactivity detection & fade animation
│   │   ├── useDailyRollover.ts     # Timezone midnight watchdog
│   │   ├── useGlobalHotkeys.ts     # Space, M, F, T, S, P, ? key bindings
│   │   └── usePageTitleSync.ts    # Flashing title for timer notifications
│   ├── stores/                     # Zustand State Stores with LocalStorage Sync
│   │   ├── usePomodoroStore.ts
│   │   ├── useSoundMixerStore.ts
│   │   ├── useYouTubeStore.ts
│   │   ├── useTodoStore.ts
│   │   ├── useBackgroundStore.ts
│   │   └── useUIStore.ts
│   ├── types/                      # Comprehensive TypeScript Interfaces
│   │   └── index.ts
│   ├── constants/                  # Curated playlists, default sounds, presets
│   │   └── presets.ts
│   ├── App.tsx                     # Top-Level Root Component & Layout
│   ├── main.tsx                    # React Entrypoint
│   └── index.css                   # Tailwind Directives & Stitch Glass Tokens
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 10. Security, Performance & Browser Resilience Strategy

1. **Content Security Policy (CSP) Directives:**
   - Cho phép nhúng YouTube iframe: `frame-src https://www.youtube.com https://www.youtube-nocookie.com;`.
   - Cho phép tải tài nguyên âm thanh/hình ảnh từ Unsplash và CDN: `img-src 'self' data: https://images.unsplash.com; media-src 'self' data: blob:;`.
2. **Audio Autoplay Policy Resilience:**
   - Trình duyệt hiện đại luôn bắt đầu `AudioContext` ở trạng thái `suspended` nếu chưa có user gesture.
   - Module `AudioContextManager` tự động lắng nghe sự kiện click/keydown đầu tiên trên toàn trang để gọi `audioContext.resume()` ngay lập tức.
3. **Memory Leak Protection:**
   - Khi component Unmount hoặc bài nhạc chuyển đổi: Toàn bộ `AudioBufferSourceNode` cũ được gọi `.stop()` và `.disconnect()`.
   - YouTube IFrame API instance được dọn dẹp qua `.destroy()` khi reload trang.
