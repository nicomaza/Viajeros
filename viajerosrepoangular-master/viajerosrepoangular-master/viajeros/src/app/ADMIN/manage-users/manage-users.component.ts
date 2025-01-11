import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserDataDto } from '../../models/User/UserDataDto';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { LoginService } from '../../services/login.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css'
})
export class ManageUsersComponent implements OnInit {


  users: UserDataDto[] = [];
  filteredUsers: UserDataDto[] = [];
  filtroEstado: string = '';  
  commentblock: string = '';
  userSelected!: UserDataDto;
  rolid:number = 0;
  searchTerm: string = ''; // Nuevo: Término de búsqueda
  constructor(private userService: UserService, private loginservice:LoginService, private router:Router) { }

  ngOnInit(): void {
  this.loadusers()

  }
  
loadusers(){
  this.userService.getUsers().subscribe({
    next: (data) => {
      this.users = data;
      this.totalPages = Math.ceil(this.users.length / this.pageSize);
      this.filterUsers(); // Filtrar usuarios después de cargarlos
    },
    error: (error) => {
      console.error('Error al cargar los usuarios:', error);
    }
  });
}



filterUsers(): void {
  let filtered = this.users;

  // Filtrar por estado
  if (this.filtroEstado === 'activo') {
    filtered = filtered.filter(user => !user.deleted);
  } else if (this.filtroEstado === 'inactivo') {
    filtered = filtered.filter(user => user.deleted);
  }

  // Filtrar por término de búsqueda
  if (this.searchTerm.trim()) {
    const term = this.searchTerm.toLowerCase();
    filtered = filtered.filter(user => {
      const formattedDate = formatDate(user.registrationDate, 'dd/MM/yyyy', 'en-US').toLowerCase(); // Formatear la fecha
      return (
        user.name.toLowerCase().includes(term) ||
        user.lastname.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.phone.toString().toLowerCase().includes(term) ||
        formattedDate.includes(term) // Comparar la fecha formateada
      );
    });
  }

  this.filteredUsers = filtered.slice(
    (this.currentPage - 1) * this.pageSize,
    this.currentPage * this.pageSize
  );
}
  selectUser(user: UserDataDto) {
    this.userSelected = user;
  }

  deleteAccount(user: UserDataDto) {

    this.userSelected = user;
    if (!this.userSelected) {
      Swal.fire("Error", "No se ha seleccionado un usuario.", "error");
      return;
    }
  
    Swal.fire({
      title: "¿Estás seguro de eliminar lógicamente este usuario?",
      text: "Este usuario será eliminado lógicamente y podrás recuperarlo más tarde si lo deseas.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        const userId = this.userSelected.idUser; // Usa el ID del usuario seleccionado
  
        // Llamar al servicio para eliminar el usuario lógicamente
        this.userService.deleteUser(userId).subscribe({
          next: () => {
            Swal.fire("¡Eliminado!", "El usuario ha sido eliminado lógicamente.", "success");
            this.loadusers();

          },
          error: (error) => {
            Swal.fire("Error", "No se pudo eliminar el usuario. Intente nuevamente más tarde.", "error");
          }
        });
      }
    });
  }
  
  updateRol() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Deseas cambiar el rol de este usuario?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cambiar rol',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Llamada al servicio para actualizar el rol
        this.userService.updateRole(this.userSelected.idUser, this.rolid).subscribe({
          next: () => {
            Swal.fire(
              'Rol Actualizado',
              'El rol del usuario ha sido cambiado con éxito.',
              'success'
            );
          },
          error: (error) => {
            console.error('Error al actualizar el rol:', error);
            Swal.fire(
              'Error',
              'Hubo un problema al cambiar el rol. Inténtalo nuevamente.',
              'error'
            );
          }
        });
      }
    });
  }
  

  blockUser() {
    console.log(this.blockUser)
  }
  pageSize = 10; // Número de elementos por página
  currentPage = 1; // Página actual
  totalPages = 0; // Total de páginas

  updateFilteredUsers(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredUsers = this.users.slice(startIndex, endIndex);
  }
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateFilteredUsers();
    }
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateFilteredUsers();
    }
  }
  
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateFilteredUsers();
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