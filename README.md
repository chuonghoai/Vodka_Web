# Vodka Web - Giao diện Nền tảng Đánh giá và Xem Phim

## 1. Tính năng chính
Ứng dụng **Vodka Web** cung cấp một giao diện hiện đại, trực quan và tối ưu cho trải nghiệm người dùng trong việc khám phá và thưởng thức điện ảnh:

### Dành cho Người dùng (User Experience)
- **Trang chủ (Home):** Hiển thị các bộ phim nổi bật, phim mới cập nhật và danh sách phim theo xu hướng.
- **Khám phá & Tìm kiếm:** Hệ thống tìm kiếm mạnh mẽ cùng bộ lọc phim linh hoạt theo thể loại, nhãn (tags) và điểm đánh giá.
- **Chi tiết phim:** Xem thông tin chi tiết về phim, diễn viên, nội dung và các bài đánh giá từ cộng đồng.
- **Xem phim trực tuyến:** Trình phát video (Video Player) tích hợp, hỗ trợ trải nghiệm xem phim mượt mà.
- **Hệ thống đánh giá:** Cho phép người dùng gửi bình luận, chấm điểm và tương tác với cộng đồng.
- **Quản lý tài khoản (Profile):** Cập nhật thông tin cá nhân, ảnh đại diện và theo dõi hoạt động cá nhân.
- **Hệ thống thông báo:** Nhận thông báo trực quan về các cập nhật mới hoặc phản hồi từ hệ thống.
- **Xác thực:** Hỗ trợ đăng nhập/đăng ký truyền thống, đăng nhập qua Google (OAuth2) và khôi phục mật khẩu.

### Bảng điều khiển Quản trị (Admin Panel)
- **Tổng quan (Dashboard):** Biểu đồ và số liệu thống kê về sự phát triển của nền tảng.
- **Quản lý nội dung:** Giao diện thêm mới, chỉnh sửa và quản lý danh sách phim (kèm upload video/ảnh).
- **Quản lý phân loại:** Quản trị danh mục Thể loại (Genres) và Nhãn (Tags).
- **Điều hướng người dùng:** Quản lý danh sách thành viên, phân quyền và trạng thái tài khoản.
- **Kiểm duyệt đánh giá:** Theo dõi và xử lý các bình luận từ người dùng.
- **Nhật ký hoạt động:** Xem lịch sử các thay đổi và tác động hệ thống.

## 2. Công nghệ sử dụng
Dự án được xây dựng trên nền tảng Web hiện đại, đảm bảo tính thẩm mỹ và hiệu năng cao:
- **Framework:** [Angular 21](https://angular.io/) (Phiên bản mới nhất với Standalone Components).
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) mang lại giao diện tùy biến cực cao và responsive mượt mà.
- **Quản lý bất đồng bộ:** [RxJS](https://rxjs.dev/) xử lý các luồng dữ liệu (streams) hiệu quả.
- **Authentication:** [@abacritt/angularx-social-login](https://www.npmjs.com/package/@abacritt/angularx-social-login) tích hợp đăng nhập mạng xã hội.
- **Xử lý hình ảnh:** [ngx-image-cropper](https://www.npmjs.com/package/ngx-image-cropper) hỗ trợ cắt chỉnh ảnh đại diện.
- **Công cụ xây dựng:** Angular CLI & npm.

## 3. Kiến trúc hệ thống
Giao diện được tổ chức theo mô hình thành phần (Component-based architecture) của Angular, chia tách rõ ràng các lớp trách nhiệm:
- **Core:** Chứa các Singleton Services, Interceptors, Guards và cấu hình chung dùng xuyên suốt ứng dụng.
- **Features:** Chia theo từng module tính năng (Admin, Auth, Movie, Watch, Search, User...) giúp dễ dàng bảo trì và mở rộng.
- **Shared:** Các UI Components dùng chung (Components, Pipes, Util).
- **Models:** Định nghĩa các Interface và Type cho dữ liệu từ API.
- **Services:** Lớp trung gian thực hiện việc giao tiếp với Backend qua HTTP Client.

## 4. Cấu hình Environment
Để tùy chỉnh URL của Server hoặc các thông số khác, bạn có thể thay đổi trong các file tại thư mục `src/environments/`:
- `environment.ts` (Sản xuất)
- `environment.development.ts` (Phát triển)

**Mặc định ứng dụng kết nối tới:** `http://localhost:8081`

## 5. Cách cài đặt và chạy project
Để khởi chạy ứng dụng **Vodka Web** trên máy cục bộ, hãy thực hiện các bước sau:

1. **Yêu cầu:** Đảm bảo máy đã cài đặt [Node.js](https://nodejs.org/) (khuyên dùng v18+).
2. **Tải dependencies:**
   ```bash
   npm install
   ```
3. **Khởi chạy Development Server:**
   ```bash
   npm start
   ```
   Hoặc:
   ```bash
   ng serve
   ```
4. **Truy cập:** Mở trình duyệt tại `http://localhost:4200`. Ứng dụng sẽ tự động tải lại khi bạn thay đổi mã nguồn.

## 6. Đóng góp
Chúng tôi hoan nghênh mọi sự đóng góp để cải thiện dự án!
1. Fork dự án.
2. Tạo nhánh tính năng mới (`git checkout -b feature/AmazingFeature`).
3. Commit các thay đổi (`git commit -m 'Add some AmazingFeature'`).
4. Push nhánh lên GitHub (`git push origin feature/AmazingFeature`).
5. Mở một Pull Request.

## 7. Credits / Author
- **Dự án được thực hiện bởi:** 
    - Trương Hoài Chương
    - Phan Phúc Hậu
    - Nguyễn Hữu Văn
- **Môn học:** Công nghệ phần mềm hướng đối tượng (OOSE).
- **Trường:** Đại học Công nghệ Kỹ thuật TP.HCM (HCMUTE).

---
*Dự án này là mã nguồn mở và được tạo ra với mục đích học tập.*
