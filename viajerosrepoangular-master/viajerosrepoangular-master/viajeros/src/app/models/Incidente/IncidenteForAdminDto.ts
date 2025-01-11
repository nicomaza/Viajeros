export interface IncidenteForAdminDto {
    idIncidente: number;
    idDenunciado: number;
    nombreCompletoDenunciado: string;
    idDenunciante: number;
    nombreCompletoDenunciante: string;
    comentarios: string;
    estado: string;
    tipoIncidente: string;
    fechaIncidente: Date;
    isPasajero: boolean;
    resolucion: string;
    fechaResolucion: Date;
  }
  