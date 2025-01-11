import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GoogleMapsComponent } from "../google-maps/google-maps.component";
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchResultMatchDto } from '../models/Viajes/SearchResultMatchDto';
import { ViajeService } from '../services/viaje.service';
import * as bootstrap from 'bootstrap'; // Importa Bootstrap JS
import { GeocodingService } from '../services/geocoding.service';
import Swal from 'sweetalert2';
import { PassengersDto } from '../models/Viajes/PassengersDto';
import { FormsModule } from '@angular/forms';
import { EstadoResolucion, IncidenteDto, TipoIncidente } from '../models/Viajes/IncidenteDto';
import { IncidentesService } from '../services/incidentes.service';
import { ValuationService } from '../services/valuation.service';
import { ValuationRequestDto } from '../models/Valuations/ValuationRequestDto';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-mis-viajes',
  standalone: true,
  imports: [GoogleMapsComponent, RouterLink, CommonModule, FormsModule],
  templateUrl: './mis-viajes.component.html',
  styleUrl: './mis-viajes.component.css'
})
export class MisViajesComponent implements OnInit {

  @ViewChild('ratingModal') ratingModal!: ElementRef;
  originLat = -34.6037; // Coordenada de ejemplo (Buenos Aires)
  originLng = -58.3816;

  destinationLat = -34.9011; // Coordenada de ejemplo (Montevideo)
  destinationLng = -56.1645;
  selectedTrip: SearchResultMatchDto | null = null;
  createdTrips: SearchResultMatchDto[] = [];
  finishedTrips: SearchResultMatchDto[] = [];
  viewPending: boolean = true;
  viewFinished: boolean = false;

  travelDistance: string = '';
  travelTime: string = '';
  isChofer: boolean = false;
  isChoferCard: boolean = false;
  passengers: PassengersDto[] = [];
  userId: number = 0;
  ratings: { [passengerId: number]: number } = {};
  comments: { [passengerId: number]: string } = {};


  driverRating: number = 0;
  driverComments: string = '';

  choferRated: boolean = false;

  // Variables para el Reporte de Incidente
  incident: IncidenteDto = {
    idIncidente: 0,            // Inicializa con 0 o un valor inicial si es nuevo
    viajeId: 0,                // ID del viaje relacionado
    descripcion: '',           // Descripción inicial en blanco
    tipoIncidente: TipoIncidente.OTRO,  // Valor inicial del enum `TipoIncidente`
    fechaIncidente: new Date(),         // Fecha actual del incidente
    isPasajero: true,           // Valor booleano: es pasajero o chofer
    denunciadoId: 0,            // ID del usuario denunciado, 0 como valor inicial
    reportadoPorId: 0,          // ID del usuario que reporta el incidente, 0 como valor inicial
    estadoResolucion: EstadoResolucion.PENDIENTE, // Valor predeterminado del estado de resolución
    resolucion: '',            // Resolución inicial en blanco (opcional)
    fechaResolucion: undefined  // Fecha de resolución, undefined porque es opcional
  };
  tipoIncidenteOptions = Object.values(TipoIncidente); // Convierte el enum en un array de valores
  // El array para almacenar las calificaciones de los pasajeros
  valuations: ValuationRequestDto[] = [];


  constructor(private cdr: ChangeDetectorRef, private valuationService: ValuationService, private router: Router, private viajesService: ViajeService, private geocodingService: GeocodingService, private incidenteservice: IncidentesService) { }

  ngOnInit(): void {
    const id = localStorage.getItem('userId');
    if (id) {
      this.userId = parseInt(id, 10);
    }
    this.loadTrips();

  }
  round(value: number): number {
    return Math.round(value);
  }
  editTrip() {
    // Obtén el modal por su ID
    const modalElement = document.getElementById('tripDetailsModal');

    // Verifica si el modal existe antes de intentar cerrarlo
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);

