import { ApiResponse } from './../models/api-response.model';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { Observable, delay, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { API_ENDPOINTS } from './api-endpoints/api.endpoints';
import { isPlatformBrowser } from '@angular/common';
import { UserState } from '../core/states/user.state';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private userState = inject(UserState);
  private baseUrl = environment.apiUrl;

  private handleAuthSuccess(res: ApiResponse<any>) {
    if (res.success && res.data) {
      if (res.data.accessToken && typeof window !== 'undefined') {
        localStorage.setItem('accessToken', res.data.accessToken);
      }
      if (res.data.user) {
        this.userState.setUser(res.data.user);
      }
    }
  }

  // Login
  login(email: string, pass: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}${API_ENDPOINTS.AUTH.LOGIN}`, { email, password: pass })
      .pipe(tap(res => this.handleAuthSuccess(res)));
  }

  // Logout
  logout() {
    this.userState.clearUser();
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
      .pipe(tap(res => this.handleAuthSuccess(res)));
  }
}
