import { ApiResponse } from './../models/api-response.model';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { Observable, delay, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { API_ENDPOINTS } from './api-endpoints/api.endpoints';
import { isPlatformBrowser } from '@angular/common';
import { UserState } from '../core/states/user.state';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private userState = inject(UserState);
  private platformId = inject(PLATFORM_ID);
  private socialAuthService = inject(SocialAuthService);
  private router = inject(Router);

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

    if (isPlatformBrowser(this.platformId)) {
      try {
        this.socialAuthService.signOut().catch(() => { });
      } catch (error) {
        console.error('Lỗi khi đăng xuất Google:', error);
      }
    }

    this.router.navigate(['/']);
  }

  // Request OTP reset password
  requestPasswordReset(email: string): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.baseUrl}${API_ENDPOINTS.AUTH.FORGOT_SEND_OTP}`, { email });
  }

  // Verify otp - forgot password
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

  // Login with google
  loginWithGoogle(idToken: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}${API_ENDPOINTS.AUTH.GOOGLE_LOGIN}`, { idToken })
      .pipe(tap(res => this.handleAuthSuccess(res)));
  }
}
