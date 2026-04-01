import { Component, inject, signal, output } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { handleHttpError } from '../../../shared/util/exception.handle';
import { NotificationService } from '../../../services/notification.service';
import { NotificationType } from '../../../models/notification.model';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.html'
})
export class ForgotPassword {
  private authService = inject(AuthService);
  private notif = inject(NotificationService);

  step = signal<number>(1);
  isLoading = signal<boolean>(false);
  email = signal<string>('');
  otpArray = signal<string[]>(['', '', '', '', '', '']);
  errorMessage = signal<string>('');
  resetToken = signal<string>('');

  onComplete = output<void>();
  onCancel = output<void>();

  submitEmail(emailInput: string) {
    if (!emailInput) return;
    this.email.set(emailInput);
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.requestPasswordReset(emailInput).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success) {
          this.notif.show(NotificationType.SUCCESS, 'Mã xác thực đã được gửi đến ' + emailInput);
          this.step.set(2);
        }
        else this.errorMessage.set(res.message);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(handleHttpError(err));
      }
    });
  }

  onOtpInput(event: any, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    const newOtp = [...this.otpArray()];
    newOtp[index] = value;
    this.otpArray.set(newOtp);

    if (value && index < 5) {
      const nextInput = input.nextElementSibling as HTMLInputElement;
      if (nextInput) nextInput.focus();
    } else if (event.key === 'Backspace' && index > 0 && !value) {
      const prevInput = input.previousElementSibling as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }

    const fullOtp = this.otpArray().join('');
    if (fullOtp.length === 6) this.verifyOtp(fullOtp);
    else this.errorMessage.set('');
  }

  verifyOtp(fullOtp: string) {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.verifyOtp(this.email(), fullOtp).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success) {
          this.resetToken.set(res.data.resetToken);
          this.notif.show(NotificationType.SUCCESS, 'Xác thực thành công, vui lòng đặt lại mật khẩu');
          this.step.set(3);
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

  submitNewPassword(newPass: string, confirmPass: string) {
    if (newPass !== confirmPass) {
      this.errorMessage.set('Mật khẩu không khớp!');
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.resetPassword(this.email(), this.resetToken(), newPass).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success) {
          this.notif.show(NotificationType.SUCCESS, 'Đặt lại mật khẩu thành công, vui lòng đăng nhập lại');
          this.onComplete.emit();
          setTimeout(() => {
            this.step.set(1);
            this.otpArray.set(['','','','','','']);
            this.resetToken.set('');
          }, 500);
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
