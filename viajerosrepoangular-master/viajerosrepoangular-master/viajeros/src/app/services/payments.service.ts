import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { PaymentDto } from '../models/Payments/PaymentsDto';
import { ResponsePaymentDto } from '../models/Payments/ResponsePaymentDto';
import { PagoPasajeroDto } from '../models/Admin/PagoPasajeroDto';
@Injectable({
  providedIn: 'root'
})
export class PaymentsService {


  private apiUrl = 'http://localhost:8080/api/register-payment'; // URL del endpoint

  constructor(private http: HttpClient) { }

  // Método para registrar el pago
  registerPayment(paymentDto: PaymentDto): Observable<any> {
    // Obtener el token del localStorage
    const token = localStorage.getItem('token');

    // Configurar los headers con el token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // Hacer la solicitud HTTP POST al backend
    return this.http.post<any>(this.apiUrl, paymentDto, { headers , responseType: 'text' as 'json' });
  }


  
  getPaymentById(id: number): Observable<ResponsePaymentDto> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('Token no encontrado.'));
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.get<ResponsePaymentDto>(`http://localhost:8080/api/payments/${id}`, { headers })
      .pipe(
        map(data => {
          // Asumiendo que la fecha llega como un array
          data.fechaPago = this.convertToDate(data.fechaPago);
          return data;
        }),
        catchError(error => {
          console.error('Failed to load payment details', error);
          return throwError(() => new Error('Failed to load payment details'));
        })
      );
  }
  convertToDate(dateArray: any): Date {
    if (Array.isArray(dateArray)) {
      return new Date(
        dateArray[0],   // año
        dateArray[1] - 1, // mes (0-based index)
        dateArray[2],   // día
        dateArray[3] || 0,  // hora
        dateArray[4] || 0,  // minuto
        dateArray[5] || 0,  // segundo
        dateArray[6] ? dateArray[6] / 1000000 : 0 // milisegundo, dividir nanosegundos para convertir
      );
    } else if (dateArray instanceof Date) {
      return dateArray;
    } else {
      console.error('Received an unsupported date format:', dateArray);
      return new Date(); // retornar fecha actual como fallback
    }
  }
  obtenerPagosPasajeros(): Observable<PagoPasajeroDto[]> {

    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('Token no encontrado.'));
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<PagoPasajeroDto[]>(`http://localhost:8080/api/listado-pasajeros`, {headers});
  }


  updateDriverPaymentStatus(requestDriverPaymentDto: { idPago: number; estado: string }) {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('Token no encontrado.'));
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put('http://localhost:8080/api/actualizar-estado', requestDriverPaymentDto, {headers, responseType: 'text'});
}
}
