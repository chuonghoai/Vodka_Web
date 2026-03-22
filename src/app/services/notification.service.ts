import { Injectable, signal } from '@angular/core';
import { AppNotification, NotificationType } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notifications = signal<AppNotification[]>([]);
  private idCounter = 0;

  show(type: NotificationType, message: string) {
    const id = this.idCounter++;
    const newNotif: AppNotification = { id, type, message };

    this.notifications.update(notifs => [...notifs, newNotif]);

    setTimeout(() => {
      this.remove(id);
    }, 3000);
  }

  remove(id: number) {
    this.notifications.update(notifs => notifs.filter(n => n.id !== id));
  }
}
