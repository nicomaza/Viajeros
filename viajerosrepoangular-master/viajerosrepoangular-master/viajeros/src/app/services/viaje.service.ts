import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NewTripRequestDto } from '../models/Viajes/NewTripRequestDto';
import { Observable } from 'rxjs';
import { ViajesRequestMatchDto } from '../models/Viajes/ViajesRequestMatchDto';
import { SearchResultMatchDto } from '../models/Viajes/SearchResultMatchDto';
import { IsChoferDto } from '../models/Chat/IsChoferDto';
import { PassengersDto } from '../models/Viajes/PassengersDto';
import { IncidenteDto } from '../models/Viajes/IncidenteDto';

@Injectable({
  providedIn: 'root'
})
export class ViajeService {

  private readonly apiUrl = 'http://localhost:8080/api/viajes';  // Cambiar a la URL correcta

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
  serFlagAllTrips() {
    this.flagAllTrips = true;
  }
  saveRequestBusqueda(request: ViajesRequestMatchDto): void {
    localStorage.setItem('viajesRequestMatch', JSON.stringify(request));
  }
  // Método para obtener la request guardada en el localStorage
  getRequestBusqueda(): ViajesRequestMatchDto | null {
    const storedRequest = localStorage.getItem('viajesRequestMatch');
    return storedRequest ? JSON.parse(storedRequest) : null;
  }
  // Método para buscar viajes por origen (ahora es POST)
  buscarViajesPorOrigen(request: ViajesRequestMatchDto): Observable<SearchResultMatchDto[]> {
    const headers = this.getAuthHeaders();
    return this.http.post<SearchResultMatchDto[]>(`${this.apiUrl}/origen`, request, { headers });
  }

  // Método para obtener todos los viajes excepto el origen (ahora es POST)
  obtenerTodosLosViajesExceptOrigin(request: ViajesRequestMatchDto): Observable<SearchResultMatchDto[]> {
    const headers = this.getAuthHeaders();
    return this.http.post<SearchResultMatchDto[]>(`${this.apiUrl}/todosCreated`, request, { headers });
  }





  // Método para registrar un viaje
  registerTrip(newTrip: NewTripRequestDto): Observable<string> {
    const headers = this.getAuthHeaders();  // Método para obtener los headers con autenticación
    return this.http.post<string>(`${this.apiUrl}/register`, newTrip, {
      headers,
      responseType: 'text' as 'json'  // Indica que esperas texto como respuesta
    });
  }
  // Método para buscar viajes por origen y destino
  buscarViajesorigenydestino(viajesRequestMatchDto: ViajesRequestMatchDto): Observable<SearchResultMatchDto[]> {
    const headers = this.getAuthHeaders();
    return this.http.post<SearchResultMatchDto[]>(`${this.apiUrl}/buscarorigenydestino`, viajesRequestMatchDto, { headers });
  }




  // Llamada para obtener los viajes creados e incompletos
  getAllCreatedAndInProgressByUser(): Observable<SearchResultMatchDto[]> {
    const headers = this.getAuthHeaders();
    const userId = localStorage.getItem('userId');
    return this.http.get<SearchResultMatchDto[]>(`${this.apiUrl}/user/${userId}/created-inprogress`, { headers });
  }

  // Llamada para obtener los viajes finalizados
  getAllFinishedByUser(): Observable<SearchResultMatchDto[]> {
    const headers = this.getAuthHeaders();
    const userId = localStorage.getItem('userId');
    return this.http.get<SearchResultMatchDto[]>(`${this.apiUrl}/user/${userId}/finished`, { headers });
  }

  deleteTrip(tripId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/delete/${tripId}`, {}, { headers, responseType: 'text' });
  }

  getAllCreatedTrips(): Observable<SearchResultMatchDto[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<SearchResultMatchDto[]>(`${this.apiUrl}/trips/created`, { headers });
  }

  // Método para obtener el id del chofer por id de viaje
  getChoferByTrip(idTrip: number): Observable<number> {
    const headers = this.getAuthHeaders();
    return this.http.get<number>(`${this.apiUrl}/getChofer?idTrip=${idTrip}`, { headers });
  }
  soyChoferDelViaje(tripId: number, userId: number): Observable<IsChoferDto> {
    const headers = this.getAuthHeaders();
    return this.http.get<IsChoferDto>(`${this.apiUrl}/isChofer/${tripId}/${userId}`, { headers });
  }

  // Método para obtener el viaje por su ID
  getTripById(tripId: number): Observable<SearchResultMatchDto> {
    const headers = this.getAuthHeaders();
    return this.http.get<SearchResultMatchDto>(`${this.apiUrl}/trip/${tripId}`, { headers });
  }

  // Método para obtener los pasajeros de un viaje específico por su ID
  getPassengersByTripId(tripId: number): Observable<PassengersDto[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<PassengersDto[]>(`${this.apiUrl}/passengers/${tripId}`, { headers });
  }
  // Método para eliminar un pasajero de un viaje y solicitar reintegro
  deletePassengerFromTrip(tripId: number, userId: number): Observable<any> {
    const url = `${this.apiUrl}/${tripId}/remove-passenger/${userId}`;

    const headers = this.getAuthHeaders();

    return this.http.post(url, {}, { headers, responseType: 'text' as 'json' });
  }
  finalizarViaje(tripId: number): Observable<any> {
    const headers = this.getAuthHeaders();

    return this.http.post(`${this.apiUrl}/${tripId}/finalizar`, {}, { headers, responseType: 'text' as 'json' });
  }
  // Método para obtener el viaje por su ID
  getTripByIdForEdit(tripId: number): Observable<NewTripRequestDto> {
    const headers = this.getAuthHeaders();
    return this.http.get<NewTripRequestDto>(`${this.apiUrl}/getEdit/${tripId}`, { headers });
  }

  updateTrip(tripId: number, tripData: NewTripRequestDto): Observable<any> {
    const headers = this.getAuthHeaders(); // Obtenemos los headers con el token
    const url = `${this.apiUrl}/trip/${tripId}`; // URL del endpoint de actualización
    return this.http.put<any>(url, tripData, { headers });
  }
  getGastoTotalViaje(id: string): Observable<number> {
    const headers = this.getAuthHeaders();
    return this.http.get<number>(`${this.apiUrl}/gastototalviaje/${id}`, { headers });
  }

}
