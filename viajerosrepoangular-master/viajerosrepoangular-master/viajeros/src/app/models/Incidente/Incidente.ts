export interface Incidente {
    idIncidente: number;
    descripcion: string;
    tipoIncidente: string;
    fechaIncidente: string;  // Puedes usar Date si prefieres manejar fechas
    pasajeroId: number;
    estadoResolucion: string;
    resolucion?: string;  // La resolución puede ser opcional
  }
  