import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationResponseDto } from '../models/Notifications/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:8080/api/notifications';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders | undefined {
    const token = localStorage.getItem('token');
    if (token) {
      return new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json');
    }
    return undefined; // Retornar undefined en lugar de null
  }

  getNotificationsByUserId(userId: number): Observable<NotificationResponseDto[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<NotificationResponseDto[]>(`${this.apiUrl}/user/${userId}`, { headers });
  }

  markNotificationAsRead(notificationId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/${notificationId}/mark-as-read`, {}, { headers, responseType:'text' });
  }
}