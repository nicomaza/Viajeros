export class NewPetRequestDto {
  canil: boolean;       // Indicador si la mascota está en un canil
  idSize: number;       // ID del tamaño (referencia a la tabla de tamaños)
  idType: number;       // ID del tipo (referencia a la tabla de tipos)
  userId: number;       // ID del usuario dueño de la mascota
  name: string;

  constructor(
    canil: boolean,
    idSize: number,
    idType: number,
    userId: number,
    name: string
  ) {
    this.canil = canil;
    this.idSize = idSize;
    this.idType = idType;
    this.userId = userId;
    this.name = name;
  }
}
