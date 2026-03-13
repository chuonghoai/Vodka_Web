import { inject, Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { ApiResponse } from "../models/api-response.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment.development";
import { API_ENDPOINTS } from "./api-endpoints/api.endpoints";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class UserService{
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  private authService = inject(AuthService);

  // update profile
  updateProfile(data: any): Observable<ApiResponse<any>> { // Đổi <null> thành <any>
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}${API_ENDPOINTS.USER.PROFILE}`, data)
      .pipe(
        tap((res) => {
          if (res.success && res.data) {
            this.authService.updateCurrentUserState(res.data);
          }
        })
      );
  }
}
