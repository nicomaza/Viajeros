import { Component, OnInit } from '@angular/core';
import { PhoneNavbarComponent } from "../phone-navbar/phone-navbar.component";
import { CommonModule } from '@angular/common';
import { NotificationService } from '../services/notification.service';
import { NotificationResponseDto } from '../models/Notifications/notification';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [PhoneNavbarComponent, CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnInit {
  notifications: NotificationResponseDto[] = [];
  userid = 0;
  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications() {
    const Id = localStorage.getItem('userId');

    if (Id) {

      this.userid = parseInt(Id, 10);
    }
    this.notificationService.getNotificationsByUserId(this.userid).subscribe(

      (data) => {
        this.notifications = data
        console.log(data)
      },
      error => console.error('Error al obtener notificaciones:', error)
    );


  }
  markAsRead(notificationId: number): void {
    console.log('acaaaa notifi', notificationId)
    this.notificationService.markNotificationAsRead(notificationId).subscribe(
      () => { this.notifications = this.notifications.filter(n => n.id !== notificationId), this.loadNotifications() },
      error => console.error('Error al marcar notificación como leída:', error)
    );
  }


  convertTimestampToDate(timestamp: number[]): Date {
    const [year, month, day, hour, minute, second, nanosecond] = timestamp;
    return new Date(year, month - 1, day, hour, minute, second, nanosecond / 1000000);
  }

}