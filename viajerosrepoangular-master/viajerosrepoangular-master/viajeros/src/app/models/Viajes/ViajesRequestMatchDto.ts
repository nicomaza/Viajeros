export class ViajesRequestMatchDto {
    origin: number;
    destination: number;
    petsAllowed: boolean;
    smokersAllowed: boolean;
    fechaHoraInicio: Date;
    equipajePermitido: number;
    localidadInicioId: number;
    localidadFinId: number;
  
    constructor(
      origin: number,
      destination: number,
      petsAllowed: boolean,
      smokersAllowed: boolean,
      fechaHoraInicio: Date,
      equipajePermitido: number,
      localidadInicioId: number,
      localidadFinId: number
    ) {
      this.origin = origin;
      this.destination = destination;
      this.petsAllowed = petsAllowed;
      this.smokersAllowed = smokersAllowed;
      this.fechaHoraInicio = fechaHoraInicio;
      this.equipajePermitido = equipajePermitido;
      this.localidadInicioId = localidadInicioId;
      this.localidadFinId = localidadFinId;
    }
  }
  