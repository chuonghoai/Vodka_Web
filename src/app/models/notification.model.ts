export enum NotificationType {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  INFO = 'INFO'
}

export interface AppNotification {
  id: number;
  type: NotificationType;
  message: string;
}
