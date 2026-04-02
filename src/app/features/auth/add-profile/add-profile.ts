import { Component, inject, signal, output } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { MediaService } from '../../../services/admin/media.service';
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
  private mediaService = inject(MediaService);
  private notif = inject(NotificationService);

  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');
  onComplete = output<void>();
  onSkip = output<void>();

  // Avatar state
  avatarPreview = signal<string | null>(null);
  private avatarFile: File | null = null;

  // Chọn ảnh avatar từ file input
  onAvatarSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    this.avatarFile = file;
    this.avatarPreview.set(URL.createObjectURL(file));
  }

  async submitProfile(displayName: string, phone: string) {
    if (!displayName) {
      this.errorMessage.set('Vui lòng nhập tên hiển thị.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      // Payload
      const payload: any = { displayName, phone };

      // Nếu có ảnh avatar upload lên Cloudinary trước
      if (this.avatarFile) {
        const res = await this.mediaService.uploadToCloudinary(this.avatarFile, 'image');
        payload.avatarUrl = res.secure_url;
      }

      // Gọi API cập nhật hồ sơ
      this.userService.updateProfile(payload).subscribe({
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
    } catch (err) {
      this.isLoading.set(false);
      this.errorMessage.set('Lỗi khi upload ảnh đại diện, vui lòng thử lại.');
      console.error('Upload avatar error:', err);
    }
  }
}
