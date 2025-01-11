import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehicleService } from '../services/vehicle.service';
import { Router, RouterLink } from '@angular/router';
import { CarResponseDto } from '../models/Vehicle/CarResponseDto';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { LocalidadService } from '../services/localidad.service';
import { NewTripRequestDto } from '../models/Viajes/NewTripRequestDto';
import { ViajeService } from '../services/viaje.service';
import { routes } from '../app.routes';
import { GoogleMapsComponent } from "../google-maps/google-maps.component";
import { GeocodingService } from '../services/geocoding.service';
import { SearchResultMatchDto } from '../models/Viajes/SearchResultMatchDto';
declare var bootstrap: any;  // Declarar 'bootstrap' como variable global
@Component({
  selector: 'app-new-trip',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, GoogleMapsComponent],
  templateUrl: './new-trip.component.html',
  styleUrl: './new-trip.component.css'
})
export class NewTripComponent implements OnInit {

  @Input() set id(id: string) {

    this.tripId = parseInt(id, 10)
    this.isEditing = true;
    console.log("aca input", this.tripId)
  }
  originLat = -34.6037; // Coordenada de ejemplo (Buenos Aires)
  originLng = -58.3816;

  destinationLat = -34.9011; // Coordenada de ejemplo (Montevideo)
  destinationLng = -56.1645;


  travelDistance: string = '';
  travelTime: string = '';


  kmPorLitro: number = 0;
  precioNafta: number = 0;
  costoTotal: number = 0;

  createTripForm: FormGroup;
  localidadesOrigen: { id: number, nombre: string }[] = []; // Lista de sugerencias de localidades

  localidadesDestino: { id: number, nombre: string }[] = [];
  vehiculos: CarResponseDto[] = []; // Almacena los vehículos del usuario
  vehicle!: CarResponseDto;


