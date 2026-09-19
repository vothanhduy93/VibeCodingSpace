# VibeSpace Backend & Cloud Synchronization Architecture (v1.0)

## 1. Tổng Quan Kiến Trúc (Architecture Overview)

Hệ thống backend của **VibeSpace** được thiết kế theo kiến trúc **Offline-First & Hybrid Cloud Sync**, bảo tồn trọn vẹn trải nghiệm "Zero-Friction Guest Mode" (không ép buộc người dùng đăng nhập), đồng thời cung cấp khả năng đồng bộ đa thiết bị tức thì và lưu trữ lịch sử tập trung Pomodoro an toàn khi người dùng đăng nhập.

```
+-------------------------------------------------------------------------+
|                           CLIENT (Vite 6 + React 19)                    |
|  - Offline Guest Mode (localStorage)                                    |
|  - SyncEngine (Delta Sync, Offline Queue, LWW Conflict Resolution)      |
|  - useAuthStore (Google OAuth + Passwordless Magic Link)                |
|  - useTodoStore, useBackgroundStore, useSoundMixerStore, usePomodoro    |
+-------------------------------------------------------------------------+
                                   |
                  HTTPS / WSS (CORS + HttpOnly Cookies)
                                   v
+-------------------------------------------------------------------------+
|                         BACKEND (Fastify 5 + TypeScript)                |
|  - Security Layer: @fastify/helmet, @fastify/cors, @fastify/rate-limit  |
|  - Auth Layer: @fastify/jwt + @fastify/cookie (Dual Bearer + Cookie)    |
|  - Validation: Zod Schema Guards                                        |
|  - Routes:                                                              |
|      * /api/v1/health (Liveness & Database Probe)                       |
|      * /api/v1/auth/* (Google OAuth, Magic Link, Profile, Logout)       |
|      * /api/v1/sync/* (merge-local, pull, push)                         |
|      * /api/v1/analytics/* (pomodoro-complete, stats heatmap)           |
+-------------------------------------------------------------------------+
                                   |
                          Prisma ORM (v6.4.1)
                                   v
+-------------------------------------------------------------------------+
|                           DATA PERSISTENCE                              |
|  - Development / Testing: SQLite (dev.db, zero-dependency)             |
|  - Production: PostgreSQL (Neon / Supabase / Railway)                  |
+-------------------------------------------------------------------------+
```

---

## 2. Mô Hình Dữ Liệu (Database Schema)

Hệ thống sử dụng Prisma ORM với 5 thực thể chính:

1. **User (`users`)**:
   - `id`: UUID (Khóa chính)
   - `email`: Chuỗi định danh độc nhất
   - `name`: Tên hiển thị người dùng
   - `avatar`: URL ảnh đại diện
   - `authProvider`: "google" | "magic-link"
   - `createdAt`, `updatedAt`: Dấu thời gian

2. **TodoItem (`todo_items`)**:
   - `id`: Khóa chính (Client UUID hoặc Server UUID)
   - `userId`: Liên kết User (Foreign Key Cascade)
   - `text`: Nội dung công việc
   - `completed`: Trạng thái hoàn thành (Boolean)
   - `order`: Vị trí sắp xếp
   - `createdAt`, `updatedAt`: Dấu thời gian
   - `deletedAt`: Dấu thời gian xóa mềm (Soft delete cho delta sync)

3. **PomodoroLog (`pomodoro_logs`)**:
   - `id`: UUID
   - `userId`: Liên kết User
   - `duration`: Thời lượng tập trung (giây)
   - `mode`: "pomodoro" | "shortBreak" | "longBreak"
   - `completedAt`: Dấu thời gian hoàn thành
   - `date`: Định dạng "YYYY-MM-DD" để truy vấn bản đồ nhiệt tốc độ cao

4. **UserSettings (`user_settings`)**:
   - `id`: UUID
   - `userId`: Liên kết User 1-1
   - `wallpaper`: ID hình nền phong cảnh đã chọn
   - `customWallpaperUrl`: URL ảnh/video tùy chọn
   - `soundVolumes`: Chuỗi JSON lưu trữ âm lượng 5 kênh tiếng ồn trắng
   - `language`: "vi" | "en"
   - `pomodoroSettings`: Chuỗi JSON cấu hình thời lượng chu kỳ
   - `updatedAt`: Dấu thời gian cập nhật

