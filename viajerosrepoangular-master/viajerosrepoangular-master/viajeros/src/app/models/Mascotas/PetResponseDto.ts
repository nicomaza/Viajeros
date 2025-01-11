export class PetResponseDto {
    idPet: number;        // ID de la mascota
    deleted: boolean;     // Indicador si la mascota está eliminada
    canil: boolean;       // Indicador si la mascota está en un canil
    idSize: string;     // Nombre del tamaño (por ejemplo: "Chico", "Mediano", "Grande")
    idType: string;     // Tipo de mascota (por ejemplo: "Perro", "Gato")
    userId: number;       // ID del usuario dueño de la mascota
    name:string
  
    constructor(
      idPet: number,
      deleted: boolean,
      name:string,
      canil: boolean,
      idSize: string,
      idType: string,
      userId: number
    ) {
      this.idPet = idPet;
      this.deleted = deleted;
      this.canil = canil;
      this.idSize = idSize;
      this.idType = idType;
      this.userId = userId;
      this.name = name;
    }
  }
  