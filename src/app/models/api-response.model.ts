export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  }
}
