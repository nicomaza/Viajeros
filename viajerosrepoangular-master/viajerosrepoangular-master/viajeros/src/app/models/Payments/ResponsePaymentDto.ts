// src/app/models/response-payment-dto.ts

export interface ResponsePaymentDto {
    idPayment: number;
    paymentId: string;
    status: string;
    externalReference: string;
    paymentType: string;
    merchantOrderId: string;
    idPasajero: number;
    nombreCompletoPasajero: string;
    cuilPasajero: string;
    cbuPasajero: string;
    fechaPago: Date;
}
