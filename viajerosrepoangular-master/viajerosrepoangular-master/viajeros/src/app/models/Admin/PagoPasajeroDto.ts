export interface PagoPasajeroDto {
  idPayment: number,
  idViaje: number;
  nombrePasajero: string;
  monto: number;
  estadoPagoPasajero: string;
  nombreChofer: string;
  cbuChofer: string;
  bancoChofer: string;
  estadoPagoChofer: string;
}
