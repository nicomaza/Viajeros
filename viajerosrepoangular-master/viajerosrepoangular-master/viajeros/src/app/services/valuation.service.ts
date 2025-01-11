import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ValuationRequestDto } from '../models/Valuations/ValuationRequestDto';
import { ValuationResponseDto } from '../models/Valuations/ValuationResponseDto';

@Injectable({
  providedIn: 'root'
})
export class ValuationService {
  private apiUrl = 'http://localhost:8080/api/valuations'; // Cambia esta URL si es necesario

  constructor(private http: HttpClient) {}

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

  // Método para enviar una valoración (ValuationRequestDto)
  submitValuation(valuation: ValuationRequestDto): Observable<ValuationResponseDto> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      throw new Error('No se encontró el token de autenticación');
    }
    return this.http.post<ValuationResponseDto>(`${this.apiUrl}/submit`, valuation, { headers });
  }


  // Método para verificar si un pasajero ha sido calificado en un viaje
  hasPassengerBeenRated(idTrip: number, idPassenger: number): Observable<boolean> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      throw new Error('No se encontró el token de autenticación');
    }
    const params = { idTrip, idPassenger };
    return this.http.get<boolean>(`${this.apiUrl}/has-rated?idTrip=${idTrip}&idPassenger=${idPassenger}`, { headers });
  }
}
