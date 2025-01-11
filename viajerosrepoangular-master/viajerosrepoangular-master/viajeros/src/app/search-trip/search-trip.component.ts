import { Component, OnInit } from '@angular/core';
import { GoogleMapsComponent } from "../google-maps/google-maps.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { GeocodingService } from '../services/geocoding.service';
import { LocalidadService } from '../services/localidad.service';
import { Router, RouterLink } from '@angular/router';
import { routes } from '../app.routes';
import { ViajeService } from '../services/viaje.service';

@Component({
  selector: 'app-search-trip',
  standalone: true,
  imports: [GoogleMapsComponent, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './search-trip.component.html',
  styleUrl: './search-trip.component.css'
})
export class SearchTripComponent implements OnInit {
  originLat = -34.6037; // Coordenada de ejemplo (Buenos Aires)
  originLng = -58.3816;

  destinationLat = -34.9011; // Coordenada de ejemplo (Montevideo)
  destinationLng = -56.1645;

  travelDistance: string = '';
  travelTime: string = '';

  kmPorLitro: number = 0;
  precioNafta: number = 0;
  costoTotal: number = 0;

  searchTripForm: FormGroup;
  localidadesOrigen: { id: number, nombre: string }[] = []; // Lista de sugerencias de localidades
  localidadesDestino: { id: number, nombre: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private localidadService: LocalidadService,
    private geocodingService: GeocodingService,
    private router: Router,
    private viajesService: ViajeService
  ) {
    this.searchTripForm = this.fb.group({
      origen: ['', Validators.required],
      destino: ['', Validators.required],
      fechaHoraInicio: ['', Validators.required],
      aceptaMascotas: ['', Validators.required],
      equipajePermitido: ['', Validators.required],
      aceptaFumar: ['', Validators.required],
      localidadInicioId: [''],
      localidadFinId: ['']
    });
  }

  ngOnInit(): void { }

  // Método para buscar localidades
  searchLocalidades(campo: string): void {
    const query = this.searchTripForm.get(campo)?.value;
    if (query && query.length > 2) {
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

  // Método para seleccionar una localidad y almacenar su ID y nombre
  selectLocalidad(campo: string, localidad: { id: number, nombre: string }): void {
    if (campo === 'origen') {
      this.searchTripForm.get('origen')?.setValue(localidad.nombre);
      this.searchTripForm.get('localidadInicioId')?.setValue(localidad.id);
      this.localidadesOrigen = []; // Limpiar las sugerencias de origen
    } else if (campo === 'destino') {
      this.searchTripForm.get('destino')?.setValue(localidad.nombre);
      this.searchTripForm.get('localidadFinId')?.setValue(localidad.id);
      this.localidadesDestino = []; // Limpiar las sugerencias de destino
    }
    // Ejecuta el cálculo solo si ambos, origen y destino, ya están seleccionados
    const origenSeleccionado = this.searchTripForm.get('origen')?.value;
    const destinoSeleccionado = this.searchTripForm.get('destino')?.value;

    if (origenSeleccionado && destinoSeleccionado) {
      this.calculateDistanceAndTime();
    }
  }
  // Método para buscar la latitud y longitud de la localidad de origen
  searchLocalidadOrigen() {
    const origen = this.searchTripForm.get('origen')?.value;
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
    const destino = this.searchTripForm.get('destino')?.value;
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

  // Método para calcular la distancia y tiempo entre origen y destino
  calculateDistanceAndTime() {
    const origen = this.searchTripForm.get('origen')?.value;
    const destino = this.searchTripForm.get('destino')?.value;

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
  submitSearchTripForm() {
    const viajesRequestMatchDto = {
      origin: this.searchTripForm.get('origen')?.value,
      destination: this.searchTripForm.get('destino')?.value,
      fechaHoraInicio: this.searchTripForm.get('fechaHoraInicio')?.value,
      petsAllowed: this.searchTripForm.get('aceptaMascotas')?.value,
      equipajePermitido: this.searchTripForm.get('equipajePermitido')?.value,
      smokersAllowed: this.searchTripForm.get('aceptaFumar')?.value,
      localidadInicioId: this.searchTripForm.get('localidadInicioId')?.value,
      localidadFinId: this.searchTripForm.get('localidadFinId')?.value
    };
    console.log(viajesRequestMatchDto)
    // Llamar al servicio para buscar viajes

    this.viajesService.saveRequestBusqueda(viajesRequestMatchDto);
    this.viajesService.buscarViajesorigenydestino(viajesRequestMatchDto).subscribe({
      next: (response) => {
        if (response && response.length > 0) {
          console.log(response)


          // Redirigir al componente de resultados
          this.router.navigate(['/viajes-buscados']);
        } else {
          // Si no se encuentran resultados, mostrar un mensaje
          Swal.fire('Sin resultados', 'No se encontraron viajes con los criterios especificados.', 'info');
        }
      },
      error: (error) => {
        console.error('Error en la búsqueda de viajes', error);
        Swal.fire('Error', 'Ocurrió un problema al realizar la búsqueda.', 'error');
      }
    });
  }

  alltrips(){
    this.viajesService.serFlagAllTrips();
    this.router.navigate(['/viajes-buscados']);
  }

}