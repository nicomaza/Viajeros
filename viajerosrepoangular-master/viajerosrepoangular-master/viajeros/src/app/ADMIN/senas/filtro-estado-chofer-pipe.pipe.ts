import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroEstadoChoferPipe',
  standalone: true
})
export class FiltroEstadoChoferPipePipe implements PipeTransform {
  transform(pagos: any[], estadoFiltro: string): any[] {
    if (!estadoFiltro) {
      return pagos;
    }
    return pagos.filter(pago => pago.estadoPagoChofer === estadoFiltro);
  }
}