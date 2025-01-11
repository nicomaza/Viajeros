import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PreferenceTripDto } from '../models/Payments/PreferenceTripDto';

@Injectable({
  providedIn: 'root'
})
export class MercadopagoService { 
  private apiUrl = 'http://localhost:8080/api/mercadopago/crear-preferencia';

  constructor(private http: HttpClient) {}

  crearPreferencia(preferencetrip: PreferenceTripDto): Observable<any> {
    return this.http.post<any>(this.apiUrl, preferencetrip);
  }

  initMercadoPagoButton(preferenceId: string): void {
    const mp = new (window as any).MercadoPago('APP_USR-6dde02ef-5a92-4b88-a959-d4fb62cf9fa4'); 
    const bricksBuilder = mp.bricks();

    bricksBuilder.create('wallet', 'wallet_container', {
      initialization: {
        preferenceId: preferenceId
      },
      customization: {
        texts: {
          valueProp: 'smart_option',
        },
      },
      callbacks: {
        onError: (error: any) => console.error(error),
        onReady: () => { console.log('Checkout ready'); }
      }
    });
  }


  realizarReintegro(paymentId: string, amount?: number): Observable<any> {
    let url = `http://localhost:8080/api/mercadopago/reintegro/${paymentId}`;
  
    let params = new HttpParams();
    if (amount !== undefined) {
      params = params.set('amount', amount.toString());
    }
  
    // Ajustar la respuesta para tratarla como texto
    return this.http.post(url, null, { params, responseType: 'text' });
  }
  
}