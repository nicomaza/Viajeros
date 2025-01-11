import { Component, OnInit } from '@angular/core';
import { Incidente } from '../../models/Incidente/Incidente';
import { IncidentesService } from '../../services/incidentes.service';
import { CommonModule } from '@angular/common';
import { IncidenteDto } from '../../models/Viajes/IncidenteDto';
import { FormsModule } from '@angular/forms';
import { IncidenteForAdminDto } from '../../models/Incidente/IncidenteForAdminDto';
import { ResolveIncidenteDto } from '../../models/Incidente/ResolveIncidenteDto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-incidentes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './incidentes.component.html',
  styleUrl: './incidentes.component.css'
})
export class IncidentesComponent  implements OnInit {
  incidentes: IncidenteForAdminDto[] = [];
  incidentesFiltrados: IncidenteForAdminDto[] = [];
  resolucion: string = '';
  incidenteActual: IncidenteForAdminDto | null = null;
  filtroEstado: string = '';
  idUser: string = '';

  estadoResolucion: string = '';


  constructor(private incidentesService: IncidentesService) { }

  ngOnInit(): void {
    this.cargarIncidentes();
    const idUser =localStorage.getItem('idUser')
    if(idUser){
      this.idUser = idUser;
    } 
  }

  cargarIncidentes(): void {
    this.incidentesService.getIncidentesForAdmin().subscribe({
      next: (data) => {
        this.incidentes = data;
        this.totalPages = Math.ceil(this.incidentes.length / this.pageSize);
        this.updateFilteredIncidentes();
      },
      error: (error) => {
        console.error('Error al cargar los incidentes', error);
      }
    });
  }
  
  selectIncidente(incidente: IncidenteForAdminDto): void {
    this.incidenteActual = incidente;
    this.resolucion = '';
    this.estadoResolucion = 'RESUELTO'; // Valor inicial, puede cambiar según la lógica de la UI
  }
  resolverIncidente(): void {
    if (!this.incidenteActual) return;

    const resolveDto: ResolveIncidenteDto = {
        idUser: parseInt(this.idUser, 10),
        resolucion: this.resolucion,
        estadoResolucion: this.estadoResolucion
    };

    this.incidentesService.resolverIncidente(this.incidenteActual.idIncidente, resolveDto).subscribe({
        next: () => {
            Swal.fire({
                icon: 'success',
                title: 'Incidente resuelto',
                text: 'Incidente resuelto con éxito',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                this.cargarIncidentes(); // Recargar los incidentes después de cerrar el SweetAlert
            });
        },
        error: (error) => {
            console.error('Error al resolver el incidente', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al resolver el incidente. Inténtelo de nuevo.',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}


  filtrarPorEstado(): void {
    if (!this.filtroEstado) {
      this.incidentesFiltrados = this.incidentes;
    } else {
      this.incidentesFiltrados = this.incidentes.filter(incidente => incidente.estado === this.filtroEstado);
    }
  }

  pageSize = 10; // Número de elementos por página
currentPage = 1; // Página actual
totalPages = 0; // Total de páginas
updateFilteredIncidentes(): void {
  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.incidentesFiltrados = this.incidentes.slice(startIndex, endIndex);
}
goToPage(page: number): void {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
    this.updateFilteredIncidentes();
  }
}

nextPage(): void {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.updateFilteredIncidentes();
  }
}

previousPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.updateFilteredIncidentes();
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