      // Verifica si se encontró una instancia del modal
      if (modalInstance) {
        modalInstance.hide(); // Cierra el modal
      }
    }
    if (this.selectedTrip) {
      // Redirige al componente de edición
      this.router.navigate(['/edit-trip', this.selectedTrip.tripId]);
    }

  }

  // En tu componente
  // En tu componente
  ischoferrated() {
    if (this.selectedTrip) {

      // Directamente devuelve el Observable desde el servicio sin suscribirse aquí
      this.valuationService.hasPassengerBeenRated(this.selectedTrip.tripId, this.userId).subscribe(
        (next) => { this.choferRated = next },
        (error) => { console.log(error) }
      );

    }
  }

  dontHavePassengers(): boolean {
    if (this.passengers.length == 0) {
      return true
    } else {
      return false
    }
  }
  getPassengers(tripid: number): void {
    this.viajesService.getPassengersByTripId(tripid).subscribe(
      (data: PassengersDto[]) => {
        this.passengers = data;
      },
      (error) => {
        console.error('Error al obtener los pasajeros:', error);
      }
    );
  }


  finalizarViaje(trip: SearchResultMatchDto): void {
    this.selectedTrip = trip;

    // Cargar los pasajeros asociados al viaje
    this.getPassengers(trip.tripId);

    // Abrir el modal de calificación
    const modalElement = document.getElementById('ratingModal');
    if (modalElement) {
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    }
  }


  assignRating(passenger: PassengersDto, rating: number) {
    this.ratings[passenger.id] = rating; // Asegúrate de actualizar el objeto ratings
    this.cdr.detectChanges(); // Fuerza la actualización de la vista si es necesario

    // Ahora también actualizamos valuations si es necesario
    const index = this.valuations.findIndex(v => v.idUserValuated === passenger.id);
    if (index !== -1) {
      this.valuations[index].rating = rating; // Actualiza el rating en valuations si ya existe
    } else {
      // Si no existe en valuations, añade un nuevo objeto
      this.valuations.push({
        idTrip: this.selectedTrip?.tripId ?? 0,
        idUserValuated: passenger.id,
        idUserWhoValuated: this.userId,
        rating: rating,
        comments: this.comments[passenger.id] || '' // Usa los comentarios existentes o cadena vacía si no hay
      });
    }
  }


  // Obtiene la calificación del pasajero
  // Obtiene la calificación del pasajero desde valuations
  getPassengerRating(passengerId: number): number {
    const valuation = this.valuations.find(v => v.idUserValuated === passengerId);
    return valuation ? valuation.rating : 0;
  }


  // Asigna comentarios para el pasajero
  setPassengerComments(passengerId: number, comments: string): void {
    this.comments[passengerId] = comments;
  }

  // Obtiene los comentarios del pasajero
  getPassengerComments(passengerId: number): string {
    return this.comments[passengerId] || '';
  }


  idselectedtrip!: number;
  // Método para enviar las calificaciones y finalizar el viaje
  // Enviar las calificaciones
  submitRatings(): void {
    if (this.selectedTrip) {
      this.idselectedtrip = this.selectedTrip.tripId;
    }

    if (Object.keys(this.ratings).length === this.passengers.length) {
      this.passengers.forEach(passenger => {
        const rating = this.ratings[passenger.id];
        const comments = this.comments[passenger.id] || '';

        const valuation: ValuationRequestDto = {
          idTrip: this.idselectedtrip,
          idUserValuated: passenger.id,
          idUserWhoValuated: this.userId,
          rating: rating,
          comments: comments
        };

        this.valuationService.submitValuation(valuation).subscribe({
          next: () => {
            console.log('Valoración enviada correctamente');
          },
          error: (error) => {
            console.error('Error al enviar valoración:', error);
          }
        });
      });

      this.finalizarViajeVal();

      // Cierra el modal después de calificar a todos los pasajeros
      const modalElement = new bootstrap.Modal(this.ratingModal.nativeElement);
      modalElement.hide();

    } else {
      Swal.fire('Error', 'Debes calificar a todos los pasajeros antes de finalizar el viaje.', 'error');
    }
  }
  openRatingModal(trip: SearchResultMatchDto): void {
    this.selectedTrip = trip;  // Asigna el viaje seleccionado
    this.soychofer(trip.tripId)
    this.getPassengersVal(trip.tripId);  // Carga los pasajeros
  }

  getPassengersVal(tripId: number): void {
    this.viajesService.getPassengersByTripId(tripId).subscribe({
      next: (data: PassengersDto[]) => {
        this.passengers = data;
        console.log(this.passengers)

        if (this.passengers.length == 0) {
          // Si no hay pasajeros, finaliza directamente el viaje
          if (this.selectedTrip)
            this.finalizarViajeVal();
        } else {
          // Si hay pasajeros, abre el modal de calificación
          const modalElement = document.getElementById('ratingModal');
          if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
          }
        }
      },
      error: (error) => {
        console.error('Error al obtener los pasajeros:', error);
        Swal.fire('Error', 'No se pudo obtener la lista de pasajeros. Intenta de nuevo más tarde.', 'error');
      }
    });
  }

  openRatingChoferModal(trip: SearchResultMatchDto): void {
    this.selectedTrip = trip;
    this.resetRating();

    // Obtén el modal que quieres cerrar
    const tripDetailsModalElement = document.getElementById('tripDetailsModal');
    if (tripDetailsModalElement) {
      const tripDetailsModal = bootstrap.Modal.getInstance(tripDetailsModalElement);

      // Función para abrir el modal de calificación
      const openRatingModal = () => {
        const ratingDriverModalElement = document.getElementById('ratingDriverModal');
        if (ratingDriverModalElement) {
          const ratingDriverModal = new bootstrap.Modal(ratingDriverModalElement);
          ratingDriverModal.show();
        }
      };

      // Cierra el modal y luego abre el nuevo modal
      if (tripDetailsModal) {
        tripDetailsModal.hide();

        // Espera a que se cierre el modal antes de abrir el otro
        tripDetailsModalElement.addEventListener('hidden.bs.modal', openRatingModal, { once: true });
      } else {
        // Si el modal no se ha inicializado, simplemente abre el nuevo modal
        openRatingModal();
      }
    } else {
      // Si no existe el modal de detalles del viaje, abre directamente el de calificar al chofer
      this.showRatingDriverModal();
    }
  }

  // Método auxiliar para mostrar el modal de calificar al chofer
  showRatingDriverModal(): void {
    const ratingDriverModalElement = document.getElementById('ratingDriverModal');
    if (ratingDriverModalElement) {
      const ratingDriverModal = new bootstrap.Modal(ratingDriverModalElement);
      ratingDriverModal.show();
    }
  }


  resetRating(): void {
    this.driverRating = 0;
    this.driverComments = '';
  }

  setDriverRating(rating: number): void {
    this.driverRating = rating;
  }


  submitDriverRating(): void {
    if (!this.selectedTrip?.tripId) {
      return; // Guard clause if no trip selected
    }
  
    const valuation: ValuationRequestDto = {
      idTrip: this.selectedTrip.tripId,
      idUserValuated: this.selectedTrip.driverId,
      idUserWhoValuated: this.userId, // Ensure this is the driver's ID, adjust as needed
      rating: this.driverRating,
      comments: this.driverComments
    };
  
    this.valuationService.submitValuation(valuation).subscribe({
      next: (response) => {
        console.log('Driver rating submitted successfully');
        Swal.fire({
          icon: 'success',
          title: 'Calificación enviada',
          text: 'La calificación del conductor ha sido enviada con éxito.',
          confirmButtonText: 'Aceptar'
        });
        this.closeModal('ratingDriverModal');
      },
      error: (error) => {
        console.error('Error submitting driver rating:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al enviar calificación',
          text: 'Ocurrió un problema al enviar la calificación del conductor. Inténtalo nuevamente.',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }
  



  closeModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      } else {
        console.error('No se encontró una instancia del modal para cerrar.');
      }
    } else {
      console.error('No se encontró el elemento modal para cerrar.');
    }
  }


  // Método para finalizar el viaje después de las calificaciones
  finalizarViajeVal(): void {
    if (this.selectedTrip)
      this.viajesService.finalizarViaje(this.selectedTrip?.tripId).subscribe({
        next: () => {
          Swal.fire('¡Viaje finalizado!', 'El viaje ha sido finalizado correctamente.', 'success');
          this.loadTrips();  // Recargar los viajes actualizados
        },
        error: (error) => {
          console.error('Error al finalizar el viaje:', error);
          Swal.fire('Error', 'No se pudo finalizar el viaje. Intenta de nuevo más tarde.', 'error');
        }
      });
  }







  soychofer(tripid: number) {
    const userid = localStorage.getItem('userId');

    if (userid) { // Verificar si userid no es null
      this.viajesService.soyChoferDelViaje(tripid, parseInt(userid, 10)).subscribe(
        (response) => {
          console.log(response)
          this.isChofer = response.ischofer;
          this.cdr.detectChanges(); // Forzar la detección de cambios si es necesario
        },
        (error) => {
          console.error('Error al verificar si es chofer:', error);
        }
      );
    } else {
      console.error('No se encontró userId en el localStorage');
    }
  }


  // Función para convertir la fecha en un objeto Date
  private convertToDate(dateArray: any): Date {
    if (Array.isArray(dateArray)) {
      return new Date(
        dateArray[0], // Año
        dateArray[1] - 1, // Mes (Date usa 0 para enero, así que restamos 1)
        dateArray[2], // Día
        dateArray[3] || 0, // Hora (opcional)
        dateArray[4] || 0 // Minuto (opcional)
      );
    }
    return dateArray; // Si ya es Date, lo devolvemos tal cual
  }
  openTripDetails(trip: SearchResultMatchDto) {


    this.selectedTrip = trip;
    this.soychofer(this.selectedTrip.tripId)
    console.log(this.isChofer)

    this.getPassengers(this.selectedTrip.tripId)

    this.ischoferrated();
    // Obtener latitud y longitud del origen
    this.geocodingService.getLatLong(trip.origin).subscribe({
      next: (response) => {
        if (response.results && response.results.length > 0) {
          this.originLat = response.results[0].geometry.location.lat;
          this.originLng = response.results[0].geometry.location.lng;
        }
      },
      error: (err) => {
        console.error("Error obteniendo coordenadas de origen: ", err);
      }
    });

    // Obtener latitud y longitud del destino
    this.geocodingService.getLatLong(trip.destination).subscribe({
      next: (response) => {
        if (response.results && response.results.length > 0) {
          this.destinationLat = response.results[0].geometry.location.lat;
          this.destinationLng = response.results[0].geometry.location.lng;
        }
      },
      error: (err) => {
        console.error("Error obteniendo coordenadas de destino: ", err);
      }
    });

    this.calculateDistanceAndTime();

    // Mostrar el modal con los detalles del viaje
    const modalElement = document.getElementById('tripDetailsModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement); // Usa bootstrap.Modal después de la importación
      modal.show();
    }
  }

  deleteTripInModal() {
    if (this.selectedTrip) {
      this.deleteTrip(this.selectedTrip)
    }


  }
  deleteTrip(tripId: SearchResultMatchDto): void {
    const userId = localStorage.getItem('userId');

    // Verifica si el usuario es chofer
    this.viajesService.soyChoferDelViaje(tripId.tripId, parseInt(userId ?? '0', 10)).subscribe(
      (response) => {
        if (response.ischofer) {
          // Si el usuario es chofer, seguir la lógica actual
          this.handleDeleteAsChofer(tripId);
        } else {
          // Si es pasajero, eliminarlo como pasajero y solicitar reintegro
          this.handleDeleteAsPassenger(tripId, parseInt(userId ?? '0', 10));
        }
      },
      (error) => {
        console.error('Error al verificar si es chofer:', error);
      }
    );
  }
  private handleDeleteAsChofer(tripId: SearchResultMatchDto): void {
    this.viajesService.getPassengersByTripId(tripId.tripId).subscribe(
      (data: PassengersDto[]) => {
        this.passengers = data;

        if (this.passengers.length > 0) {
          // Mostrar advertencia de reintegros
          Swal.fire({
            title: 'Advertencia!',
            text: "Este viaje tiene pasajeros. Si eliminas el viaje, se realizarán reintegros a todos los pasajeros.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar y reembolsar',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
              // Si el usuario confirma, eliminar el viaje completo
              this.executeDeleteTrip(tripId);
            } else {
              this.passengers = [];
            }
          });
        } else {
          // Si no hay pasajeros, eliminar el viaje directamente
          Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esta acción!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar!',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
              this.executeDeleteTrip(tripId);
            }
          });
        }
      },
      (error) => {
        console.error('Error al obtener los pasajeros:', error);
        Swal.fire(
          'Error',
          'No se pudo verificar los pasajeros del viaje. Inténtalo de nuevo más tarde.',
          'error'
        );
      }
    );
  }
  private handleDeleteAsPassenger(tripId: SearchResultMatchDto, userId: number): void {
    Swal.fire({
      title: '¿Solicitar reintegro?',
      text: "Estás a punto de solicitar un reintegro y eliminar tu participación en este viaje.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, solicitar reintegro',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Solicitar el reintegro y eliminar al pasajero del viaje
        this.viajesService.deletePassengerFromTrip(tripId.tripId, userId).subscribe({
          next: (response) => {
            Swal.fire(
              'Eliminado!',
              'Tu participación en el viaje ha sido eliminada y se ha solicitado el reintegro.',
              'success'
            );
            this.loadTrips();
            this.cdr.detectChanges(); // Forzar la detección de cambios
          },
          error: (err) => {
            console.error('Error al eliminar al pasajero y solicitar reintegro:', err);
            Swal.fire(
              'Error!',
              'No se pudo procesar tu solicitud. Inténtalo de nuevo más tarde.',
              'error'
            );
          }
        });
      }
    });
  }


  // Método para traducir los estados del viaje
  translateStatus(status: string): string {
    switch (status) {
      case 'CREATED':
        return 'PENDIENTE';
      case 'IN PROGRESS':
        return 'EN PROGRESO';
      case 'FINISHED':
        return 'FINALIZADO';
      default:
        return status; // Devuelve el estado original si no coincide con ninguno de los casos
    }
  }

  // Método para eliminar el viaje
  private executeDeleteTrip(tripId: SearchResultMatchDto): void {
    this.viajesService.deleteTrip(tripId.tripId).subscribe({
      next: (response) => {
        Swal.fire(
          'Eliminado!',
          'El viaje ha sido eliminado.',
          'success'
        );
        this.loadTrips();
        this.cdr.detectChanges();  // Forzar la detección de cambios
      },
      error: (err) => {
        console.error('Error al eliminar el viaje:', err);
        Swal.fire(
          'Error!',
          'No se pudo eliminar el viaje. Inténtalo de nuevo más tarde.',
          'error'
        );
      }
    });
  }
  loadTrips() {
    this.viajesService.getAllCreatedAndInProgressByUser().subscribe({
      next: (trips) => {
        this.createdTrips = trips.map(trip => ({
          ...trip,
          departureTime: this.convertToDate(trip.departureTime),
          arrivalTime: this.convertToDate(trip.arrivalTime)
        }));
      },
      error: (err) => {
        console.error("Error al cargar viajes creados/incompletos:", err);
      }
    });

    this.viajesService.getAllFinishedByUser().subscribe({
      next: (trips) => {
        this.finishedTrips = trips.map(trip => ({
          ...trip,
          departureTime: this.convertToDate(trip.departureTime),
          arrivalTime: this.convertToDate(trip.arrivalTime)
        }));

        console.log(this.finishedTrips)
      },
      error: (err) => {
        console.error("Error al cargar viajes finalizados:", err);
      }
    });
  }

  calculateDistanceAndTime() {
    const origen = this.selectedTrip?.origin
    const destino = this.selectedTrip?.destination

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
  // Mostrar viajes pendientes
  showPending() {
    this.viewPending = true;
    this.viewFinished = false;
  }

  // Mostrar viajes finalizados
  showFinished() {
    this.viewPending = false;
    this.viewFinished = true;
  }

















  // Abrir Modal de Reporte de Incidente
  openIncidentReport(): void {
    if (!this.selectedTrip) {
      Swal.fire('Error', 'No se ha seleccionado ningún viaje.', 'error');
      return; // Salir si no hay un viaje seleccionado
    }

    this.incident.viajeId = this.selectedTrip.tripId; // Vincular el viaje al incidente
    this.incident.reportadoPorId = this.userId; // Asignar el usuario que reporta
    const modalElement = document.getElementById('reportIncidentModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }


  // Enviar el reporte de incidente
  submitIncidentReport(): void {
    // Asignar la fecha actual al reporte
    if (this.incident.denunciadoId == 0) {
      this.incident.isPasajero = false;
      this.incident.denunciadoId == this.selectedTrip?.driverId
    }
    this.incident.fechaIncidente = new Date();
    console.log(this.incident)
    this.incidenteservice.reportIncident(this.incident).subscribe({
      next: (response) => {
        Swal.fire('¡Incidente reportado!', 'El incidente ha sido reportado correctamente.', 'success');
      },
      error: (error) => {
        console.error('Error al reportar el incidente:', error);
        Swal.fire('Error', 'No se pudo reportar el incidente. Intenta de nuevo más tarde.', 'error');
      }
    });

    const modalElement = document.getElementById('reportIncidentModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  }
}
