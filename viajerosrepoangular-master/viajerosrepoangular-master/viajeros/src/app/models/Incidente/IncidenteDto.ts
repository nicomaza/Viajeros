export interface IncidenteDto {
    idIncidente: number;           // Identificador del incidente
    viajeId: number;               // Identificador del viaje relacionado
    descripcion: string;           // Descripción del incidente
    tipoIncidente: string;         // Tipo de incidente (puedes definir un enum si es necesario)
    fechaIncidente: string;        // Fecha del incidente (puede ser string o Date)
    pasajeroId: number;            // ID del pasajero involucrado
    reportadoPorId: number;        // ID del usuario que reportó el incidente
    estadoResolucion: string;      // Estado de la resolución (puedes definir un enum si es necesario)
    resolucion?: string;           // Detalles de la resolución (opcional)
    fechaResolucion?: string;      // Fecha en la que se resolvió el incidente (opcional)
  }
  