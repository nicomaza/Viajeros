export class IsChoferDto {
    ischofer: boolean;       // Indicates if the user is the driver
    idChofer: number;        // ID of the driver
    nombreChofer: string;    // Name of the driver
    idPasajero: number | null; // ID of the passenger (null if the user is the driver)
    nombrePasajero: string | null; // Name of the passenger (null if the user is the driver)
  
    constructor(
      ischofer: boolean, 
      idChofer: number, 
      nombreChofer: string, 
      idPasajero: number | null, 
      nombrePasajero: string | null
    ) {
      this.ischofer = ischofer;
      this.idChofer = idChofer;
      this.nombreChofer = nombreChofer;
      this.idPasajero = idPasajero;
      this.nombrePasajero = nombrePasajero;
    }
  }
  