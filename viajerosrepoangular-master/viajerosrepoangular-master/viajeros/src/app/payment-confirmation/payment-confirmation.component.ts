import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentDto } from '../models/Payments/PaymentsDto';
import { PaymentsService } from '../services/payments.service';
import { PhoneNavbarComponent } from "../phone-navbar/phone-navbar.component";

@Component({
  selector: 'app-payment-confirmation',
  standalone: true,
  imports: [PhoneNavbarComponent],
  templateUrl: './payment-confirmation.component.html',
  styleUrl: './payment-confirmation.component.css'
})
export class PaymentConfirmationComponent implements OnInit {
  status: string = '';
  tripId: number = 0; // Almacena el id del viaje
  constructor(
    private route: ActivatedRoute,
    private paymentservice: PaymentsService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.tripId = Number(params['idViaje']); // Convertir el idViaje a número
      const paymentDto: PaymentDto = {
        paymentId: params['collection_id'],
        status: params['collection_status'],
        externalReference: params['external_reference'],
        paymentType: params['payment_type'],
        merchantOrderId: params['merchant_order_id'],
        idViaje: this.tripId, // id del viaje (obténlo de tu lógica)
        idPasajero: Number(localStorage.getItem('userId')) // id del pasajero desde el localStorage
      };
      this.paymentservice.registerPayment(paymentDto).subscribe(
        response => {
          console.log('Pago registrado:', response);
        },
        error => {
          console.error('Error al registrar el pago:', error);
        }
      );
    });
  }



}