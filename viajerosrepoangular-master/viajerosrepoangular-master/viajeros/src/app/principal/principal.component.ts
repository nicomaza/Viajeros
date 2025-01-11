import { Component } from '@angular/core';
import { PhoneNavbarComponent } from "../phone-navbar/phone-navbar.component";
import { Router, RouterLink, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { UserDataDto } from '../models/User/UserDataDto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [PhoneNavbarComponent, RouterLink, ReactiveFormsModule],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {
  
  userdata!: UserDataDto;
  constructor(private userService:UserService, private router:Router){
  }
  haveBankAccount() {
    this.userService.getUserDataById().subscribe(
      (data) => {
        this.userdata = data;

        // Verifica si el CBU está vacío o no registrado
        if (!this.userdata.cbu || this.userdata.cbu.length === 0) {
          Swal.fire({
            title: 'CBU no registrado',
            text: 'No tienes un CBU registrado en tu cuenta. Por favor, registra uno antes de continuar.',
            icon: 'warning',
            confirmButtonText: 'Registrar CBU'
          }).then((result) => {
            if (result.isConfirmed) {
              // Navega a la página de registro de CBU o cuenta bancaria
              this.router.navigate(['/mis-bancos']);
            }
          });
        } else {
          // Si tiene un CBU registrado, navega a la página de nuevo viaje
          this.router.navigate(['/new-trip']);
        }
      },
      (error) => {
        console.error('Error al obtener datos del usuario:', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al obtener los datos del usuario. Inténtalo de nuevo más tarde.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }

}
