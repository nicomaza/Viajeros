export interface ViajeDto {
    id: number;
    driverName: string;
    passengers: string[];  // Lista de nombres de pasajeros
    origin: string;
    destination: string;
    startDate: Date;
    status: string;  // Puede ser PENDING, FINISHED, etc.
  }
  