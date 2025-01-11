import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { NewCarRequestDto } from '../../models/Vehicle/NewCarRequestDto';
import { PetResponseDto } from '../../models/Mascotas/PetResponseDto';
import { PetService } from '../../services/pet.service';
import { NewPetRequestDto } from '../../models/Mascotas/NewPetRequestDto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-mascota',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './edit-mascota.component.html',
  styleUrl: './edit-mascota.component.css'
})
export class EditMascotaComponent {

  petUpdate: FormGroup;
  newPetRequestDto!: PetResponseDto;
  petselected!: PetResponseDto;

  constructor(private petService: PetService, private fb: FormBuilder, private router: Router) {
    this.petUpdate = this.fb.group({
      idType: ['', Validators.required],
      idSize: ['', [Validators.required]],
      name: ['', [Validators.required]],
      canil: ['', [Validators.required]]
    });
  }
  ngOnInit(): void {
    this.petselected = this.petService.getPetForEdit();
    console.log(this.petselected)
    if (this.petselected) {
      // Cargar los valores del vehículo en el formulario
      this.petUpdate.patchValue(this.petselected);
    }
  }

  submitPetForm() {
    // Asignar los valores del formulario a la variable newvehiclerequest
    this.newPetRequestDto = this.petUpdate.value;
    this.newPetRequestDto.idPet = this.petselected.idPet;

    console.log(this.newPetRequestDto);
    // Llamar al servicio para registrar el vehículo
    this.petService.updatePet(this.newPetRequestDto).subscribe(
      (response) => {
        // Manejo de respuesta exitosa
        Swal.fire("Éxito", "La mascota ha sido actualizada con éxito", "success");
        this.router.navigate(['/mis-mascotas'])

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

}
