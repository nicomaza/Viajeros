export class CarResponseDto {
    idCar: number;
    brand: string;
    model: string;
    patent: string;
    color: string;
    fuel: string;
    kml: string;
    gnc: boolean;
    deleted:boolean;
  
    constructor(
      idCar: number,
      brand: string,
      model: string,
      patent: string,
      color: string,
      fuel: string,
      kml: string,
      gnc: boolean,
      deleted:boolean
    ) {
      this.idCar = idCar;
      this.brand = brand;
      this.model = model;
      this.patent = patent;
      this.color = color;
      this.fuel = fuel;
      this.kml = kml;
      this.gnc = gnc;
      this.deleted = deleted;
    }
  }
  