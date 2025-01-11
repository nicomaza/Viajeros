export interface PaymentDto {
    paymentId: string;
    status: string;
    externalReference: string;
    paymentType: string;
    merchantOrderId: string;
    idViaje: number;
    idPasajero: number;
  }