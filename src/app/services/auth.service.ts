import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // 1. Gửi mã OTP về email
  requestPasswordReset(email: string): Observable<ApiResponse<null>> {
    return of({ success: true, message: 'Mã OTP đã được gửi đến email của bạn.', data: null }).pipe(delay(800));
  }

  // 2. Xác thực OTP (Giả lập mã đúng là 123456)
  verifyOtp(email: string, otp: string): Observable<ApiResponse<boolean>> {
    const isValid = otp === '123456';
    return of({
      success: isValid,
      message: isValid ? 'Xác thực thành công.' : 'Mã OTP không hợp lệ.',
      data: isValid
    }).pipe(delay(1000));
  }

  // 3. Đổi mật khẩu mới
  resetPassword(email: string, newPass: string): Observable<ApiResponse<null>> {
    return of({ success: true, message: 'Đổi mật khẩu thành công.', data: null }).pipe(delay(800));
  }
}
