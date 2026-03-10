import { Component, inject, signal, output } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-add-profile',
  standalone: true,
  templateUrl: './add-profile.html'
})
export class AddProfile {
  private authService = inject(AuthService);

  isLoading = signal<boolean>(false);

  // Phát sự kiện ra ngoài (dùng được ở cả trang Auth và trang Profile sau này)
  onComplete = output<void>();
  onSkip = output<void>();

  submitProfile(displayName: string, phone: string) {
    if (!displayName) return;
    this.isLoading.set(true);

    this.authService.updateProfile({ displayName, phone }).subscribe(res => {
      this.isLoading.set(false);
      if (res.success) {
        this.onComplete.emit(); // Hoàn tất
      }
    });
  }
}
