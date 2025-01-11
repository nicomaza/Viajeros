import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewCarRequestDto } from '../../models/Vehicle/NewCarRequestDto';
import { CarResponseDto } from '../../models/Vehicle/CarResponseDto';
import { VehicleService } from '../../services/vehicle.service';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehicle-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './vehicle-edit.component.html',
  styleUrl: './vehicle-edit.component.css'
})
export class VehicleEditComponent {

  updateCar: FormGroup;
  newvehiclerequest!: CarResponseDto ;
  carselected!: CarResponseDto | undefined; // Ahora puede ser undefined

  constructor(private vehicleService: VehicleService, private fb: FormBuilder, private router: Router) {
    this.updateCar = this.fb.group({
      brand: ['', Validators.required],
      model: ['', [Validators.required]],
      patent: ['', [Validators.required]],
      color: ['', [Validators.required]],
      fuel: ['', Validators.required],
      gnc: ['', Validators.required],
      kml: ['']
    });
  }
  ngOnInit(): void {
    this.carselected = this.vehicleService.getCarForEdit();

    if (this.carselected) {
      // Cargar los valores del vehículo en el formulario
      this.updateCar.patchValue(this.carselected);
    }
  }



  submitCarForm() {
    // Asignar los valores del formulario a la variable newvehiclerequest
    if (this.updateCar.valid && this.carselected) {
      // Asignar los valores del formulario a newvehiclerequest, manteniendo el idCar del vehículo seleccionado
      this.newvehiclerequest = {
        ...this.updateCar.value,
        idCar: this.carselected.idCar, // Asegurar que idCar se mantenga
        deleted: this.carselected.deleted // Mantener el valor de 'deleted' si es relevante
      };
    // Llamar al servicio para registrar el vehículo
    this.vehicleService.updateVehicle(this.newvehiclerequest).subscribe(
      (response) => {
        // Manejo de respuesta exitosa
        Swal.fire("Éxito", "El vehículo ha sido actualizado con éxito", "success");
        this.router.navigate(['/vehicle'])

        // Aquí puedes redirigir a otra página si es necesario o limpiar el formulario
      },
      (error) => {
        // Manejo de errores
        console.error('Error al registrar el vehículo:', error);
        Swal.fire("Error", "Hubo un problema al registrar el vehículo", "error");
      }
    );
  }

}
}
