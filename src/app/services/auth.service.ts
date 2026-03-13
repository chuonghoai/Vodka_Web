import { ApiResponse } from './../models/api-response.model';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { Observable, delay, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { API_ENDPOINTS } from './api-endpoints/api.endpoints';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  private platformId = inject(PLATFORM_ID);
  currentUser = signal<any>(null);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      if (token && userStr) {
        this.currentUser.set(JSON.parse(userStr));
      }
    }
  }

  updateCurrentUserState(user: any) {
    this.currentUser.set(user);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  // Login
  login(email: string, pass: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}${API_ENDPOINTS.AUTH.LOGIN}`, { email, password: pass })
      .pipe(
        tap((res) => {
          if (res.success && res.data) {
            if (res.data.accessToken) localStorage.setItem('accessToken', res.data.accessToken);

            if (res.data.user) {
              localStorage.setItem('user', JSON.stringify(res.data.user));
              this.currentUser.set(res.data.user);
            }
          }
        })
      );
  }

  // Logout
  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
    this.currentUser.set(null);
  }

  // Request OTP reset password
  requestPasswordReset(email: string): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.baseUrl}${API_ENDPOINTS.AUTH.FORGOT_SEND_OTP}`, { email });
  }

  // Verify otp
  verifyOtp(email: string, otp: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}${API_ENDPOINTS.AUTH.FORGOT_VERIFY_OTP}`, { email, otp });
  }

  // Reset password
  resetPassword(email: string, resetToken: string, newPass: string): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.baseUrl}${API_ENDPOINTS.AUTH.FORGOT_RESET}`, { email, resetToken, newPassword: newPass });
  }

  // Request OTP register
  requestRegister(email: string): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.baseUrl}${API_ENDPOINTS.AUTH.REGISTER_SEND_OTP}`, { email });
  }

  // Register
  register(email: string, otp: string, pass: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}${API_ENDPOINTS.AUTH.REGISTER}`, { email, otp, password: pass })
      .pipe(
        tap((res) => {
          if (res.success && res.data) {
            if (res.data.accessToken) localStorage.setItem('accessToken', res.data.accessToken);
            if (res.data.user) {
              this.updateCurrentUserState(res.data.user);
            }
          }
        })
      );
  }
}
