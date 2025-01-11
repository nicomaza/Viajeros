import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReintegroDto } from '../models/Reintegro/ReintegroDto';
import { catchError, Observable, throwError } from 'rxjs';
import { UpdateReintegroDto } from '../models/Reintegro/UpdateReintegroDto';

@Injectable({
  providedIn: 'root'
})
export class ReintegroService {
  private apiUrl = 'http://localhost:8080/api/reintegros'; // Ajusta según sea necesario

  constructor(private http: HttpClient) { }
  // Método para obtener los encabezados de autorización
  private getAuthHeaders(): HttpHeaders | null {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    return new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
  }
  getAllReintegros(): Observable<ReintegroDto[]> {
    const headers = this.getAuthHeaders();
  
    if (!headers) {
      return throwError(() => new Error('Token no disponible'));
    }
  
    return this.http.get<ReintegroDto[]>(this.apiUrl, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al obtener los reintegros:', error.message);
        return throwError(() => new Error('Error en la solicitud de reintegros'));
      })
    );
  }
  
  updateReintegro(dto: UpdateReintegroDto): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.post(`${this.apiUrl}/update`, dto, { headers, responseType: 'text' });
  }

  
}