import { Component, signal, OnDestroy, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ForgotPassword } from './forgot-password/forgot-password';
import { AddProfile } from './add-profile/add-profile';
import { AuthService } from '../../services/auth.service';
import { handleHttpError } from '../../shared/util/exception.handle';
import { NotificationService } from '../../services/notification.service';
import { NotificationType as NotifType } from '../../models/notification.model';
import { GoogleSigninButtonModule, SocialAuthService } from '@abacritt/angularx-social-login';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterModule, ForgotPassword, AddProfile, GoogleSigninButtonModule],
  templateUrl: './auth.html',
})
export class Auth implements OnDestroy {
  // Injection
  private router = inject(Router);
  private authService = inject(AuthService);
  private notif = inject(NotificationService);
  private socialAuthService = inject(SocialAuthService);

  private authSubscription!: Subscription;

  viewMode = signal<'login' | 'register' | 'forgot' | 'add-profile'>('login');

  // State manager
  isLoading = signal<boolean>(false);
  isSendingOTP = signal<boolean>(false);
  errorMessage = signal<string>('');
  otpCountdown = signal<number>(0);
  private countdownInterval: any;

  /**
   * Chuyển đổi qua lại giữa chế độ Đăng nhập (login) và Đăng ký (register)
   */
  toggleMode() {
    this.viewMode.update(m => m === 'login' ? 'register' : 'login');
    this.errorMessage.set('');
  }

  /**
   * Chuyển sang màn hình Quên mật khẩu
   */
  goToForgot() { this.viewMode.set('forgot'); this.errorMessage.set(''); }

  /**
   * Quay lại màn hình Đăng nhập
   */
  backToLogin() { this.viewMode.set('login'); this.errorMessage.set(''); }

  /**
   * Kết thúc luồng xác thực (Login/Register xong) -> Điều hướng về trang chủ
   */
  finishAuthFlow() { this.router.navigate(['/']); }

  // Init
  ngOnInit() {
    this.authSubscription = this.socialAuthService.authState.subscribe((user) => {
      if (user && user.idToken) {
        this.handleGoogleLogin(user.idToken);
      }
    });
  }

  ngOnDestroy() {
    if (this.authSubscription)  this.authSubscription.unsubscribe();
    if (this.countdownInterval) clearInterval(this.countdownInterval);
  }

  /**
   * Xử lý đăng nhập bằng Google ID Token
   * @param idToken Token trả về từ Google SDK
   */
  handleGoogleLogin(idToken: string) {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.loginWithGoogle(idToken).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success) {
          this.notif.show(NotifType.SUCCESS, 'Đăng nhập thành công! Chào mừng ' + res.data.user.fullName);
          this.finishAuthFlow();
        } else {
          this.errorMessage.set(res.message);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(handleHttpError(err));
      }
    });
  }

  /**
   * Xử lý sự kiện Submit Đăng nhập bằng Email & Password
   */
  onLogin(email: string, pass: string) {
    if (!email || !pass) {
      this.errorMessage.set('Vui lòng nhập email và mật khẩu.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login(email, pass).subscribe({
      next: (res) => {
        console.log(res);
        this.isLoading.set(false);
        if (res.success) {
          this.notif.show(NotifType.SUCCESS, 'Đăng nhập thành công! Chào mừng ' + res.data.user.fullName)
          this.finishAuthFlow();
        } else {
          this.errorMessage.set(res.message);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(handleHttpError(err));
      }
    });
  }

  /**
   * Yêu cầu gửi OTP đăng ký về Email
   * Kích hoạt bộ đếm ngược 30 giây để tránh spam
   */
  sendOtp(email: string) {
    if (!email) {
      this.errorMessage.set('Vui lòng nhập email để nhận mã OTP.');
      return;
    }
    if (this.otpCountdown() > 0) return;

    this.errorMessage.set('');
    this.isSendingOTP.set(true);

    this.authService.requestRegister(email).subscribe({
      next: (res) => {
        this.isSendingOTP.set(false);
        if (res.success) {
          this.notif.show(NotifType.SUCCESS, 'Mã OTP đã được gửi đến ' + email);
          this.otpCountdown.set(30);
          this.countdownInterval = setInterval(() => {
            if (this.otpCountdown() > 0) this.otpCountdown.update(c => c - 1);
            else clearInterval(this.countdownInterval);
          }, 1000);
        } else {
          this.errorMessage.set(res.message);
        }
      },
      error: (err) => {
        this.isSendingOTP.set(false);
        this.errorMessage.set(handleHttpError(err));
      }
    });
  }

  /**
   * Xử lý gửi thông tin Đăng ký tài khoản
   * Sau khi tài khoản được tạo, tự động chuyển qua form Nhập sơ yếu lý lịch (Profile)
   */
  onRegister(email: string, otp: string, pass: string, confirmPass: string) {
    if (!email || !otp || !pass) {
      this.errorMessage.set('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    if (pass !== confirmPass) {
      this.errorMessage.set('Mật khẩu nhập lại không khớp.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.register(email, otp, pass).subscribe({
      next: (res) => {
        console.log('Đăng ký thành công' + res);
        console.log(res);
        this.notif.show(NotifType.SUCCESS, 'Đăng ký thành công, vui lòng cập nhật hồ sơ')
        this.isLoading.set(false);
        if (res.success) {
          this.viewMode.set('add-profile');
        } else {
          this.errorMessage.set(res.message);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(handleHttpError(err));
      }
    });
  }
}
