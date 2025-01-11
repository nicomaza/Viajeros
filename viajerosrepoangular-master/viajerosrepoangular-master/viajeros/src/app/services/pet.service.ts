import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { PetResponseDto } from '../models/Mascotas/PetResponseDto';
import { NewPetRequestDto } from '../models/Mascotas/NewPetRequestDto';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PetService {
 



  private apiUrl = 'http://localhost:8080/api/pet';

  constructor(private http: HttpClient) { }
  // Método para obtener el token de localStorage y configurarlo en los headers

  petForEdit!: PetResponseDto;

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }


  setPetForEdit(pet: any) {
    this.petForEdit = pet;
  }
  getPetForEdit() {
    return this.petForEdit;
  }
  // Obtener todas las mascotas de un usuario
  getAllPetsByUser(): Observable<PetResponseDto[]> {
    const headers = this.getAuthHeaders();  // Obtener los headers actualizados con el token
    const id = localStorage.getItem('userId');

    if (!id) {
      Swal.fire("Error", "Token o ID de usuario no encontrado.", "error");
      return throwError(() => new Error('Token o ID de usuario no encontrado.'));
    }
    return this.http.get<PetResponseDto[]>(`${this.apiUrl}/user/${id}`, { headers });
  }

  // Crear una nueva mascota
  createNewPet(newPetRequest: NewPetRequestDto): Observable<PetResponseDto> {

    const headers = this.getAuthHeaders();
    return this.http.post<PetResponseDto>(`${this.apiUrl}/create`, newPetRequest, { headers });
  }
  deletePet(idPet: number) {
    
  
    const headers = this.getAuthHeaders();

    return this.http.delete<PetResponseDto>(`${this.apiUrl}/delete/${idPet}`, { headers })
  }

  updatePet(newPetRequest: PetResponseDto): Observable<PetResponseDto> {

    const headers = this.getAuthHeaders();
    return this.http.put<PetResponseDto>(`${this.apiUrl}/update/${newPetRequest.idPet}`, newPetRequest, { headers });
  }

}