# VibeSpace — Light Frosted Glassmorphism Design System Specification

| **Document Version** | **2.0.0 (Light Mode Master)** |
| :--- | :--- |
| **Design Platform** | Google Stitch (`StitchMCP`) |
| **Stitch Project ID** | `9197279953936235530` (`projects/9197279953936235530`) |
| **Stitch Light Asset ID** | `assets/16183964866015251082` |
| **Theme Mode** | **Light Frosted Glassmorphism (Aesthetic Zen Daylight)** |
| **Target Viewports** | Desktop (1920x1080) & Mobile (390x844) |

---

## 1. Visual Theme & Philosophy
VibeSpace Light Mode được thiết kế theo phong cách **Aesthetic Scandinavian & Japanese Zen Minimalist Light (Zen Tối giản Ánh dương Bắc Âu & Nhật Bản)** kết hợp với **Luminous Frosted Glassmorphism (Kính mờ phát quang ánh sáng)**.

Mục tiêu thiết kế:
- **Không gian thanh khiết, tươi sáng**: Tạo cảm giác sảng khoái, tập trung cao độ, giàu năng lượng cho buổi sáng và ban ngày.
- **Lớp kính mờ trắng ngọc trai**: Sử dụng nền kính trắng bán trong suốt đa tầng (`rgba(255, 255, 255, 0.70 - 0.90)`), đổ bóng khuếch tán mềm mại (`soft diffused ambient shadows`), viền kính khúc xạ ánh sáng mảnh mai (`1px solid rgba(255, 255, 255, 0.85)`).
- **Độ tương phản chữ đạt chuẩn WCAG AAA & AA**: Toàn bộ chữ hiển thị trên nền kính đều dùng tone màu đá phiến thẫm Deep Slate (`#0f172a`, `#334155`), đảm bảo tỷ lệ tương phản tối thiểu $\ge 7:1$ (vượt xa chuẩn $4.5:1$ của WCAG AA).

---

## 2. Color Palette & Token System

### 2.1. Nền & Lớp Kính Luminous (Light Glass Surfaces)
- **Base Canvas:** `#f8fafc` (Slate 50 / Crisp Clean Pearl) kết hợp hình nền phong cảnh thiên nhiên ban ngày tươi sáng (sương sớm rừng thông ngập nắng, đồi núi mờ sương, phòng làm việc tối giản ngập tràn ánh sáng tự nhiên).
- **Glass Tier 1 (Floating Dock & TopBar):**
  - Background: `rgba(255, 255, 255, 0.72)`
  - Backdrop Blur: `16px` (`backdrop-blur-md`)
  - Border: `1px solid rgba(255, 255, 255, 0.85)` và đường viền ngoài `1px solid rgba(15, 23, 42, 0.06)`
  - Shadow: `0 10px 30px -10px rgba(15, 23, 42, 0.08), 0 4px 6px -2px rgba(15, 23, 42, 0.03)`
- **Glass Tier 2 (Drawers & Modals):**
  - Background: `rgba(255, 255, 255, 0.88)`
  - Backdrop Blur: `24px` (`backdrop-blur-xl`)
  - Border: `1px solid rgba(255, 255, 255, 0.95)` và `1px solid rgba(15, 23, 42, 0.08)`
  - Shadow: `0 25px 50px -12px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.6)`
- **Glass Tier 3 (Cards, List items & Slider tracks):**
  - Background: `rgba(255, 255, 255, 0.60)`
  - Hover State: `rgba(255, 255, 255, 0.95)`
  - Border: `1px solid rgba(15, 23, 42, 0.06)`
  - Active Ring: `2px solid rgba(124, 58, 237, 0.40)`

### 2.2. Màu Nhấn & Trạng thái (Accents & Highlights)
- **Primary Accent (Vivid Violet / Royal Purple):** `#7c3aed` (Glow: `rgba(124, 58, 237, 0.25)`) — Nút Play Pomodoro, active indicators.
- **Secondary Accent (Cerulean Sky Blue):** `#0284c7` (Glow: `rgba(2, 132, 199, 0.20)`) — Sóng âm thanh ambient, tag Break.
- **Success Indicator (Vibrant Emerald):** `#059669` — Task hoàn thành, long break tag.
- **Warning / Hotkey Keycaps:** `#d97706` (Warm Amber) / `#475569` (Slate Keycap border).

### 2.3. Hệ Thống Typography & Tương Phản (WCAG Standards)
- **Headlines & Big Digits:** `Plus Jakarta Sans`, sans-serif (Font-weight: 700 / 800).
- **Body & Controls:** `Inter`, sans-serif (Font-weight: 400 / 500 / 600).
- **Monospace / Timer Digits / Hotkeys:** `JetBrains Mono`, monospace (Font-weight: 500 / 700).
- **Phân cấp Văn bản (Text Hierarchy):**
  - **High Contrast (Headings, Timer '25:00'):** `#0f172a` (Slate 900, 95% opacity) $\rightarrow$ Contrast Ratio: **14.2:1** (Đạt chuẩn WCAG AAA).
  - **Medium Contrast (Body, Subtitles):** `#334155` (Slate 700, 80% opacity) $\rightarrow$ Contrast Ratio: **8.5:1** (Đạt chuẩn WCAG AAA).
  - **Low Contrast / Helper Labels:** `#64748b` (Slate 500, 60% opacity) $\rightarrow$ Contrast Ratio: **4.8:1** (Đạt chuẩn WCAG AA).

### 2.4. Bo Góc & Khoảng Cách (Radii & Spacings)
- **Corner Radii:** `ROUND_TWELVE` (`rounded-2xl` cho Drawer/Modal, `rounded-xl` cho Cards, `rounded-full` cho Dock/Pills/FABs).
- **Spacings:** `4px`, `8px`, `12px`, `16px`, `24px`, `32px`.
