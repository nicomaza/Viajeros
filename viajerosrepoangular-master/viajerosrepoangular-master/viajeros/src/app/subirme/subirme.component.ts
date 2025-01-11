import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ViajeService } from '../services/viaje.service';
import { SearchResultMatchDto } from '../models/Viajes/SearchResultMatchDto';
import { Chat } from '../models/Chat/Chat';
import { MercadopagoService } from '../services/mercadopago.service';
import { PreferenceTripDto } from '../models/Payments/PreferenceTripDto';

@Component({
  selector: 'app-subirme',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subirme.component.html',
  styleUrl: './subirme.component.css'
})
export class SubirmeComponent implements OnInit {

  tripId: string | null = null;  // Variable para almacenar el tripId
  tripIdConvertedNumber: number = 0; // Variable para almacenar el tripId convertido a número
  viajeSelected!: SearchResultMatchDto;
  montototal: number = 0;

  constructor(private route: ActivatedRoute, private viajeservice: ViajeService, private router: Router, private mercadopagoservice: MercadopagoService) { }

  ngOnInit(): void {
    // Capturar el tripId desde los parámetros de la ruta
    this.tripId = this.route.snapshot.paramMap.get('tripId');

    // Convertir tripId a número si es válido
    if (this.tripId) {
      this.tripIdConvertedNumber = +this.tripId; // El signo '+' convierte el string a número
    }

    this.viajeservice.getTripById(this.tripIdConvertedNumber).subscribe(
      (response: SearchResultMatchDto) => {
        // Convertir 'date' array a objeto Date
        if (Array.isArray(response.date)) {
          response.date = new Date(
            response.date[0],
            response.date[1] - 1, // Meses en JavaScript empiezan en 0
            response.date[2],
            response.date[3] || 0, // Hora
            response.date[4] || 0  // Minutos
          );
        }

        // Asegurar que 'departureTime' y 'arrivalTime' sean objetos Date
        response.departureTime = new Date(response.departureTime);
        response.arrivalTime = new Date(response.arrivalTime);

        // Asignar el viaje procesado a viajeSelected
        this.viajeSelected = response;
      },
      (error) => { console.log(error); }
    );

    if (this.tripId)
      this.viajeservice.getGastoTotalViaje(this.tripId).subscribe(
        (response) => { this.montototal = response },
        (error) => { console.log(error) })
  }



  gotochat() {
    this.router.navigate(['/chat', this.tripId]);
  }

  onSubirmeClick() {
    // Crear directamente el objeto PreferenceTripDto con los valores necesarios

    const preferenceTripDto = new PreferenceTripDto(
      this.tripIdConvertedNumber, // idviaje
      10, // monto
      'Viajeros.com', // title
      this.viajeSelected.origin + ' ' + this.viajeSelected.destination, // description
      Number(localStorage.getItem('userId')) // idpasajero obtenido del localStorage
    );
    console.log(preferenceTripDto)
    // Enviar la preferencia al servicio de MercadoPago
    this.mercadopagoservice.crearPreferencia(preferenceTripDto).subscribe(
      (response) => {
        console.log('Preferencia creada:', response);
        this.mercadopagoservice.initMercadoPagoButton(response.id);
      },
      (error) => {
        console.error('Error al crear la preferencia:', error);
      }
    );
  }

  // viaje-detail.component.ts
  saldoAPagar(): number {
    console.log('prueba',this.montototal)
    console.log('alkak',this.montototal/5)
    return (this.montototal / 5) - 2000;
  }




}