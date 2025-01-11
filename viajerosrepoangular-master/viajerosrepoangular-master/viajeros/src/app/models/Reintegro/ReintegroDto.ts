// models/reintegro.dto.ts

export interface ReintegroDto {
    idReintegro: number;
    status: string;
    adminReintegroId: number | null;
    fechaReintegro: Date; // O Date, dependiendo de cómo manejes las fechas
    reintegroMotivo: string;
    nombreAdminReintegro:string;
    paymentId: number;
  }
  