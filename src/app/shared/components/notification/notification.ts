import { Component, inject } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';
import { NotificationType } from '../../../models/notification.model';

@Component({
  selector: 'app-notification',
  standalone: true,
  templateUrl: './notification.html',
})
export class NotificationComponent {
  notificationService = inject(NotificationService);

  NotificationType = NotificationType;
}
