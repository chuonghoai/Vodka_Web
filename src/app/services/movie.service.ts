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

  getMovieById(id: string): Observable<ApiResponse<MovieDetail>> {
    return this.http.get<ApiResponse<MovieDetail>>(`${this.baseUrl}${API_ENDPOINTS.MOVIES.BY_ID(id)}`);
  }

  getMovies(filters: { keyword?: string, genres?: string[], tag?: string, page?: number, pageSize?: number }) {
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
}
