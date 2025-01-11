export class Vehicle {
    idCar: number;
    brand: string;
    model: string;
    patent: string;
    color: string;
    fuel: string;
    gnc: boolean;
    kmL: string;
    deleted: boolean;
  
    constructor(
      idCar: number,
      brand: string,
      model: string,
      patent: string,
      color: string,
      fuel: string,
      gnc: boolean,
      kmL: string,
      deleted: boolean
    ) {
      this.idCar = idCar;
      this.brand = brand;
      this.model = model;
      this.patent = patent;
      this.color = color;
      this.fuel = fuel;
      this.gnc = gnc;
      this.kmL = kmL;
      this.deleted = deleted;
    }
  }
  
  export class Pet {
    idPet: number;
    name: string;
    deleted: boolean;
    canil: boolean;
    size: string;
    type: string;
  
    constructor(
      idPet: number,
      name: string,
      deleted: boolean,
      canil: boolean,
      size: string,
      type: string
    ) {
      this.idPet = idPet;
      this.name = name;
      this.deleted = deleted;
      this.canil = canil;
      this.size = size;
      this.type = type;
    }
  }
  
  export class Valuation {
    idValuation: number;
    idTrip: number;
    comments: string;
    rating: number;
  
    constructor(idValuation: number, idTrip: number, comments: string, rating: number) {
      this.idValuation = idValuation;
      this.idTrip = idTrip;
      this.comments = comments;
      this.rating = rating;
    }
  }
  
  export class UserDataDto {
    idUser: number;
    name: string;
    lastname: string;
    email: string;
    bank: string;
    cbu: string;
    cuil: string;
    phone: number;
    deleted: boolean;
    profileImage: string;
    registrationDate: Date;
    vehicles: Vehicle[];
    pets: Pet[];
    valuations: Valuation[];
    constructor() {
      this.idUser = 0;
      this.name = '';
      this.lastname = '';
      this.email = '';
      this.bank = '';
      this.cbu = '';
      this.cuil = '';
      this.phone = 0;
      this.deleted = false;
      this.profileImage = '';
      this.registrationDate = new Date();
      this.vehicles = [];
      this.pets = [];
      this.valuations = [];
  }
    
  }
  