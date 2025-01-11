export enum NotificationStatus {
    UNREAD = 'UNREAD',
    READ = 'READ'
  }
  
  export enum NotificationType {
    TRIP_STARTED = 'TRIP_STARTED',
    TRIP_FINISHED = 'TRIP_FINISHED',
    TRIP_CANCELLED = 'TRIP_CANCELLED',
    UNREAD_MESSAGE = 'UNREAD_MESSAGE'
  }
  
  export interface NotificationResponseDto {
    id: number;
    message: string;
    status: NotificationStatus;
    timestamp: number[]; // Cambia de string a number[]
    type: NotificationType;
  }
  