export interface Localidad {
    id: number;
    provincia: Provincia; // Asegúrate de tener un modelo para Provincia también
    localidad: string;
  }
  
  export interface Provincia {
    id: number;
    nombre: string; // Suponiendo que solo tiene nombre, ajusta si es necesario
  }
  