  isEditing: boolean = false; // Indica si estamos en modo edición
  tripId: number | null = null; // Almacena el ID del viaje a editar si aplica
  editTrip!: SearchResultMatchDto;


  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private router: Router, private localidadService: LocalidadService,
    private viajeservice: ViajeService,
    private geocodingService: GeocodingService
  ) {
    this.createTripForm = this.fb.group({
      idVehiculo: ['', Validators.required],
      localidadInicioId: ['', Validators.required],
      origen: ['', Validators.required], // Solo el nombre visible
      localidadFinId: ['', Validators.required],
      destino: ['', Validators.required], // Solo el nombre visible
      fechaHoraInicio: ['', Validators.required],
      gastoTotal: ['', Validators.required],
      asientosDisponibles: ['', [Validators.required, Validators.min(1), Validators.max(4)]],
      aceptaMascotas: [null, Validators.required],
      aceptaFumar: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUserVehicles();
    if (this.tripId) {

      this.loadTripData(this.tripId);
    }
  }
  loadTripData(tripId: number): void {
    // Obtener los datos del viaje por su ID
    this.viajeservice.getTripByIdForEdit(tripId).subscribe({
      next: (trip) => {
        let fechaHoraInicio = '';

        // Verifica si trip.fechaHoraInicio es un array válido
        if (Array.isArray(trip.fechaHoraInicio) && trip.fechaHoraInicio.length === 5) {
          // Crear el objeto Date usando los valores del array: [año, mes (0-based), día, hora, minuto]
          const date = new Date(
            trip.fechaHoraInicio[0],   // Año
            trip.fechaHoraInicio[1] - 1, // Mes (restamos 1 porque en JavaScript los meses son 0-based)
            trip.fechaHoraInicio[2],   // Día
            trip.fechaHoraInicio[3],   // Hora
            trip.fechaHoraInicio[4]    // Minutos
          );

          // Verifica si la fecha es válida
          if (!isNaN(date.getTime())) {
            fechaHoraInicio = date.toISOString().slice(0, 16); // Formato correcto para el campo datetime-local
          } else {
            console.error('Fecha inválida recibida:', trip.fechaHoraInicio);
            Swal.fire('Error', 'La fecha del viaje no es válida.', 'error');
          }
        } else {
          console.error('Formato de fecha no esperado:', trip.fechaHoraInicio);
        }

        // Llenar los datos del formulario con los valores del viaje
        this.createTripForm.patchValue({
          idVehiculo: trip.idVehiculo,
          localidadInicioId: trip.localidadInicioId,
          origen: '',  // Inicialmente vacío hasta obtener la localidad
          localidadFinId: trip.localidadFinId,
          destino: '',  // Inicialmente vacío hasta obtener la localidad
          fechaHoraInicio: fechaHoraInicio,
          gastoTotal: trip.gastoTotal,
          asientosDisponibles: trip.asientosDisponibles,
          aceptaMascotas: trip.aceptaMascotas,
          aceptaFumar: trip.aceptaFumar
        });

        // Obtener el nombre del origen (localidadInicioId)
        this.localidadService.getLocalidadById(trip.localidadInicioId).subscribe({
          next: (localidadInicio) => {
            this.createTripForm.patchValue({ origen: localidadInicio.localidad });
            this.searchLocalidadOrigen();

            // Obtener el nombre del destino (localidadFinId)
            this.localidadService.getLocalidadById(trip.localidadFinId).subscribe({
              next: (localidadFin) => {
                this.createTripForm.patchValue({ destino: localidadFin.localidad });

                this.searchLocalidadDestino();
                this.calculateDistanceAndTime();
              },
              error: (error) => {
                console.error('Error al cargar la localidad de destino:', error);
              }
            });


          },
          error: (error) => {
            console.error('Error al cargar la localidad de origen:', error);
          }
        });


      },
      error: (err) => {
        console.error('Error al cargar los datos del viaje:', err);
        Swal.fire('Error', 'No se pudieron cargar los datos del viaje.', 'error');
      }
    });



  }


  // Carga los vehículos del usuario
  loadUserVehicles() {
    this.vehicleService.getAllCars().subscribe({
      next: (data) => {
        this.vehiculos = data;
      },
      error: (error) => {
        console.error('Error al cargar los vehículos', error);
        Swal.fire('Error', 'Hubo un problema al cargar tus vehículos', 'error');
      }
    });
  }
  // Método para buscar localidades
  searchLocalidades(campo: string): void {
    const query = this.createTripForm.get(campo)?.value;
    if (query && query.length > 2) { // Busca si el usuario ha ingresado al menos 3 caracteres
      this.localidadService.searchLocalidades(query).subscribe((data) => {
        if (campo === 'origen') {
          this.localidadesOrigen = data.slice(0, 4); // Limitar a 4 resultados para origen
        } else if (campo === 'destino') {
          this.localidadesDestino = data.slice(0, 4); // Limitar a 4 resultados para destino
        }
      });
    } else {
      if (campo === 'origen') {
        this.localidadesOrigen = []; // Limpiar las sugerencias de origen
      } else if (campo === 'destino') {
        this.localidadesDestino = []; // Limpiar las sugerencias de destino
      }
    }
  }
  // Método para buscar la latitud y longitud de la localidad de origen
  searchLocalidadOrigen() {
    const origen = this.createTripForm.get('origen')?.value;
    if (origen) {
      this.geocodingService.getLatLong(origen).subscribe({
        next: (response) => {
          if (response.status === 'OK') {
            const location = response.results[0].geometry.location;
            this.originLat = location.lat;
            this.originLng = location.lng;
            console.log(`Origen - Latitud: ${this.originLat}, Longitud: ${this.originLng}`);
          } else {
            Swal.fire('Error', 'No se encontraron resultados para la localidad de origen', 'error');
          }
        },
        error: (error) => {
          console.error('Error al obtener coordenadas de origen', error);
          Swal.fire('Error', 'Hubo un problema al obtener las coordenadas de origen', 'error');
        }
      });
    }
  }

  // Método para buscar la latitud y longitud de la localidad de destino
  searchLocalidadDestino() {
    const destino = this.createTripForm.get('destino')?.value;
    if (destino) {
      this.geocodingService.getLatLong(destino).subscribe({
        next: (response) => {
          if (response.status === 'OK') {
            const location = response.results[0].geometry.location;
            this.destinationLat = location.lat;
            this.destinationLng = location.lng;
            console.log(`Destino - Latitud: ${this.destinationLat}, Longitud: ${this.destinationLng}`);
          } else {
            Swal.fire('Error', 'No se encontraron resultados para la localidad de destino', 'error');
          }
        },
        error: (error) => {
          console.error('Error al obtener coordenadas de destino', error);
          Swal.fire('Error', 'Hubo un problema al obtener las coordenadas de destino', 'error');
        }
      });
    }
  }

  calculateDistanceAndTime() {
    const origen = this.createTripForm.get('origen')?.value;
    const destino = this.createTripForm.get('destino')?.value;

    // Verifica si origen y destino no están vacíos
    if (origen && destino) {
      this.geocodingService.getDistanceAndTime(origen, destino).subscribe(response => {
        if (response.status === 'OK') {
          const element = response.rows[0].elements[0];
          this.travelDistance = element.distance.text;
          this.travelTime = element.duration.text;
          console.log(`Distancia: ${this.travelDistance}, Tiempo: ${this.travelTime}`);
        } else {
          console.error('Error al obtener la distancia y el tiempo', response.status);
        }
      }, error => {
        console.error('Error en la solicitud', error);
      });
    } else {
      // Mostrar mensaje de error si alguno de los campos está vacío
      console.error('Origen y destino son requeridos');
      Swal.fire('Error', 'Debes completar ambos campos: Origen y Destino', 'error');
    }
  }


  calcularCosto() {

    const distancia = parseInt(this.travelDistance, 10)
    if (this.kmPorLitro > 0 && this.precioNafta > 0) {
      this.costoTotal = (distancia / this.kmPorLitro) * this.precioNafta;
    } else {
      this.costoTotal = 0;
    }
  }

  agregarCosto() {
    // Cerrar el modal
    this.cerrarModal();
  
    // Redondear el costo total para asegurar que no hay decimales
    const costoRedondeado = Math.round(this.costoTotal);
  
    // Lógica para agregar el costo redondeado al formulario
    this.createTripForm.patchValue({
      gastoTotal: costoRedondeado
    });
  
  }
  

  cerrarModal() {
    // Obtener el modal por su ID
    const modalElement = document.getElementById('exampleModal');

    // Verifica si se obtuvo el elemento correctamente
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
      modalInstance.hide();

      // Escuchar el evento de cierre para limpiar el fondo oscuro
      modalElement.addEventListener('hidden.bs.modal', () => {
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
          modalBackdrop.remove(); // Eliminar el backdrop si existe
        }
        document.body.style.overflow = 'auto'; // Asegurarse de que el scroll esté habilitado
      });
    }
  }




  vehicleSelected(car: CarResponseDto) {
    this.vehicle = car;
  }


  // Método para seleccionar una localidad y almacenar su ID y nombre
  selectLocalidad(campo: string, localidad: { id: number, nombre: string }): void {
    if (campo === 'origen') {
      this.createTripForm.get('origen')?.setValue(localidad.nombre);
      this.createTripForm.get('localidadInicioId')?.setValue(localidad.id);
      this.localidadesOrigen = []; // Limpiar las sugerencias de origen
    } else if (campo === 'destino') {
      this.createTripForm.get('destino')?.setValue(localidad.nombre);
      this.createTripForm.get('localidadFinId')?.setValue(localidad.id);
      this.localidadesDestino = []; // Limpiar las sugerencias de destino
    }
    // Ejecuta el cálculo solo si ambos, origen y destino, ya están seleccionados
    const origenSeleccionado = this.createTripForm.get('origen')?.value;
    const destinoSeleccionado = this.createTripForm.get('destino')?.value;

    if (origenSeleccionado && destinoSeleccionado) {
      this.calculateDistanceAndTime();
    }
  }



  submitTripForm() {
    const iduser = localStorage.getItem("userId");

    // Crear tripData manualmente con los valores relevantes
    const tripData: NewTripRequestDto = {
      idVehiculo: Number(this.createTripForm.get('idVehiculo')?.value),
      idChofer: Number(iduser),
      localidadInicioId: this.createTripForm.get('localidadInicioId')?.value,
      localidadFinId: this.createTripForm.get('localidadFinId')?.value,
      fechaHoraInicio: this.createTripForm.get('fechaHoraInicio')?.value,
      gastoTotal: this.createTripForm.get('gastoTotal')?.value,
      asientosDisponibles: this.createTripForm.get('asientosDisponibles')?.value,
      aceptaMascotas: this.createTripForm.get('aceptaMascotas')?.value,
      aceptaFumar: this.createTripForm.get('aceptaFumar')?.value
    };

    if (this.createTripForm.valid) {
      // Enviar el viaje al backend
      this.viajeservice.registerTrip(tripData).subscribe(
        (response) => {
          console.log(response);
          // Mostrar alerta de éxito
          Swal.fire({
            icon: 'success',
            title: '¡Viaje registrado!',
            text: 'El viaje se ha registrado correctamente.',
            confirmButtonText: 'Aceptar'
          });
          this.router.navigate(['/profile'])
        },
        (error) => {
          console.log(error);
          // Mostrar alerta de error
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al registrar el viaje. Por favor, inténtalo de nuevo.',
            confirmButtonText: 'Aceptar'
          });
        }
      );
    }

  }

  updateTrip(): void {
    if (this.createTripForm.valid) {
      const tripId = this.tripId; // Obtener el ID del viaje desde la ruta
      const tripData: NewTripRequestDto = {
        idVehiculo: this.createTripForm.get('idVehiculo')?.value,
        idChofer: Number(localStorage.getItem('userId')), // ID del chofer desde localStorage
        localidadInicioId: this.createTripForm.get('localidadInicioId')?.value,
        localidadFinId: this.createTripForm.get('localidadFinId')?.value,
        fechaHoraInicio: this.createTripForm.get('fechaHoraInicio')?.value,
        gastoTotal: this.createTripForm.get('gastoTotal')?.value,
        asientosDisponibles: this.createTripForm.get('asientosDisponibles')?.value,
        aceptaMascotas: this.createTripForm.get('aceptaMascotas')?.value,
        aceptaFumar: this.createTripForm.get('aceptaFumar')?.value
      };
      if (tripId)
        this.viajeservice.updateTrip(tripId, tripData).subscribe({
          next: (response) => {
            Swal.fire('Éxito', 'El viaje ha sido actualizado correctamente.', 'success');
            this.router.navigate(['/profile']); // Redirigir a la página del perfil
          },
          error: (error) => {
            console.error('Error al actualizar el viaje:', error);
            Swal.fire('Error', 'Hubo un problema al actualizar el viaje.', 'error');
          }
        });
    }
  }

}