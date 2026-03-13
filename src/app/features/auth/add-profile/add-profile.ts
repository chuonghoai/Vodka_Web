import { Component, inject, signal, output } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { handleHttpError } from '../../../shared/util/exception.handle';

@Component({
  selector: 'app-add-profile',
  standalone: true,
  templateUrl: './add-profile.html'
})
export class AddProfile {
  private userService = inject(UserService);

  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');
  onComplete = output<void>();
  onSkip = output<void>();

  submitProfile(displayName: string, phone: string) {
    if (!displayName) {
      this.errorMessage.set('Vui lòng nhập tên hiển thị.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.userService.updateProfile({ displayName, phone }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success) {
          this.onComplete.emit();
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
