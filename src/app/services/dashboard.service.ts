import { HttpClient } from "@angular/common/http";
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
  getActivities(): Observable<ApiResponse<ActivityDto[]>> {
    return this.http.get<ApiResponse<ActivityDto[]>>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.DASHBOARD_ACTIVITIES}`
    )
  }
}
