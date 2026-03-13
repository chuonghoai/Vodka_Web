import { Injectable, signal } from '@angular/core';
import { AppNotification, NotificationType } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // Quản lý mảng các thông báo đang hiển thị
  notifications = signal<AppNotification[]>([]);
  private idCounter = 0;

  // Hàm được gọi từ bất kỳ đâu trong app
  show(type: NotificationType, message: string) {
    const id = this.idCounter++;
    const newNotif: AppNotification = { id, type, message };

    // Thêm thông báo mới vào mảng
    this.notifications.update(notifs => [...notifs, newNotif]);

    // Tự động tắt sau 3 giây (3000ms)
    setTimeout(() => {
      this.remove(id);
    }, 3000);
  }

  // Hàm xóa thông báo (dùng cho nút tắt X hoặc tự động tắt)
  remove(id: number) {
    this.notifications.update(notifs => notifs.filter(n => n.id !== id));
  }
}
