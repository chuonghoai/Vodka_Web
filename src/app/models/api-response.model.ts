export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    totalItems: number; // Tổng số phim có trong Database
    totalPages: number;  // Tổng số trang (ví dụ: 100 phim / 10 phim mỗi trang = 10 trang)
    currentPage: number; // Trang hiện tại
    pageSize: number;    // Số lượng phim mỗi trang
  }
}
