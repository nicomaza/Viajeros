export class ValuationRequestDto {
    idTrip: number;    // ID del viaje
    idUserValuated: number;    // ID del usuario que es calificado (pasajero)
    idUserWhoValuated: number;
    rating: number;    // La calificación dada
    comments: string;  // Los comentarios adicionales, si es necesario
  
    constructor(idTrip: number, idUserValuated: number, idUserWhoValuated:number, rating: number,  comments: string) {
      this.idTrip = idTrip;
      this.idUserValuated = idUserValuated;
      this.idUserWhoValuated = idUserWhoValuated;
      this.rating = rating;
      this.comments = comments;
    }
  }
  