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

  // Get movies data have pagination
  getMovies(params: any): Observable<ApiResponse<MovieRow[]>> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        httpParams = httpParams.set(key, params[key]);
      }
    });
    return this.http.get<ApiResponse<MovieRow[]>>(`${this.baseUrl}${API_ENDPOINTS.ADMIN.MOVIES}`, { params: httpParams });
  }

  // Get movie stats
  getMovieStats(): Observable<ApiResponse<SummaryStats>> {
    return this.http.get<ApiResponse<SummaryStats>>(`${this.baseUrl}${API_ENDPOINTS.ADMIN.MOVIE_STATS}`);
  }

  // Get tags for Dropdown
  getGenres(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}${API_ENDPOINTS.GENRES.GET_ALL}`);
  }
}