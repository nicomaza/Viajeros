import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IncidenteDto } from '../models/Viajes/IncidenteDto';
import { Observable } from 'rxjs';
import { Incidente } from '../models/Incidente/Incidente';
import { IncidenteForAdminDto } from '../models/Incidente/IncidenteForAdminDto';
import { ResolveIncidenteDto } from '../models/Incidente/ResolveIncidenteDto';

@Injectable({
  providedIn: 'root'
})
export class IncidentesService {  private readonly apiUrl = 'http://localhost:8080/api/incidentes';  // Cambiar a la URL correcta

  constructor(private http: HttpClient) { }

  flagAllTrips: boolean = false;
  // Método para obtener los headers con autenticación
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'  // Asegúrate de que sea JSON
    });
  }

   // Reportar un incidente
   reportIncident(incident: IncidenteDto): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/registrar/${incident.viajeId}`, incident, {headers});
  }

   // Obtener todos los incidentes
   getAllIncidentes(): Observable<IncidenteDto[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<IncidenteDto[]>(this.apiUrl, { headers });
  }

  
  resolverIncidente(idIncidente: number, resolveDto: ResolveIncidenteDto): Observable<IncidenteForAdminDto> {
    const headers = this.getAuthHeaders();
    return this.http.put<IncidenteForAdminDto>(`${this.apiUrl}/resolver/${idIncidente}`, resolveDto, { headers });
  }

  getIncidentesForAdmin(): Observable<IncidenteForAdminDto[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<IncidenteForAdminDto[]>(`${this.apiUrl}/admin`, { headers });
  }
}