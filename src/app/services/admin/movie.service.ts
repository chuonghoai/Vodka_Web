import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../api-endpoints/api.endpoints';
import { ApiResponse } from '../../models/api-response.model';
import { MovieRow, SummaryStats } from '../../features/admin/models/movie.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AdminMovieService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  /**
   * Admin Get Movies: Lấy danh sách phim kèm phân trang, tìm kiếm và lọc
   * GET /api/admin/movies?page=&pageSize=&search=&year=&sort=
   */
  getMovies(params: any): Observable<ApiResponse<MovieRow[]>> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        httpParams = httpParams.set(key, params[key]);
      }
    });
    return this.http.get<ApiResponse<MovieRow[]>>(`${this.baseUrl}${API_ENDPOINTS.ADMIN.MOVIES}`, { params: httpParams });
  }

  /**
   * Admin Get Movie Stats: Thống kê chỉ số phim, lượt xem, tổng phim
   * GET /api/admin/movies/stats
   */
  getMovieStats(): Observable<ApiResponse<SummaryStats>> {
    return this.http.get<ApiResponse<SummaryStats>>(`${this.baseUrl}${API_ENDPOINTS.ADMIN.MOVIE_STATS}`);
  }

  /**
   * Admin Get Genres: Lấy danh sách thể loại cho Dropdown
   * GET /api/genres
   */
  getGenres(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}${API_ENDPOINTS.GENRES.GET_ALL}`);
  }

  /**
   * Admin Get Movie By Id: Lấy thông tin chi tiết một bộ phim
   * GET /api/admin/movies/:id
   */
  getMovieById(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}${API_ENDPOINTS.ADMIN.MOVIES}/${id}`);
  }

  /**
   * Admin Create Movie: Tạo mới một bộ phim
   * POST /api/admin/movies
   */
  createMovie(payload: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}${API_ENDPOINTS.ADMIN.MOVIES}`, payload);
  }

  /**
   * Admin Update Movie: Cập nhật thông tin của phim
   * PUT /api/admin/movies/:id
   */
  updateMovie(id: number, payload: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}${API_ENDPOINTS.ADMIN.MOVIES}/${id}`, payload);
  }

  /**
   * Admin Delete Movie: Xóa một bộ phim khỏi hệ thống
   * DELETE /api/admin/movies/:id
   */
  deleteMovie(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}${API_ENDPOINTS.ADMIN.MOVIES}/${id}`);
  }
}