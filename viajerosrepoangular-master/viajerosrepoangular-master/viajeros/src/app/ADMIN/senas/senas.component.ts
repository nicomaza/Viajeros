import { Component, ElementRef,ViewChild, OnInit } from '@angular/core';
import { PagoPasajeroDto } from '../../models/Admin/PagoPasajeroDto';
import { PaymentsService } from '../../services/payments.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { TranslateStatusPipe } from "./translate-status.pipe";
import { FiltroEstadoChoferPipePipe } from "./filtro-estado-chofer-pipe.pipe";


@Component({
  selector: 'app-senas',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateStatusPipe, FiltroEstadoChoferPipePipe],
  templateUrl: './senas.component.html',
  styleUrl: './senas.component.css'
})
export class SenasComponent implements OnInit {

  paymentForm: FormGroup;
  estadoFiltro: string = '';


  pagos: PagoPasajeroDto[] = [];
  pagoPasajeroDto!: PagoPasajeroDto;
  requestDriverPaymentDto = {
    idPago: 0,
    estado: 'PENDIENTE',
    idTransferenciaChofer: 0
  };


  constructor(private pagoService: PaymentsService) {
    this.paymentForm = new FormGroup({
      estado: new FormControl('', Validators.required),
      idTransferenciaChofer: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.cargarPagos();
  }

  selectPago(pago: PagoPasajeroDto) {
    this.pagoPasajeroDto = pago;
  }


  paidChofer(pago: PagoPasajeroDto) {
    this.pagoPasajeroDto = pago
  }
  cargarPagos(): void {
    this.pagoService.obtenerPagosPasajeros().subscribe({
      next: (pagos) => {
        this.pagos = pagos;
        this.totalPages = Math.ceil(this.pagos.length / this.pageSize);
        this.updateFilteredPagos();
      },
      error: (error) => console.error('Error al obtener los pagos de pasajeros', error)
    });
  }
  

  actualizarPago() {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    const requestDriverPaymentDto = {
      idPago: this.pagoPasajeroDto.idPayment,
      estado: this.paymentForm.get('estado')?.value,
      idTransferenciaChofer: this.paymentForm.get('idTransferenciaChofer')?.value
    };

    this.pagoService.updateDriverPaymentStatus(requestDriverPaymentDto).subscribe(
      response => {
        // Alerta de éxito con SweetAlert
        Swal.fire({
          icon: 'success',
          title: 'Actualización exitosa',
          text: 'Pago actualizado exitosamente.',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.cargarPagos(); // Recargar la lista de pagos después de la alerta

    
        });
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar el pago',
          text: 'Hubo un problema al actualizar el pago. Inténtelo de nuevo.',
          confirmButtonText: 'Aceptar'
        });
        console.error('Error al actualizar el pago:', error);
      }
    );
  }



  pageSize = 10; // Número de elementos por página
currentPage = 1; // Página actual
totalPages = 0; // Total de páginas
filteredPagos: PagoPasajeroDto[] = []; // Lista filtrada por página
updateFilteredPagos(): void {
  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.filteredPagos = this.pagos.slice(startIndex, endIndex);
}
goToPage(page: number): void {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
    this.updateFilteredPagos();
  }
}

nextPage(): void {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.updateFilteredPagos();
  }
}

previousPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.updateFilteredPagos();
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