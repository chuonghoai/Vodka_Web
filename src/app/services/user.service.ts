import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "../models/api-response.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment.development";
import { API_ENDPOINTS } from "./api-endpoints/api.endpoints";

@Injectable({
  providedIn: 'root'
})
export class UserService{
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  // update profile
  updateProfile(data: any): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.baseUrl}${API_ENDPOINTS.USER.PROFILE}`, data);
  }
}
