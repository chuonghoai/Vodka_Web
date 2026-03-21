import { inject, Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { ApiResponse } from "../models/api-response.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment.development";
import { API_ENDPOINTS } from "./api-endpoints/api.endpoints";
import { AuthService } from "./auth.service";
import { UserState } from "../core/states/user.state";

@Injectable({
  providedIn: 'root'
})
export class UserService{
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private userState = inject(UserState);
  private baseUrl = environment.apiUrl;

  // update profile
  updateProfile(data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}${API_ENDPOINTS.USER.PROFILE}`, data)
      .pipe(
        tap((res) => {
          if (res.success && res.data) {
            const userData = res.data.updatedUser ? res.data.updatedUser : res.data;
            this.userState.updateUser(userData);
          }
        })
      );
  }
}
