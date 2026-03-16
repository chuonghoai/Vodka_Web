import { Observable, delay, of } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { API_ENDPOINTS } from './api-endpoints/api.endpoints';
import { WatchDetailData } from '../models/watch.model';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class WatchService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getWatchDetail(episodeId: string): Observable<ApiResponse<WatchDetailData>> {
    return this.http.get<ApiResponse<WatchDetailData>>(`${this.baseUrl}${API_ENDPOINTS.MOVIES.WATCH(episodeId)}`);
  }
}
