// src/app/services/movie.service.ts
import { inject, Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Movie } from '../models/movie.model';
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

  // Fetch API
  getFeaturedMovies(): Observable<ApiResponse<Movie[]>> {
    return this.http.get<ApiResponse<Movie[]>>(`${this.baseUrl}${API_ENDPOINTS.MOVIES.FEATURED}`);
  }

  getNewReleases(page: number = 1, pageSize: number = 30): Observable<ApiResponse<Movie[]>> {
    const params = new HttpParams().set('page', page.toString()).set('pageSize', pageSize.toString());
    return this.http.get<ApiResponse<Movie[]>>(`${this.baseUrl}${API_ENDPOINTS.MOVIES.NEW_RELEASES}`, { params });
  }

  getTrendingMovies(limit: number = 10): Observable<ApiResponse<Movie[]>> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<ApiResponse<Movie[]>>(`${this.baseUrl}${API_ENDPOINTS.MOVIES.TRENDING}`, { params });
  }

  getWatchedHistory(): Observable<ApiResponse<Movie[]>> {
    return this.http.get<ApiResponse<Movie[]>>(`${this.baseUrl}${API_ENDPOINTS.MOVIES.HISTORY}`);
  }

  getRecentlyUpdated(): Observable<ApiResponse<Movie[]>> {
    return this.http.get<ApiResponse<Movie[]>>(`${this.baseUrl}${API_ENDPOINTS.MOVIES.RECENTLY_UPDATED}`);
  }

  getHighlyRated(): Observable<ApiResponse<Movie[]>> {
    return this.http.get<ApiResponse<Movie[]>>(`${this.baseUrl}${API_ENDPOINTS.MOVIES.HIGHLY_RATED}`);
  }

  getMoviesByGenre(genre: string): Observable<ApiResponse<Movie[]>> {
    return this.http.get<ApiResponse<Movie[]>>(`${this.baseUrl}${API_ENDPOINTS.MOVIES.BY_GENRE(genre)}`);
  }
}
