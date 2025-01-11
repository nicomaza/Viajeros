import { Component, Input } from '@angular/core';
import { CarResponseDto } from '../../models/Vehicle/CarResponseDto';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehicleService } from '../../services/vehicle.service';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/Admin/admin.service';

@Component({
  selector: 'app-vehiculos-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './vehiculos-edit.component.html',
  styleUrl: './vehiculos-edit.component.css'
})
export class VehiculosEditComponent {

  editFromUsers:boolean = false;
  carid:string = '';
  @Input() set id(id: string) {
    this.carid = id
  }

  updateCar: FormGroup;
  newvehiclerequest!: CarResponseDto ;
  carselected!: CarResponseDto | undefined; // Ahora puede ser undefined

  constructor(private vehicleService: VehicleService, private fb: FormBuilder, private router: Router, private adminservice:AdminService) {
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
    const id =this.carid;
    this.adminservice.getVehicleById(id).subscribe({
      next: (data) => {
        this.carselected = data;
        if (this.carselected) {
          // Cargar los valores del vehículo en el formulario
          this.updateCar.patchValue(this.carselected);
        }
      },
      error: (err) => {
        console.error('Error al obtener el vehículo:', err);
      }
    });
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
        this.router.navigate(['/admin/vehiculos'])

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
