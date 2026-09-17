# VibeSpace — Dark Glassmorphism Design System Specification

| **Document Version** | **1.0.0** |
| :--- | :--- |
| **Design Platform** | Google Stitch (`StitchMCP`) |
| **Stitch Project ID** | `9197279953936235530` (`projects/9197279953936235530`) |
| **Stitch Asset ID** | `assets/4722625186275383533` |
| **Theme Mode** | Dark Frosted Glassmorphism |
| **Target Viewports** | Desktop (1920x1080) & Mobile (390x844) |

---

## 1. Visual Theme & Philosophy
VibeSpace được thiết kế theo phong cách **Dark Glassmorphism (Kính mờ bóng đêm)** kết hợp với ánh sáng **Neon Glow dịu nhẹ** (Purple Zen & Cyan Frost). Mục tiêu là tạo ra cảm giác tĩnh lặng tuyệt đối, thư giãn thị giác, không gây chói mắt khi làm việc ban đêm.

---

## 2. Color Palette & Token System

### 2.1. Nền & Lớp Kính (Glassmorphism Surfaces)
- **Base Canvas:** `#0b0f19` (Dark Slate / Midnight Navy)
- **Glass Tier 1 (Dock & TopBar):**
  - Background: `rgba(18, 18, 23, 0.55)`
  - Backdrop Blur: `16px` (`backdrop-blur-md`)
  - Border: `1px solid rgba(255, 255, 255, 0.12)`
  - Shadow: `0 8px 32px 0 rgba(0, 0, 0, 0.37)`
- **Glass Tier 2 (Drawers & Modals):**
  - Background: `rgba(22, 24, 30, 0.75)`
  - Backdrop Blur: `24px` (`backdrop-blur-xl`)
  - Border: `1px solid rgba(255, 255, 255, 0.16)`
  - Shadow: `0 16px 48px 0 rgba(0, 0, 0, 0.45)`
- **Glass Tier 3 (Cards, List items & Slider tracks):**
  - Background: `rgba(255, 255, 255, 0.06)`
  - Border: `1px solid rgba(255, 255, 255, 0.08)`
  - Hover State: `rgba(255, 255, 255, 0.12)`, `border-white/20`

### 2.2. Màu Nhấn (Accent & Glow Colors)
- **Primary Glow (Neon Purple):** `#a855f7` (RGB: `168, 85, 247`) — Biểu tượng Pomodoro Play, active toggles.
- **Secondary Accent (Cyan Frost):** `#06b6d4` (RGB: `6, 182, 212`) — White noise active wave, break indicators.
- **Success / Focus Indicator (Emerald):** `#10b981` (RGB: `16, 185, 129`) — Task completed checkbox, long break tag.
- **Warning / Hotkey Chip:** `#f59e0b` (RGB: `245, 158, 11`)

### 2.3. Typography
- **Headlines / Big Digits:** `Plus Jakarta Sans`, sans-serif (Font-weight: 700 / 800)
- **Body & Controls:** `Inter`, sans-serif (Font-weight: 400 / 500 / 600)
- **Monospace / Timer Digits / Hotkeys:** `JetBrains Mono`, monospace (Font-weight: 500 / 700)
- **Text Hierarchies:**
  - High Contrast (Headings, Pomodoro digits): `rgba(255, 255, 255, 0.95)`
  - Medium Contrast (Body, Subtitles): `rgba(255, 255, 255, 0.70)`
  - Low Contrast (Labels, Secondary info): `rgba(255, 255, 255, 0.45)`

### 2.4. Roundness & Spacing
- **Corner Radii:** `ROUND_TWELVE` (`rounded-2xl` cho Panels / Modals, `rounded-xl` cho Cards, `rounded-full` cho FABs và Pills).
- **Spacings:** 4px, 8px, 12px, 16px, 24px, 32px.
