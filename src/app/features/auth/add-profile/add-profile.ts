import { Component, inject, signal, output } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { handleHttpError } from '../../../shared/util/exception.handle';
import { NotificationService } from '../../../services/notification.service';
import { NotificationType } from '../../../models/notification.model';

@Component({
  selector: 'app-add-profile',
  standalone: true,
  templateUrl: './add-profile.html'
})
export class AddProfile {
  private userService = inject(UserService);
  private notif = inject(NotificationService);

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
        console.log('Thêm mới thông tin thành công: ' + res);
        this.isLoading.set(false);
        if (res.success) {
          this.notif.show(NotificationType.SUCCESS, 'Cập nhật hồ sơ thành công, chào mừng ' + res.data.updatedUser.fullName);
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
