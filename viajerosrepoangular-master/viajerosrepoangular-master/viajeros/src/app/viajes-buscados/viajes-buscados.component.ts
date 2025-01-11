import { Component, OnInit } from '@angular/core';
import { GoogleMapsComponent } from "../google-maps/google-maps.component";
import { Router, RouterLink } from '@angular/router';
import { ViajeService } from '../services/viaje.service';
import { SearchResultMatchDto } from '../models/Viajes/SearchResultMatchDto';
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap';
import { ChatComponent } from "../chat/chat.component"; 
import { ChatService } from '../services/chat.service';
import { GeocodingService } from '../services/geocoding.service';
import Swal from 'sweetalert2';
import { PassengersDto } from '../models/Viajes/PassengersDto';

@Component({
  selector: 'app-viajes-buscados',
  standalone: true,
  imports: [GoogleMapsComponent, RouterLink, CommonModule],
  templateUrl: './viajes-buscados.component.html',
  styleUrl: './viajes-buscados.component.css'
})
export class ViajesBuscadosComponent implements OnInit {
  originLat = -34.6037; 
  originLng = -58.3816;
  destinationLat = -34.9011;
  destinationLng = -56.1645;

  selectedTrip: SearchResultMatchDto | null = null;
  matchListrip: SearchResultMatchDto[] = [];
  matchoriginListrip: SearchResultMatchDto[] = [];
  allListcreatedTrip: SearchResultMatchDto[] = [];
  alltrips: SearchResultMatchDto[] = [];
  isChofer: boolean = false;
  flagAllTrips:boolean = false;

  constructor(private viajeservice: ViajeService, private router:Router, private geocodingService: GeocodingService) {}

  ngOnInit(): void {
    const storedRequest = this.viajeservice.getRequestBusqueda();
    this.flagAllTrips = this.viajeservice.flagAllTrips;

    if(this.flagAllTrips){
      this.viajeservice.getAllCreatedTrips().subscribe((response) => {
        this.alltrips = this.processTrips(response);
      }, (error) => console.log(error));
    }

    if (storedRequest && !this.flagAllTrips) {
      this.viajeservice.buscarViajesorigenydestino(storedRequest).subscribe((response) => {
        this.matchListrip = this.processTrips(response);
      });

      this.viajeservice.buscarViajesPorOrigen(storedRequest).subscribe((response) => {
        this.matchoriginListrip = this.filterTrips(response);
      });

      this.viajeservice.obtenerTodosLosViajesExceptOrigin(storedRequest).subscribe((response) => {
        this.allListcreatedTrip = this.processTrips(response);
      });
    } else {
      console.error("No se encontró ninguna búsqueda guardada.");
    }
  }

  // Método para procesar los viajes
  private processTrips(trips: any[]): SearchResultMatchDto[] {
    return trips.map(trip => {
      if (Array.isArray(trip.departureTime)) {
        trip.departureTime = new Date(
          trip.departureTime[0],
          trip.departureTime[1] - 1,
          trip.departureTime[2],
          trip.departureTime[3],
          trip.departureTime[4]
        );
      }
      return trip;
    });
  }

  private filterTrips(trips: any[]): SearchResultMatchDto[] {
    return trips.filter(trip => !this.matchListrip.some(matchTrip => matchTrip.tripId === trip.tripId))
      .map(trip => this.processTrips([trip])[0]);
  }
  round(value: number): number {
    return Math.round(value);
  }


  soypasajero: boolean = false;
  openTripDetails(trip: SearchResultMatchDto) {
    this.selectedTrip = trip;
    const modalElement = document.getElementById('tripDetailsModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }

    const userId = localStorage.getItem('userId');
    if (userId) {

      this.viajeservice.getPassengersByTripId(trip.tripId).subscribe(
        (passengers: PassengersDto[]) => {
          console.log('idmio', userId);
          console.log('pasajeros', passengers);
  const idnumb = parseInt(userId,10);
          // Verifica si el usuario logueado está en la lista de pasajeros
          this.soypasajero = passengers.some(passenger => passenger.id === idnumb);
        },
        (error) => console.log(error)
      );
      this.viajeservice.soyChoferDelViaje(trip.tripId, parseInt(userId)).subscribe((response) => {
        this.isChofer = response.ischofer;
      });
    }
    this.searchLocalidadOrigen();
    this.searchLocalidadDestino();
  }

  // Asegúrate de conectar al WebSocket solo cuando se va a abrir el chat
  goToChat() {
    const modalElement = document.getElementById('tripDetailsModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();
    }
  


    this.router.navigate(['/chat', this.selectedTrip?.tripId]);
  }

  closeModal(){
    this.isChofer = false;
  }



  searchLocalidadOrigen() {
    const origen = this.selectedTrip?.origin;
    if (origen) {
      this.geocodingService.getLatLong(origen).subscribe({
        next: (response) => {
          if (response.status === 'OK') {
            const location = response.results[0].geometry.location;
            this.originLat = location.lat;
            this.originLng = location.lng;
            console.log(`Origen - Latitud: ${this.originLat}, Longitud: ${this.originLng}`);
          } else {
            console.log('Error', 'No se encontraron resultados para la localidad de origen', 'error');
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
    const destino = this.selectedTrip?.destination;
    if (destino) {
      this.geocodingService.getLatLong(destino).subscribe({
        next: (response) => {
          if (response.status === 'OK') {
            const location = response.results[0].geometry.location;
            this.destinationLat = location.lat;
            this.destinationLng = location.lng;
            console.log(`Destino - Latitud: ${this.destinationLat}, Longitud: ${this.destinationLng}`);
          } else {
            console.log('Error', 'No se encontraron resultados para la localidad de destino', 'error');
          }
        },
        error: (error) => {
          console.error('Error al obtener coordenadas de destino', error);
          Swal.fire('Error', 'Hubo un problema al obtener las coordenadas de destino', 'error');
        }
      });
    }
  }
  
}
