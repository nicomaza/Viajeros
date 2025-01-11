import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translateStatus',
  standalone: true
})
export class TranslateStatusPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'PAID':
        return 'Pagado';
      case 'PENDING':
        return 'Pendiente';
      case 'REJECTED':
        return 'Rechazado';
      default:
        return value;
    }
  }
}