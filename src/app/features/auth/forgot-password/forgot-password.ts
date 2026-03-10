import { Component, inject, signal, output } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.html'
})
export class ForgotPassword {
  private authService = inject(AuthService);

  step = signal<number>(1);
  isLoading = signal<boolean>(false);
  email = signal<string>('');
  otpArray = signal<string[]>(['', '', '', '', '', '']);
  errorMessage = signal<string>('');

  // Khai báo sự kiện gửi ra ngoài thay vì dùng Router
  onComplete = output<void>();
  onCancel = output<void>();

  submitEmail(emailInput: string) {
    if (!emailInput) return;
    this.email.set(emailInput);
    this.isLoading.set(true);
    this.authService.requestPasswordReset(emailInput).subscribe(res => {
      this.isLoading.set(false);
      if (res.success) this.step.set(2);
    });

    console.log(`OTP đã được gửi đến ${emailInput}`);
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
    this.authService.verifyOtp(this.email(), fullOtp).subscribe(res => {
      this.isLoading.set(false);
      if (res.success) {
        this.step.set(3);
        this.errorMessage.set('');
      } else {
        this.errorMessage.set(res.message);
      }
    });
  }

  submitNewPassword(newPass: string, confirmPass: string) {
    if (newPass !== confirmPass) {
      this.errorMessage.set('Mật khẩu không khớp!');
      return;
    }
    this.isLoading.set(true);
    this.authService.resetPassword(this.email(), newPass).subscribe(res => {
      this.isLoading.set(false);
      if (res.success) {
        // Hoàn tất thì phát sự kiện cho component cha
        this.onComplete.emit();

        // Reset lại form để lần sau vào lại là bước 1
        setTimeout(() => { this.step.set(1); this.otpArray.set(['','','','','','']); }, 500);
      }
    });
  }
}
