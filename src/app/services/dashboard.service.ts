import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment.development";
import { ApiResponse } from "../models/api-response.model";
import { ActivityDto, DashboardStats } from "../models/dashboard.model";
import { API_ENDPOINTS } from "./api-endpoints/api.endpoints";

@Injectable({ providedIn: 'root' })
export class DashboardService {

  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  /**
   * Admin Dashboard Stats
   * GET: /api/admin/dashboard/stats
   */
  getStats(): Observable<ApiResponse<DashboardStats>> {
    return this.http.get<ApiResponse<DashboardStats>>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.DASHBOARD_STATS}`
    );
  }

  /**
   * Admin Dashboard Activities
   * GET /api/admin/dashboard/activities
   */
  getActivities(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    entityType?: string;
  }): Observable<ApiResponse<ActivityDto[]>> {
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.entityType) httpParams = httpParams.set('entityType', params.entityType);

    return this.http.get<ApiResponse<ActivityDto[]>>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.DASHBOARD_ACTIVITIES}`,
      { params: httpParams }
    );
  }
}
