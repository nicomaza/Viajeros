export class ValuationResponseDto {
    idValuation: number; // El ID de la valoración generada
    idTrip: number;      // El ID del viaje
    userValuated: number;      // El ID del usuario que fue calificado
    userWhoValuated:number;
    rating: number;      // La calificación dada
    comments: string;    // Los comentarios adicionales
  
    constructor(idValuation: number, idTrip: number, userValuated: number , userWhoValuated:number, rating: number, comments: string) {
      this.idValuation = idValuation;
      this.idTrip = idTrip;
      this.userValuated = userValuated;
      this.userWhoValuated =userWhoValuated
      this.rating = rating;
      this.comments = comments;
    }
  }
  