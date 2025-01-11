export class NewCarRequestDto {
    userId: number;
    brand: string;
    model: string;
    patent: string;
    color: string;
    fuel: string;    // Añadir este campo
    kml: string;
    gnc: boolean;
  
    constructor(
      userId: number,
      brand: string,
      model: string,
      patent: string,
      color: string,
      fuel: string,   // Añadir este campo en el constructor
      kml: string,
      gnc: boolean
    ) {
      this.userId = userId;
      this.brand = brand;
      this.model = model;
      this.patent = patent;
      this.color = color;
      this.fuel = fuel;  // Inicializar este campo
      this.kml = kml;
      this.gnc = gnc;
    }
  }
  