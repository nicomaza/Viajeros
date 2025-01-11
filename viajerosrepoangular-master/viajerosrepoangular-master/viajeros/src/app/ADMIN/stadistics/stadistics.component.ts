import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { AdminService } from '../../services/Admin/admin.service';
import { UsuariosPorDiaDto } from '../../models/Admin/UsuariosPorDiaDto';
import { ViajesPorMesDto } from '../../models/Admin/ViajesPorMesDto';
import { EstadoViajesDto } from '../../models/Admin/EstadoViajesDto';
import { CommonModule } from '@angular/common';
import { PaymentStadisticDto } from '../../models/Admin/PaymentStadisticDto';

@Component({
  selector: 'app-stadistics',
  standalone: true,
  imports: [BaseChartDirective, CommonModule],
  templateUrl: './stadistics.component.html',
  styleUrl: './stadistics.component.css'
})
export class StadisticsComponent implements OnInit {

  public dataLoadedCount: number = 0; // Contador de datos cargados
  public allDataLoaded: boolean = false; // Controla si todos los datos están cargados

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadUsuariosNuevosPorDia();
    this.loadViajesFinalizadosPorMes();
    this.loadEstadosViajes();
    this.loadPaymentStatistics();
  }

  private checkAllDataLoaded(): void {
    if (this.dataLoadedCount === 3) { // Cuando los 3 sets de datos estén cargados
      this.allDataLoaded = true;
    }
  }

  // Gráfico de Usuarios Nuevos por Día
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Usuarios nuevos por día',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Gráfico de Viajes Finalizados por Mes
  public FinalizadosbarChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Viajes finalizados por mes',
        data: [],
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Gráfico de Estados de los Viajes
  public pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        label: 'Estados de los Viajes',
        data: [],
        backgroundColor: [
          'rgba(255, 159, 64, 0.2)', // PENDING
          'rgba(54, 162, 235, 0.2)', // CREATED
          'rgba(75, 192, 192, 0.2)', // IN PROGRESS
          'rgba(255, 99, 132, 0.2)', // CANCELED
          'rgba(153, 102, 255, 0.2)', // DELETED
          'rgba(255, 205, 86, 0.2)', // FINISHED
        ],
        borderColor: [
          'rgba(255, 159, 64, 1)',   // PENDING
          'rgba(54, 162, 235, 1)',   // CREATED
          'rgba(75, 192, 192, 1)',   // IN PROGRESS
          'rgba(255, 99, 132, 1)',   // CANCELED
          'rgba(153, 102, 255, 1)',  // DELETED
          'rgba(255, 205, 86, 1)',   // FINISHED
        ],
        borderWidth: 1,
      },
    ],
  };
  // Tipo de gráfico para el gráfico de torta
  public pieChartType: ChartType = 'pie'; // Asegúrate de que el tipo sea 'pie'



   //gráfico de montos por estado de pago
   public paymentStatusChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        label: 'Monto total',
        data: [],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)', // PAID
          'rgba(255, 205, 86, 0.2)', // PENDING
          'rgba(255, 99, 132, 0.2)', // REJECTED
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)', // PAID
          'rgba(255, 205, 86, 1)', // PENDING
          'rgba(255, 99, 132, 1)', // REJECTED
        ],
        borderWidth: 1,
      },
    ],
  };
  public paymentStatusChartType: ChartType = 'pie';


// Método para cargar los datos de pagos al chofer
loadPaymentStatistics(): void {
  this.adminService.getPaymentStatistics().subscribe((data: PaymentStadisticDto) => {
    this.paymentStatusChartData.labels = ['Pagados', 'Pendientes', 'Rechazados'];
    this.paymentStatusChartData.datasets[0].data = [
      data.paidTotal, // Total de montos pagados
      data.pendingTotal, // Total de montos pendientes
      data.rejectedTotal, // Total de montos rechazados
    ];
    this.dataLoadedCount++; // Incrementar el contador de datos cargados
    this.checkAllDataLoaded(); // Verificar si todos los datos están listos
  });
}




  // Método para cargar Usuarios Nuevos por Día
  loadUsuariosNuevosPorDia(): void {
    this.adminService.getUsuariosNuevosPorDia().subscribe((data: UsuariosPorDiaDto[]) => {
      this.barChartData.labels = data.map(item => item.fecha);
      this.barChartData.datasets[0].data = data.map(item => item.cantidadUsuarios);
      this.dataLoadedCount++; // Incrementar contador de datos cargados
      this.checkAllDataLoaded(); // Verificar si todos los datos están listos
    });
  }

  // Método para cargar Viajes Finalizados por Mes
  loadViajesFinalizadosPorMes(): void {
    this.adminService.getViajesFinalizadosPorMes().subscribe((data: ViajesPorMesDto[]) => {
      this.FinalizadosbarChartData.labels = data.map(item => item.mes);
      this.FinalizadosbarChartData.datasets[0].data = data.map(item => item.cantidadViajesFinalizados);
      this.dataLoadedCount++; // Incrementar contador de datos cargados
      this.checkAllDataLoaded(); // Verificar si todos los datos están listos
    });
  }

  // Método para cargar el Estado de los Viajes
  loadEstadosViajes(): void {
    this.adminService.getEstadoDeLosViajes().subscribe((data: EstadoViajesDto[]) => {
      const total = data.reduce((sum, item) => sum + item.cantidad, 0); // Calcular el total
      this.pieChartData.labels = data.map(
        item => `${this.translateEstado(item.estado)} (${((item.cantidad / total) * 100).toFixed(2)}%)`
      ); // Traducir y agregar el porcentaje con el símbolo
      this.pieChartData.datasets[0].data = data.map(item => (item.cantidad / total) * 100); // Solo calcular los porcentajes
      this.dataLoadedCount++; // Incrementar contador de datos cargados
      this.checkAllDataLoaded(); // Verificar si todos los datos están listos
    });
  }



  translateEstado(estado: string): string {
    const traducciones: { [key: string]: string } = {
      PENDING: 'Pendiente',
      CREATED: 'Creado',
      'IN PROGRESS': 'En progreso',
      CANCELED: 'Cancelado',
      DELETED: 'Eliminado',
      FINISHED: 'Finalizado'
    };
    return traducciones[estado] || estado; // Devuelve el estado original si no hay traducción
  }

}