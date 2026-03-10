import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Login
  login(email: string, pass: string): Observable<ApiResponse<any>> {
    const isValid = email === 'test@gmail.com' && pass === '123456';
    return of({
      success: isValid,
      message: isValid ? 'Đăng nhập thành công' : 'Sai email hoặc mật khẩu (Test: test@gmail.com / 123456)',
      data: isValid ? { token: 'mock-jwt-token', user: { name: 'Người dùng test' } } : null
    }).pipe(delay(1000));
  }

  // Request OTP reset password
  requestPasswordReset(email: string): Observable<ApiResponse<null>> {
    return of({ success: true, message: 'Mã OTP đã được gửi đến email của bạn.', data: null }).pipe(delay(800));
  }

  // Verify otp
  verifyOtp(email: string, otp: string): Observable<ApiResponse<boolean>> {
    const isValid = otp === '123456';
    return of({
      success: isValid,
      message: isValid ? 'Xác thực thành công.' : 'Mã OTP không hợp lệ.',
      data: isValid
    }).pipe(delay(1000));
  }

  // Reset password
  resetPassword(email: string, newPass: string): Observable<ApiResponse<null>> {
    return of({ success: true, message: 'Đổi mật khẩu thành công.', data: null }).pipe(delay(800));
  }

  // Request OTP register
  requestRegister(email: string): Observable<ApiResponse<null>> {
    return of({ success: true, message: 'Mã OTP đã được gửi đến email của bạn.', data: null }).pipe(delay(800));
  }

  // Register
  register(email: string, otp: string, pass: string): Observable<ApiResponse<null>> {
    const isValidOtp = otp === '123456';
    return of({
      success: isValidOtp,
      message: isValidOtp ? 'Đăng ký thành công!' : 'Mã OTP không chính xác.',
      data: null
    }).pipe(delay(1000));
  }

  // update profile
  updateProfile(data: any): Observable<ApiResponse<null>> {
    return of({ success: true, message: 'Cập nhật hồ sơ thành công.', data: null }).pipe(delay(800));
  }
}
