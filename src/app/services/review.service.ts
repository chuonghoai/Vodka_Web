import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { API_ENDPOINTS } from './api-endpoints/api.endpoints';
import { ApiResponse } from '../models/api-response.model';
import { Review } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getReviewsByMovieId(movieId: string, page: number = 1, limit: number = 10): Observable<ApiResponse<Review[]>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<ApiResponse<Review[]>>(`${this.baseUrl}${API_ENDPOINTS.REVIEWS.BY_MOVIE(movieId)}`, { params });
  }

  postReview(payload: { movieId: string; rating?: number; content: string; replyToId?: string }): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}${API_ENDPOINTS.REVIEWS.NEW}`, payload);
  }
}
