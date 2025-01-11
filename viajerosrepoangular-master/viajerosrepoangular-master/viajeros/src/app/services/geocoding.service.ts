import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {

  private apiKey = 'AIzaSyBashs0F2jJ24miPysl_t7gQnrs3l0DAF8';  // Reemplaza con tu clave de Google Maps API
  private geocodingUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

  constructor(private http: HttpClient) { }

  // Método para obtener latitud y longitud de una localidad
  getLatLong(address: string): Observable<any> {
    const url = `${this.geocodingUrl}?address=${encodeURIComponent(address)}&key=${this.apiKey}`;
    return this.http.get(url);
  }

   // Método para calcular la distancia y tiempo entre origen y destino
   getDistanceAndTime(origin: string, destination: string): Observable<any> {
     const url = `/api/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${this.apiKey}&mode=driving`;
    return this.http.get(url);
  }


}
