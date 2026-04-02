// src/app/services/movie.service.ts
import { ApplicationRef, inject, Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Movie, MovieDetail } from '../models/movie.model';
import { ApiResponse } from '../models/api-response.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { API_ENDPOINTS } from './api-endpoints/api.endpoints';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  /**
   * Get Featured Movies
   * Lấy danh sách phim nổi bật (đề xuất)
   * GET /api/movies/featured
   */
  getFeaturedMovies(): Observable<ApiResponse<Movie[]>> {
    return this.http.get<ApiResponse<Movie[]>>(`${this.baseUrl}${API_ENDPOINTS.MOVIES.FEATURED}`);
  }

  /**
   * Get New Releases
   * Lấy danh sách phim mới phát hành
   * GET /api/movies/new-release
   */
  getNewReleases(page: number = 1, pageSize: number = 30): Observable<ApiResponse<Movie[]>> {
    const params = new HttpParams().set('page', page.toString()).set('pageSize', pageSize.toString());
    return this.http.get<ApiResponse<Movie[]>>(`${this.baseUrl}${API_ENDPOINTS.MOVIES.NEW_RELEASES}`, { params });
  }

  /**
   * Get Trending Movies
   * Lấy danh sách phim thịnh hành (top lượt xem)
   * GET /api/movies/trending
   */
  getTrendingMovies(limit: number = 10): Observable<ApiResponse<Movie[]>> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<ApiResponse<Movie[]>>(`${this.baseUrl}${API_ENDPOINTS.MOVIES.TRENDING}`, { params });
  }

  /**
   * Get Watched History (Generic/Home)
   * Lấy danh sách phim người dùng đã xem gần đây
   * GET /api/movies/history
   */
  getWatchedHistory(): Observable<ApiResponse<Movie[]>> {
    return this.http.get<ApiResponse<Movie[]>>(`${this.baseUrl}${API_ENDPOINTS.MOVIES.HISTORY}`);
  }

  /**
   * Get Recently Updated Movies
   * Lấy danh sách phim mới cập nhật (tập mới, v.v)
   * GET /api/movies/recently-updated
   */
  getRecentlyUpdated(): Observable<ApiResponse<Movie[]>> {
    return this.http.get<ApiResponse<Movie[]>>(`${this.baseUrl}${API_ENDPOINTS.MOVIES.RECENTLY_UPDATED}`);
  }

  /**
   * Get Highly Rated Movies
   * Lấy danh sách phim được đánh giá cao nhất
   * GET /api/movies/highly-rated
   */
  getHighlyRated(): Observable<ApiResponse<Movie[]>> {
    return this.http.get<ApiResponse<Movie[]>>(`${this.baseUrl}${API_ENDPOINTS.MOVIES.HIGHLY_RATED}`);
  }

  /**
   * Get Movies By Genre
   * Lấy danh sách phim theo thể loại (slug)
   * GET /api/movies/genre/:slug
   */
  getMoviesByGenre(genre: string): Observable<ApiResponse<Movie[]>> {
    return this.http.get<ApiResponse<Movie[]>>(`${this.baseUrl}${API_ENDPOINTS.MOVIES.BY_GENRE(genre)}`);
  }

  /**
   * Get Movie Detail By Id
   * Lấy thông tin chi tiết phim (kèm mùa, tập, tag, reviews...)
   * GET /api/movies/:id
   */
  getMovieById(id: number): Observable<ApiResponse<MovieDetail>> {
    return this.http.get<ApiResponse<MovieDetail>>(`${this.baseUrl}${API_ENDPOINTS.MOVIES.BY_ID(id)}`);
  }

  /**
   * Filter Movies
   * Tìm kiếm phim nâng cao theo từ khóa, danh sách thể loại, tag, hỗ trợ phân trang
   * GET /api/movies/filter
   */
  filterMovies(filters: { keyword?: string, genres?: string[], tag?: string, page?: number, pageSize?: number }) {
    let params = new HttpParams();
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.pageSize) params = params.set('pageSize', filters.pageSize.toString());
    if (filters.tag) params = params.set('tag', filters.tag);
    if (filters.keyword) params = params.set('keyword', filters.keyword);

    if (filters.genres && filters.genres.length > 0) {
      filters.genres.forEach(g => params = params.append('genres', g));
    }

    return this.http.get<any>(`${this.baseUrl}${API_ENDPOINTS.MOVIES.BY_FILTER}`, { params });
  }

  /**
   * Toggle Favorite Movie
   * Lưu hoặc bỏ lưu phim vào danh sách yêu thích
   * POST /api/movies/:id/favorite
   */
  toggleFavorite(movieId: number): Observable<ApiResponse<{isFavorited: boolean}>> {
    return this.http.post<ApiResponse<{isFavorited: boolean}>>(`${this.baseUrl}${API_ENDPOINTS.MOVIES.FAVORITE(movieId)}`, {});
  }

  /**
   * Check Favorite Status
   * Kiểm tra xem phim này đã được yêu thích bởi user hiện tại chưa
   * GET /api/movies/:id/favorite-status
   */
  checkFavoriteStatus(movieId: number): Observable<ApiResponse<boolean>> {
    return this.http.get<ApiResponse<boolean>>(`${this.baseUrl}/api/movies/${movieId}/favorite-status`);
  }
}
