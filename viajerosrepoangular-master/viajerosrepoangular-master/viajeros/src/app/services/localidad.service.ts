import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalidadService {
 
  constructor(private http: HttpClient) { }

  private apiUrl = 'http://localhost:8080/api/localidades'; // Cambia por la URL de tu backend
  // Método para obtener los headers con el token
  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Obtenemos el token desde el localStorage
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`); // Configuramos el header Authorization si el token existe
    }
    return headers;
  }

  // Método para buscar localidades basado en un término de búsqueda (query)
  searchLocalidades(query: string): Observable<{ id: number, nombre: string }[]> {
    const headers = this.getHeaders(); // Obtenemos los headers
    const url = `${this.apiUrl}/search?query=${query}`; // La URL de la API con el query
    return this.http.get<{ id: number, nombre: string }[]>(url, { headers }); // Realizamos la petición HTTP GET
  }

   // Método para obtener una localidad por su ID
   // Método para obtener una localidad por su ID y devolver el nombre de la localidad
   getLocalidadById(id: number): Observable<{ localidad: string }> {
    const headers = this.getHeaders(); // Obtenemos los headers con el token
    const url = `${this.apiUrl}/id?id=${id}`; // Construimos la URL con el parámetro ID
    return this.http.get<{ localidad: string }>(url, { headers }); // Realizamos la petición HTTP GET
  }
  

}