5. **MagicLinkToken (`magic_link_tokens`)**:
   - `id`: UUID
   - `email`: Địa chỉ nhận liên kết
   - `token`: Chuỗi mã hóa crypto 64 ký tự hex
   - `expiresAt`: Thời điểm hết hạn (15 phút)
   - `used`: Trạng thái đã sử dụng (chống tấn công replay)

---

## 3. Giao Thức Đồng Bộ & Không Mất Dữ Liệu (Zero Data Loss Protocol)

### 3.1. Smart Local-to-Cloud Merge (`POST /api/v1/sync/merge-local`)
Khi một khách vãng lai đã tạo nhiều việc cần làm và thiết lập âm thanh trên trình duyệt quyết định bấm Đăng nhập:
- Toàn bộ dữ liệu trong `localStorage` được gom gói và gửi lên endpoint merge.
- Backend thực hiện upsert:
  - Nếu ID công việc chưa tồn tại trong cloud: Tự động nạp vào cloud.
  - Nếu đã tồn tại: So khớp `updatedAt` theo nguyên tắc Last-Write-Wins (LWW).
  - Lịch sử Pomodoro cục bộ được đẩy vào cơ sở dữ liệu (tự động loại trừ trùng lặp timestamp).
- Người dùng không bao giờ bị mất bất kỳ ghi chú hay cài đặt nào tạo trong phiên khách.

### 3.2. Two-Way Delta Sync (`GET /api/v1/sync/pull` & `POST /api/v1/sync/push`)
- **Pull**: Truy vấn chỉ những bản ghi thay đổi kể từ mốc thời gian `since` (`updatedAt >= since`), bao gồm cả các bản ghi có `deletedAt != null` để client xóa bỏ khỏi giao diện.
- **Push**: Gửi danh sách các thay đổi từ client với dấu thời gian ISO 8601. Server chỉ áp dụng cập nhật khi `clientUpdatedAt >= serverUpdatedAt`.

---

## 4. Bảo Mật & Phòng Ngự Chiều Sâu (Security Hardening)

Áp dụng đầy đủ các nguyên tắc từ tiêu chuẩn `backend-security-coder`:
1. **Quản lý Session**: Token JWT được lưu trong Cookie mang cờ `HttpOnly: true`, `Secure: true` (trên production), `SameSite: 'lax'`/`'none'`, bảo vệ tuyệt đối trước các đòn tấn công XSS trích xuất token. Hỗ trợ song song Bearer Authorization header cho môi trường cross-origin.
2. **Rate Limiting**: Giới hạn 120 requests/phút trên toàn bộ API, trả về mã trạng thái chuẩn `HTTP 429 Too Many Requests` khi vượt ngưỡng.
3. **Helmet Security Headers**: Tự động chèn các tiêu chuẩn `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, loại bỏ header lộ công nghệ `X-Powered-By`.
4. **CORS Whitelist**: Chỉ cho phép các domain được cấp phép rõ ràng (`localhost:3000`, `localhost:5173`, `https://vothanhduy93.github.io`) với `credentials: true`.
5. **Zero Stack Leak**: Không bao giờ trả về stack trace nội bộ ra ngoài phản hồi API trong môi trường production.

---

## 5. Hướng Dẫn Khởi Chạy & Kiểm Thử (Running & Testing)

### Khởi chạy Backend cục bộ:
```powershell
cd backend
npm install
npx prisma db push
npm run dev
```
Backend sẽ lắng nghe tại: `http://localhost:4000`.

### Khởi chạy Frontend cục bộ:
```powershell
npm run dev
```
Frontend sẽ lắng nghe tại: `http://localhost:3000`.

### Chạy toàn bộ 51 bài kiểm thử tự động:
```powershell
npm test
```
(Bao gồm 38 unit tests frontend và 13 integration tests backend, 100% PASS).
