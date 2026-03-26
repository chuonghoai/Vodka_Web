import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { ApiResponse } from "../models/api-response.model";
import { CreateGenreRequest, GenreDetail, GenreStats, UpdateGenreRequest } from "../models/genre.model";
import { Observable } from "rxjs";
import { API_ENDPOINTS } from "./api-endpoints/api.endpoints";



@Injectable({providedIn: 'root'})
export class GenreService {

    private http = inject(HttpClient);
    private baseUrl = environment.apiUrl;

    /**
   * GET /api/admin/genres?page=&pageSize=&search=&sort=
   * Lấy danh sách genre cho admin với phân trang
   */
  getGenres(params:{
    page?: number;
    pageSize?: number;
    search?: string;
    sort?: string;
  }): Observable<ApiResponse<GenreDetail[]>> {
    let httpParams = new HttpParams();
    if (params.page) httpParams = httpParams.set('page', params.page.toString());
    if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.sort) httpParams = httpParams.set('sort', params.sort);

    return this.http.get<ApiResponse<GenreDetail[]>>(
        `${this.baseUrl}${API_ENDPOINTS.ADMIN.GENRES}`,
        {params: httpParams}
    )

  }


  /**
   * GET /api/admin/genres/stats
   * Lấy thống kê tổng quan
   */

  getGenreStats(): Observable<ApiResponse<GenreStats>> {
    return this.http.get<ApiResponse<GenreStats>>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.GENRE_STATS}`
    )
  }

  /**
   * GET /api/admin/genres/:id
   * Lấy chi tiết 1 genre
   */
  getGenreById(id: number) :Observable<ApiResponse<GenreDetail>> {
    return this.http.get<ApiResponse<GenreDetail>>(
         `${this.baseUrl}${API_ENDPOINTS.ADMIN.GENRE_BY_ID(id)}`
    )
  }

  /**
   * POST /api/admin/genres
   * Tạo genre mới
   */
  createGenre(data: CreateGenreRequest): Observable<ApiResponse<GenreDetail>> {
    return this.http.post<ApiResponse<GenreDetail>>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.GENRES}`,
      data
    )
  }

  /**
   * PUT /api/admin/genres/:id
   * Cập nhật genre
   */
  updateGenre(id: number, data: UpdateGenreRequest): Observable<ApiResponse<GenreDetail>> {
    return this.http.put<ApiResponse<GenreDetail>>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.GENRE_BY_ID(id)}`,
      data
    )
  }

  /**
   * DELETE /api/admin/genres/:id
   * Xóa genre
   */
  deleteGenre(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.GENRE_BY_ID(id)}`
    )
  }

    
}