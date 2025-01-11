import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { NewPetRequestDto } from '../../models/Mascotas/NewPetRequestDto';
import { PetResponseDto } from '../../models/Mascotas/PetResponseDto';
import { PetService } from '../../services/pet.service';

@Component({
  selector: 'app-mis-mascotas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './mis-mascotas.component.html',
  styleUrl: './mis-mascotas.component.css'
})
export class MisMascotasComponent {
  petUpdate: FormGroup;
  newPetRequestDto!:NewPetRequestDto;
  listPet!:PetResponseDto[];

  constructor(private petservice:PetService, private fb: FormBuilder, private router: Router) {
    this.petUpdate = this.fb.group({
      idType: ['', Validators.required],
      idSize: ['', [Validators.required]],
      name: ['', [Validators.required]],
      canil: ['', [Validators.required]]
    });
  }
  ngOnInit(): void {
    this.loadpetList(); // Cargar el listado de vehículos al iniciar el componente
  }

  loadpetList() {
    this.petservice.getAllPetsByUser().subscribe(
      (response) => {
        this.listPet = response;
      },
      (error) => {
        console.error('Error al cargar el listado de mascotas:', error);
      }
    );
  }

  submitPetForm() {
    // Asignar los valores del formulario a la variable newvehiclerequest
    this.newPetRequestDto = this.petUpdate.value;
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.newPetRequestDto.userId = parseInt(userId, 10); // El segundo argumento 10 asegura que se use base 10
    } else {
      console.error('User ID no encontrado en localStorage.');
      return; // Salir de la función si no se encuentra el userId
    }

    console.log(this.newPetRequestDto);
    // Llamar al servicio para registrar el vehículo
    this.petservice.createNewPet(this.newPetRequestDto).subscribe(
      (response) => {
        // Manejo de respuesta exitosa
        Swal.fire("Éxito", "La mascota ha sido registrada con éxito", "success");

        // Llamar a la función para actualizar el listado de vehículos
        this.loadpetList();
        this.petUpdate.reset();

        // Aquí puedes redirigir a otra página si es necesario o limpiar el formulario
      },
      (error) => {
        // Manejo de errores
        console.error('Error al registrar la masctora:', error);
        Swal.fire("Error", "Hubo un problema al registrar la mascota", "error");
      }
    );
  }



  // Función para editar un vehículo
  editPet(pet: PetResponseDto) {
    this.petservice.setPetForEdit(pet);
    this.router.navigate(['/edit-mascotas']);
  }

  // Función para borrar un vehículo
  deletepet(pet: PetResponseDto) {


    Swal.fire({
      title: "¿Seguro de eliminar la mascota?",
      text: "No podra revertir los cambios y se perderan los datos!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar"
    }).then((result) => {
      if (result.isConfirmed) {

        this.petservice.deletePet(pet.idPet).subscribe(
          (response) => {
            this.loadpetList();
            console.log(response)
          },
          (error) => {
            console.log(error)
          })
        Swal.fire({
          title: "Mascota eliminada!",
          icon: "success"
        });
      }
    });
   

  }
}
