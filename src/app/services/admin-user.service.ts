import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment.development";
import { ApiResponse } from "../models/api-response.model";
import { AdminUserDetail, UserStats } from "../models/user.model";
import { API_ENDPOINTS } from "./api-endpoints/api.endpoints";

@Injectable({ providedIn: 'root' })
export class AdminUserService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  /**
   * Admin Get All Users: Phân trang, tìm kiếm và lọc danh sách người dùng
   * GET /api/admin/users?page=&pageSize=&search=&status=&provider=&gender=&sort=
   */
  getUsers(params: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
    provider?: string;
    gender?: string;
    sort?: string;
  }): Observable<ApiResponse<AdminUserDetail[]>> {
    let httpParams = new HttpParams();
    if (params.page) httpParams = httpParams.set('page', params.page.toString());
    if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.status) httpParams = httpParams.set('status', params.status);
    if (params.provider) httpParams = httpParams.set('provider', params.provider);
    if (params.gender) httpParams = httpParams.set('gender', params.gender);
    if (params.sort) httpParams = httpParams.set('sort', params.sort);

    return this.http.get<ApiResponse<AdminUserDetail[]>>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.USERS}`,
      { params: httpParams }
    )
  }

  /**
   * Admin Get User Stats: Thống kê tài khoản
   * GET /api/admin/users/stats
   */
  getUserStats(): Observable<ApiResponse<UserStats>> {
    return this.http.get<ApiResponse<UserStats>>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.USER_STATS}`
    );
  }

  /**
   * Admin Get User By Id: Lấy thông tin chi tiết một tài khoản
   * GET /api/admin/users/:id
   */
  getUserById(id: number): Observable<ApiResponse<AdminUserDetail>> {
    return this.http.get<ApiResponse<AdminUserDetail>>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.USER_BY_ID(id)}`
    );
  }

  /**
   * Admin Toggle Active/ InActive User: Khóa (hoặc mở khóa) tài khoản người dùng
   * PATCH /api/admin/users/:id/lock
   */
  toggleLock(id: number): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.USER_LOCK(id)}`,
      null
    );
  }

  /**
   * Admin Reset Password: Gửi mật khẩu ngẫu nhiên qua email
   * POST /api/admin/users/:id/reset-password
   */
  resetPassword(id: number): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.USER_RESET_PASSWORD(id)}`,
      null
    );
  }
}
