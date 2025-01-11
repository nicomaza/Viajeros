export class PreferenceTripDto {
    idviaje: number;
    monto: number;
    title: string;
    description: string;
    idpasajero: number;
  
    constructor(idviaje: number, monto: number, title: string, description: string, idpasajero: number) {
      this.idviaje = idviaje;
      this.monto = monto;
      this.title = title;
      this.description = description;
      this.idpasajero = idpasajero;
    }
  }
  