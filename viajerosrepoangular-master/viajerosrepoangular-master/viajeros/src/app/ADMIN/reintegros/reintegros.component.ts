import { Component, OnInit } from '@angular/core';
import { ReintegroService } from '../../services/reintegro.service';
import { ReintegroDto } from '../../models/Reintegro/ReintegroDto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PaymentsService } from '../../services/payments.service';
import { ResponsePaymentDto } from '../../models/Payments/ResponsePaymentDto';
import { UpdateReintegroDto } from '../../models/Reintegro/UpdateReintegroDto';
import Swal from 'sweetalert2';
import { MercadopagoService } from '../../services/mercadopago.service';

@Component({
  selector: 'app-reintegros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reintegros.component.html',
  styleUrl: './reintegros.component.css'
})
export class ReintegrosComponent implements OnInit {
  reintegros: ReintegroDto[] = [];
  reintegroSeleccionado: ReintegroDto | null = null;

  reintegrosFiltrados: ReintegroDto[] = [];
  filtroEstado: string = '';
  payment: ResponsePaymentDto | null = null;
  error: string | null = null;
  idPaymentSelected: number = 0;

  paymentDto: ResponsePaymentDto | null = null;
  editStatus: string = '';
  editComments: string = '';

  updateDto: UpdateReintegroDto = {
    idReintegro: 0, // Establecer según lógica
    nuevoEstado: '',
    idAdministrador: 123 // Establecer según lógica, por ejemplo, id de sesión del usuario
  };

  reintegroAmount: number | undefined;
  constructor(private reintegroService: ReintegroService, private paymentService: PaymentsService,
    private route: ActivatedRoute, private mercadoPagoService: MercadopagoService) { }

  ngOnInit(): void {
    this.loadReintegros();
    this.filtrarPorEstado();

    this.route.params.subscribe(params => {
      const id = +params['id']; // El '+' convierte el parámetro de string a número
      if (id) {
        this.paymentService.getPaymentById(id).subscribe({
          next: (data) => this.payment = data,
          error: (err) => this.error = 'Error al cargar el pago: ' + err.message
        });
      }
    });
  }
  openReintegroModal(reintegro: ReintegroDto): void {
    this.idPaymentSelected = reintegro.paymentId;
    this.reintegroAmount = 10; // Reinicia el monto cuando se abre el modal
    // Abre el modal usando Bootstrap


  }
  
  openEditModal(idPayment: number, reintegro: ReintegroDto) {
    this.paymentService.getPaymentById(idPayment).subscribe({
      next: (response) => {
        this.paymentDto = response;
        this.editStatus = this.paymentDto.status;
        this.editComments = ''; // Reset comments or fetch existing comments if necessary
      },
      error: (error) => {
        console.error('Failed to load payment details', error);
      }
    });
    this.reintegroSeleccionado = reintegro;

    this.idPaymentSelected = idPayment
  }

  submitUpdate(): void {
    if (this.reintegroSeleccionado) {
      this.updateDto.idReintegro = this.reintegroSeleccionado.idReintegro;
    }

    const idAdmin = localStorage.getItem('userId');
    if (idAdmin) {
      this.updateDto.idAdministrador = +idAdmin;
    }
console.log(this.updateDto)
    this.reintegroService.updateReintegro(this.updateDto).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Exito!',
          text: 'Reintegro actualizado correctamente',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        console.log('Reintegro actualizado correctamente:', response);
      },
      error: (error) => {
        Swal.fire({
          title: 'Error!',
          text: 'Error al actualizar el reintegro',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        console.error('Error al actualizar el reintegro:', error);
      }
    });
  }

  loadReintegros(): void {
    this.reintegroService.getAllReintegros().subscribe({
      next: (data) => {
        this.reintegros = data.map(reintegro => ({
          ...reintegro,
          fechaReintegro: this.convertToDate(reintegro.fechaReintegro)
        }));
        this.totalPages = Math.ceil(this.reintegros.length / this.pageSize);
        this.updateFilteredReintegros();
      },
      error: (error) => {
        console.error('Error al cargar los reintegros', error);
      }
    });
  }
  
  filtrarPorEstado(): void {
    if (!this.filtroEstado) {
      this.reintegrosFiltrados = this.reintegros;
    } else {
      this.reintegrosFiltrados = this.reintegros.filter(reintegro => reintegro.status === this.filtroEstado);
    }
  }

  translateStatus(status: string): string {
    const statusTranslations: { [key: string]: string } = {
      'NULL': 'No Solicitado',
      'REQUIRED': 'Reintegro Solicitado',
      'RETURNED': 'Reintegro Completado',
      'REJECTED': 'Reintegro Rechazado'
    };
    return statusTranslations[status] || status;
  }

  translateMotivo(motivo: string): string {
    const motivoTranslations: { [key: string]: string } = {
      'DRIVER_REQUEST': 'Solicitado por el Chofer',
      'PASSENGER_CANCEL': 'Cancelado por el Pasajero'
    };
    return motivoTranslations[motivo] || motivo;
  }
  private convertToDate(dateArray: any): Date {
    if (Array.isArray(dateArray)) {
      return new Date(
        dateArray[0], // Año
        dateArray[1] - 1, // Mes
        dateArray[2], // Día
        dateArray[3] || 0, // Hora
        dateArray[4] || 0 // Minuto
      );
    }
    return dateArray; // Si ya es Date, lo devolvemos tal cual
  }


  realizarReintegro(paymentId: string, amount?: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Estás por hacer la devolución automática del dinero en la plataforma oficial de Mercado Pago y no hay vuelta atrás. ¿Estás seguro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, realizar reintegro',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('ACA ESTAN LOS DATOS DEL REINGREGO', paymentId, amount);
        this.mercadoPagoService.realizarReintegro(paymentId, amount).subscribe({
          next: (response) => {
            console.log('Reintegro realizado con éxito:', response);
            Swal.fire('Reintegro realizado', 'El reintegro se ha realizado con éxito.', 'success');

            this.loadReintegros();
          },
          error: (error) => {
            console.error('Error al realizar el reintegro:', error);
            Swal.fire('Error', 'Hubo un problema al realizar el reintegro.', 'error');
          }
        });
      } else {
        console.log('Reintegro cancelado por el usuario');
      }
    });
  }
  

  pageSize = 10; // Número de elementos por página
  currentPage = 1; // Página actual
  totalPages = 0; // Total de páginas
  updateFilteredReintegros(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.reintegrosFiltrados = this.reintegros.slice(startIndex, endIndex);
  }
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateFilteredReintegros();
    }
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateFilteredReintegros();
    }
  }
  
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateFilteredReintegros();
    }
  }
  getPageNumbers(): number[] {
    const totalPagesToShow = 5; // Número de páginas a mostrar
    const halfPagesToShow = Math.floor(totalPagesToShow / 2);
    let startPage = Math.max(this.currentPage - halfPagesToShow, 1);
    let endPage = Math.min(startPage + totalPagesToShow - 1, this.totalPages);
  
    if (endPage - startPage < totalPagesToShow - 1) {
      startPage = Math.max(endPage - totalPagesToShow + 1, 1);
    }
  
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }
      
  
  
}