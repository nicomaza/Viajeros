export interface IncidenteDto {
    idIncidente: number;
    viajeId: number;
    descripcion: string;
    tipoIncidente: TipoIncidente;
    fechaIncidente: Date;
    isPasajero: boolean;           // Indica si el denunciado es pasajero
    denunciadoId: number;          // ID del usuario denunciado
    reportadoPorId: number;        // ID del usuario que reporta el incidente
    estadoResolucion: EstadoResolucion;
    resolucion?: string;           // opcional, puede que no esté resuelto
    fechaResolucion?: Date;        // opcional, la fecha de resolución
  }
  
  export enum TipoIncidente {
    MALTRATO_CHOFER = 'MALTRATO_CHOFER',
    MALTRATO_PASAJERO = 'MALTRATO_PASAJERO',
    SUCIEDAD = 'SUCIEDAD',
    PROBLEMA_APP = 'PROBLEMA_APP',
    OTRO = 'OTRO'
  }
  
  export enum EstadoResolucion {
    PENDIENTE = 'PENDIENTE',
    RESUELTO = 'RESUELTO',
    NO_RESUELTO = 'NO_RESUELTO'
  }
  