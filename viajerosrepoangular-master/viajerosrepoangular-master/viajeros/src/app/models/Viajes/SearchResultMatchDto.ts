export interface SearchResultMatchDto {
    tripId: number;
    origin: string;
    destination: string;
    availableSeats: number;
    date: Date; // Considera usar Date si necesitas manipular fechas
    departureTime: Date; // Puedes usar Date o string según tus necesidades
    arrivalTime: Date; // Puedes usar Date o string según tus necesidades
    estimatedDuration: string;
    petsAllowed: boolean;
    smokersAllowed: boolean;
    vehicleName: string;
    driverRating: number; // Suponiendo que sea un valor numérico
    driverId: number;
    driverName: string;
    status:string;
  }
  