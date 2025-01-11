import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ViajeDto } from '../../models/Admin/ViajeDto';
import { Observable } from 'rxjs';
import { UsuariosPorDiaDto } from '../../models/Admin/UsuariosPorDiaDto';
import { ViajesPorMesDto } from '../../models/Admin/ViajesPorMesDto';
import { EstadoViajesDto } from '../../models/Admin/EstadoViajesDto';
import { CarResponseDto } from '../../models/Vehicle/CarResponseDto';
import { PaymentStadisticDto } from '../../models/Admin/PaymentStadisticDto';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrlViajes = 'http://localhost:8080/api/admin/viajes';  // URL para viajes
  private apiUrlUsuarios = 'http://localhost:8080/api/user/nuevos-por-dia';  // URL para usuarios nuevos por día
  private apiUrlViajesFinalizados = 'http://localhost:8080/api/viajes/finalizados-por-mes';  // URL para viajes finalizados por mes
  private apiUrlEstadoViajes = 'http://localhost:8080/api/viajes/estado';  // URL para estado de los viajes

  constructor(private http: HttpClient) { }

  // Método para obtener el token de autenticación
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'  // Asegúrate de que sea JSON
    });
  }

  // Método para obtener los viajes con opción de filtrar por estado
  getViajes(estado?: string): Observable<ViajeDto[]> {
    const headers = this.getAuthHeaders();

    let params = new HttpParams();
    if (estado && estado !== 'TODOS') {
      params = params.append('status', estado);  // Añadir el parámetro del estado
    }

    return this.http.get<ViajeDto[]>(this.apiUrlViajes, { headers, params });
  }

  // Método para obtener los usuarios nuevos por día
  getUsuariosNuevosPorDia(): Observable<UsuariosPorDiaDto[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<UsuariosPorDiaDto[]>(this.apiUrlUsuarios, { headers });
  }

  // Método para obtener los viajes finalizados por mes
  getViajesFinalizadosPorMes(): Observable<ViajesPorMesDto[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<ViajesPorMesDto[]>(this.apiUrlViajesFinalizados, { headers });
  }

  // Método para obtener el estado de los viajes
  getEstadoDeLosViajes(): Observable<EstadoViajesDto[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<EstadoViajesDto[]>(this.apiUrlEstadoViajes, { headers });
  }

  // Método para obtener los viajes filtrados por rango de fechas
getViajesPorFecha(startDate: string, endDate: string): Observable<ViajeDto[]> {
  const headers = this.getAuthHeaders();

  // Agrega los parámetros de fecha
  const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

  return this.http.get<ViajeDto[]>(`${this.apiUrlViajes}/fecha`, { headers, params });
}


getAllVehicles(): Observable<CarResponseDto[]> {
  const headers = this.getAuthHeaders();
  return this.http.get<CarResponseDto[]>(`http://localhost:8080/api/vehicle/getAllVehicles`,{headers});
}


getVehicleById(id: string): Observable<CarResponseDto> {
  const headers = this.getAuthHeaders();
  return this.http.get<CarResponseDto>(`http://localhost:8080/api/vehicle/getCarById/${id}`,{headers});
}

getPaymentStatistics(): Observable<PaymentStadisticDto> {
  const headers = this.getAuthHeaders();
  return this.http.get<PaymentStadisticDto>('http://localhost:8080/api/statistics',{headers});
}


}