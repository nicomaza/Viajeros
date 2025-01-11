import { Component, OnInit } from '@angular/core';
import { ViajeDto } from '../../models/Admin/ViajeDto';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../services/Admin/admin.service';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-viajes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './viajes.component.html',
  styleUrl: './viajes.component.css'
})
export class ViajesComponent implements OnInit {

  // Filtra los viajes según el estado seleccionado

  filterOption!: string;
  startDate!: string;
  endDate!: string;

  viajes: ViajeDto[] = [];  // Lista que contendrá todos los viajes
  filteredViajes: ViajeDto[] = [];  // Lista filtrada que se mostrará en la tabla
  estadoForm: FormGroup;  // Formulario para filtrar por estado
  searchText = '';  // Texto para la búsqueda general




  constructor(private formBuilder: FormBuilder, private adminService: AdminService) {
    this.estadoForm = this.formBuilder.group({
      estado: ['TODOS']  // Valor por defecto
    });
  }

  ngOnInit(): void {
    // Llamada inicial para obtener todos los viajes (sin filtro)
    this.obtenerViajes();
  }
  buscarPorFecha() {
    if (!this.startDate || !this.endDate) {
      Swal.fire({
        icon: 'error',
        title: 'Fechas incompletas',
        text: 'Debes seleccionar ambas fechas de inicio y fin para aplicar el filtro.',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    this.adminService.getViajesPorFecha(this.startDate, this.endDate).subscribe(
      (viajes: ViajeDto[]) => {
        this.filteredViajes = viajes;
        console.log('Viajes filtrados por fecha:', this.filteredViajes);
      },
      (error) => {
        console.error('Error al obtener los viajes filtrados por fecha:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al obtener los viajes. Inténtalo de nuevo.',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }

// Método para verificar si la fecha de fin es mayor o igual a la fecha de inicio
isEndDateValid(): boolean {
  return !this.startDate || !this.endDate || this.endDate >= this.startDate;
}

// Método para verificar si todas las fechas son válidas
areDatesValid(): boolean {
  return this.isEndDateValid();
}



  limpiarFiltros() {
    this.endDate = '';
    this.startDate = '';
    this.filterOption = '';
    this.searchText = '';
   this.obtenerViajes()
  }

  generatePDF(): void {
    const data = document.getElementById('viajesTable'); // Usa el ID que le pondremos a la tabla
    if (data) {
      html2canvas(data).then((canvas) => {
        const imgWidth = 208;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(imgData, 'PNG', 0, 10, imgWidth, imgHeight);
        pdf.save('viajes-listado.pdf');
      });
    }
  }
  






  // Obtener viajes desde el servicio, con opción de filtrar por estado
  obtenerViajes(estado?: string): void {
    this.adminService.getViajes(estado).subscribe(
      (viajes: ViajeDto[]) => {
        this.viajes = viajes.map(viaje => {
          let startDate: Date;

          if (Array.isArray(viaje.startDate)) {
            // Construye la fecha a partir del array
            startDate = new Date(
              viaje.startDate[0],       // Año
              viaje.startDate[1] - 1,   // Mes (ajustado ya que los meses en Date van de 0 a 11)
              viaje.startDate[2],       // Día
              viaje.startDate[3] || 0,  // Hora (opcional, default 0)
              viaje.startDate[4] || 0   // Minuto (opcional, default 0)
            );
          } else if (typeof viaje.startDate === 'string') {
            // Si es una cadena en formato ISO, convierte directamente
            startDate = new Date(viaje.startDate);
          } else {
            // En caso de que ya sea un objeto Date o tenga otro tipo
            startDate = viaje.startDate;
          }

          return {
            ...viaje,
            startDate: startDate  // Asigna el `Date` construido a `startDate`
          };


        });
 this.totalPages = Math.ceil(this.viajes.length / this.pageSize);
      this.updateFilteredViajes();
        // Inicialmente muestra todos los viajes en `filteredViajes`
        this.filteredViajes = [...this.viajes];
        console.log(this.filteredViajes);
      },
      (error) => {
        console.error('Error al obtener los viajes:', error);
      }
    );
  }



  // Filtra los viajes según el estado seleccionado
  filtrarPorEstado() {
    const estadoSeleccionado = this.estadoForm.get('estado')?.value;

    if (estadoSeleccionado) {
      this.filteredViajes = this.viajes.filter(viaje =>
        estadoSeleccionado === 'TODOS' || viaje.status === estadoSeleccionado
      );
    } else {
      this.filteredViajes = [...this.viajes];  // Si no hay estado seleccionado, muestra todos
    }
  }

  // Función para buscar en la tabla
  // Función para buscar en la tabla
// Función para buscar en la tabla
searchTable() {
  const searchTextLower = this.searchText.toLowerCase();

  this.filteredViajes = this.viajes.filter(viaje => {
    const idMatch = viaje.id ? viaje.id.toString().toLowerCase().includes(searchTextLower) : false;
    const driverNameMatch = viaje.driverName.toLowerCase().includes(searchTextLower);
    const passengersMatch = viaje.passengers.some(passenger => passenger.toLowerCase().includes(searchTextLower));
    const originMatch = viaje.origin.toLowerCase().includes(searchTextLower);
    const destinationMatch = viaje.destination.toLowerCase().includes(searchTextLower);
    const formattedDate = this.formatDateFilter(viaje.startDate);
    const startDateMatch = formattedDate.includes(searchTextLower);

    // Comprobamos si alguno de los campos coincide
    return idMatch || driverNameMatch || passengersMatch || originMatch || destinationMatch || startDateMatch;
  });
}
formatDateFilter(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Sumamos 1 porque los meses en JavaScript son de 0 a 11
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}


  // Función para formatear la fecha
  formatDate(dateArray: any): string {
    if (Array.isArray(dateArray) && dateArray.length >= 3) {
      // El array contiene [year, month, day, hour, minute], entonces reconstruimos la fecha
      const year = dateArray[0];
      const month = dateArray[1];  // Los meses en JavaScript van de 0 a 11, por lo que no es necesario restar 1
      const day = dateArray[2];

      // Creamos una instancia de Date con el año, mes y día
      const date = new Date(year, month - 1, day);  // Restar 1 al mes ya que en JavaScript los meses son de 0-11

      const formattedDay = String(date.getDate()).padStart(2, '0');
      const formattedMonth = String(date.getMonth() + 1).padStart(2, '0');  // Sumamos 1 porque getMonth() devuelve de 0 a 11
      const formattedYear = date.getFullYear();

      return `${formattedDay}-${formattedMonth}-${formattedYear}`;
    } else {
      return 'Fecha inválida';  // Devuelve un mensaje de error si el array no tiene los datos esperados
    }
  }

  formatStatus(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'Pendiente';
      case 'CREATED':
        return 'Creado';
      case 'IN PROGRESS':
        return 'En Progreso';
      case 'CANCELED':
        return 'Cancelado';
      case 'FINISHED':
        return 'Finalizado';
      case 'DELETED':
        return 'Eliminado';
      default:
        return status;
    }
  }


  pageSize = 10; // Número de elementos por página
  currentPage = 1; // Página actual
  totalPages = 0; // Total de páginas
  
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateFilteredViajes();
    }
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateFilteredViajes();
    }
  }
  
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateFilteredViajes();
    }
  }
  updateFilteredViajes(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredViajes = this.viajes.slice(startIndex, endIndex);
  }
  getPageNumbers(): number[] {
    const totalPagesToShow = 5; // Número máximo de páginas a mostrar en la barra de paginación
    const halfPagesToShow = Math.floor(totalPagesToShow / 2);
    let startPage = Math.max(this.currentPage - halfPagesToShow, 1);
    let endPage = Math.min(startPage + totalPagesToShow - 1, this.totalPages);
  
    // Ajusta el inicio si estamos al final de las páginas
    if (endPage - startPage < totalPagesToShow - 1) {
      startPage = Math.max(endPage - totalPagesToShow + 1, 1);
    }
  
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }
  
}