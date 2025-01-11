import { Pipe, PipeTransform } from '@angular/core';
import { CarResponseDto } from '../../models/Vehicle/CarResponseDto';

@Pipe({
  name: 'filtroPorPatente',
  standalone: true
})
export class FiltroPorPatentePipe  implements PipeTransform {
  transform(vehiculos: CarResponseDto[], patente: string): CarResponseDto[] {
    if (!patente) {
      return vehiculos;
    }
    return vehiculos.filter(car => car.patent.toLowerCase().includes(patente.toLowerCase()));
  }
}