import { User } from './../models/user.model';
import { inject, Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { ApiResponse } from "../models/api-response.model";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "../../environments/environment.development";
import { API_ENDPOINTS } from "./api-endpoints/api.endpoints";
import { AuthService } from "./auth.service";
import { UserState } from "../core/states/user.state";
import { Movie } from "../models/movie.model";

@Injectable({
  providedIn: 'root'
})
export class UserService{
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private userState = inject(UserState);
  private baseUrl = environment.apiUrl;

  /**
   * Update User Profile
   * Cập nhật thông tin cá nhân của người dùng
   * PUT /api/user/profile
   */
  updateProfile(data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}${API_ENDPOINTS.USER.PROFILE}`, data)
      .pipe(
        tap((res) => {
          if (res.success && res.data) {
            const userData = res.data.updatedUser ? res.data.updatedUser : res.data;
            this.userState.updateUser(userData);
          }
        })
      );
  }

  /**
   * Get User Profile
   * Lấy thông tin cá nhân của người dùng đang đăng nhập
   * GET /api/user/profile
   */
  getProfile(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}${API_ENDPOINTS.USER.PROFILE}`);
  }

  /**
   * Get User Favorites
   * Lấy danh sách phim yêu thích của người dùng (có phân trang)
   * GET /api/user/favorites
   */
  getFavorites(page: number = 1, pageSize: number = 40): Observable<ApiResponse<Movie[]>> {
    const params = new HttpParams().set('page', page.toString()).set('pageSize', pageSize.toString());
    return this.http.get<ApiResponse<Movie[]>>(`${this.baseUrl}${API_ENDPOINTS.USER.FAVORITES}`, { params });
  }

  /**
   * Get User Movie History
   * Lấy lịch sử xem phim của người dùng (có phân trang)
   * GET /api/user/movie-history
   */
  getHistory(page: number = 1, pageSize: number = 40): Observable<ApiResponse<any[]>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}${API_ENDPOINTS.USER.MOVIE_HISTORY}`, { params });
  }

  /**
   * Get User Reviews
   * Lấy danh sách review mà người dùng đã đăng (có phân trang)
   * GET /api/user/reviews
   */
  getReviews(page: number = 1, pageSize: number = 40): Observable<ApiResponse<any[]>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}${API_ENDPOINTS.USER.REVIEWS}`, { params });
  }

  /**
   * Change Password
   * Đổi mật khẩu cho người dùng hiện tại
   * PUT /api/user/change-password
   */
  changePassword(oldPassword: string, newPassword: string, confirmNewPassword: string) {
    return this.http.put(`${this.baseUrl}${API_ENDPOINTS.USER.CHANGE_PASSWORD}`, { oldPassword, newPassword, confirmNewPassword });
  }
}
