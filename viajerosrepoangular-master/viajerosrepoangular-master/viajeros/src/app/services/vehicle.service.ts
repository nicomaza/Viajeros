import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { NewCarRequestDto } from '../models/Vehicle/NewCarRequestDto';
import { CarResponseDto } from '../models/Vehicle/CarResponseDto';
import Swal from 'sweetalert2';
import { UserService } from './user.service';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {


  private readonly apiUrl = 'http://localhost:8080/api/vehicle';  // Cambiar a la URL correcta
  private carForEdit!: CarResponseDto;

  constructor(private http: HttpClient, private loginService: LoginService) {}

  setCarForEdit(carResponseDto: CarResponseDto): void {
    this.carForEdit = carResponseDto;
  }

  getCarForEdit(): CarResponseDto | undefined {
    return this.carForEdit;
  }

  registerNewVehicle(newVehicle: NewCarRequestDto): Observable<CarResponseDto> {
    const headers = this.getAuthHeaders();

    if (!headers) {
      this.showError("Token o ID de usuario no encontrado.");
      return throwError(() => new Error('Token o ID de usuario no encontrado.'));
    }

    newVehicle.userId = this.getUserId();

    return this.http.post<CarResponseDto>(`${this.apiUrl}/register`, newVehicle, { headers })
      .pipe(
        catchError((error) => this.handleError('registrar el vehículo', error))
      );
  }

  getAllCars(): Observable<CarResponseDto[]> {
    const headers = this.getAuthHeaders();

    if (!headers) {
      this.showError("Token o ID de usuario no encontrado.");
      return throwError(() => new Error('Token o ID de usuario no encontrado.'));
    }

    return this.http.get<CarResponseDto[]>(`${this.apiUrl}/userVehicles/${this.getUserId()}`, { headers })
      .pipe(
        catchError((error) => this.handleError('obtener los vehículos del usuario', error))
      );
  }

  deleteCar(idCar: number): Observable<CarResponseDto> {
    const headers = this.getAuthHeaders();

    if (!headers) {
      this.showError("Token no encontrado.");
      return throwError(() => new Error('Token no encontrado.'));
    }

    return this.http.delete<CarResponseDto>(`${this.apiUrl}/delete/${idCar}`, { headers })
      .pipe(
        catchError((error) => this.handleError('eliminar el vehículo', error))
      );
  }

  // Métodos privados reutilizables para obtener el token y el userId
  private getAuthHeaders(): HttpHeaders | null {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    return new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
  }

  private getUserId(): number {
    const id = localStorage.getItem('userId');
    return id ? parseInt(id, 10) : 0;
  }

  // Manejo centralizado de errores
  private handleError(action: string, error: any): Observable<never> {
    console.error(`Error al ${action}:`, error);
    Swal.fire("Error", `Hubo un problema al ${action}`, "error");
    return throwError(() => error);
  }

  // Método para mostrar errores en SweetAlert
  private showError(message: string): void {
    Swal.fire("Error", message, "error");
  }

  updateVehicle(updatedVehicle: CarResponseDto): Observable<CarResponseDto> {
    const headers = this.getAuthHeaders();
  console.log(updatedVehicle)
    if (!headers) {
      this.showError("Token no encontrado.");
      return throwError(() => new Error('Token no encontrado.'));
    }
  
    return this.http.put<CarResponseDto>(`${this.apiUrl}/update/${updatedVehicle.idCar}`, updatedVehicle, { headers })
      .pipe(
        catchError((error) => this.handleError('actualizar el vehículo', error))
      );
  }
  
  
}

