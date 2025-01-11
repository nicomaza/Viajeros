import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { VehicleService } from '../../services/vehicle.service';
import { NewCarRequestDto } from '../../models/Vehicle/NewCarRequestDto';
import Swal from 'sweetalert2';
import { CarResponseDto } from '../../models/Vehicle/CarResponseDto';
import { routes } from '../../app.routes';

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.css'
})
export class VehicleComponent {
  updateCar: FormGroup;
  newvehiclerequest!: NewCarRequestDto;
  listVehicles!: CarResponseDto[];

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
    this.loadVehicleList(); // Cargar el listado de vehículos al iniciar el componente
  }

  loadVehicleList() {
    this.vehicleService.getAllCars().subscribe(
      (response) => {
        console.log(this.listVehicles)
        this.listVehicles = response;
      },
      (error) => {
        console.error('Error al cargar el listado de vehículos:', error);
      }
    );
  }

  submitCarForm() {
    // Asignar los valores del formulario a la variable newvehiclerequest
    this.newvehiclerequest = this.updateCar.value;

    // Llamar al servicio para registrar el vehículo
    this.vehicleService.registerNewVehicle(this.newvehiclerequest).subscribe(
      (response) => {
        // Manejo de respuesta exitosa
        Swal.fire("Éxito", "El vehículo ha sido registrado con éxito", "success");

        // Llamar a la función para actualizar el listado de vehículos
        this.loadVehicleList();
        this.updateCar.reset();

        // Aquí puedes redirigir a otra página si es necesario o limpiar el formulario
      },
      (error) => {
        // Manejo de errores
        console.error('Error al registrar el vehículo:', error);
        Swal.fire("Error", "Hubo un problema al registrar el vehículo", "error");
      }
    );
  }



  // Función para editar un vehículo
  editVehicle(vehicle: any) {
    this.vehicleService.setCarForEdit(vehicle);
    this.router.navigate(['/vehicle-edit']);
  }

  // Función para borrar un vehículo
  deleteVehicle(vehicle: CarResponseDto) {


    Swal.fire({
      title: "¿Seguro de eliminar el vehiculo?",
      text: "No podra revertir los cambios y se perderan los datos!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
console.log(vehicle)
        this.vehicleService.deleteCar(vehicle.idCar).subscribe(
          (response) => {
            this.loadVehicleList();
            console.log(response)
          },
          (error) => {
            console.log(error)
          })
        Swal.fire({
          title: "Vehiculo eliminado!",
          icon: "success"
        });
      }
    });
   

  }

}
