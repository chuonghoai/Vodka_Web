import { User } from './../models/user.model';
import { inject, Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { ApiResponse } from "../models/api-response.model";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "../../environments/environment.development";
import { API_ENDPOINTS } from "./api-endpoints/api.endpoints";
import { AuthService } from "./auth.service";
import { UserState } from "../core/states/user.state";
import { Movie } from "../models/movie.model";

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

  // Get profile
  getProfile(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}${API_ENDPOINTS.USER.PROFILE}`);
  }

  // Get movies favorite
  getFavorites(page: number = 1, pageSize: number = 40): Observable<ApiResponse<Movie[]>> {
    const params = new HttpParams().set('page', page.toString()).set('pageSize', pageSize.toString());
    return this.http.get<ApiResponse<Movie[]>>(`${this.baseUrl}${API_ENDPOINTS.USER.FAVORITES}`, { params })
  }

  // Get movies history
  getHistory(page: number = 1, pageSize: number = 40): Observable<ApiResponse<any[]>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}${API_ENDPOINTS.USER.MOVIE_HISTORY}`, { params });
  }
  // Get user's reviews
}
