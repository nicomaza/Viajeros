import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../services/login.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { LoginResponseDto } from '../models/LoginResponseDto';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  login = {
    username: '',
    pass: ''
  }

  // Inyectar el servicio de login y el router
  constructor(private loginService: LoginService, private router: Router) { }
  private userRoleSubject = new BehaviorSubject<string | null>(null);


  getUserRole(): Observable<string | null> {
    return this.userRoleSubject.asObservable();
  }
  onSubmit() {
    this.loginService.login(this.login.username, this.login.pass).subscribe(
      response => {
        const token = response.token; // Extrae el token
        const userId = response.id;    // Extrae el ID del usuario
        const userName = response.name; // Extrae el nombre del usuario
        const userRol = response.role;
        this.userRoleSubject.next(userRol);
        // Guarda el token, el ID y el nombre en local storage
        this.loginService.saveSessionData(token, userId, userName, userRol);
        this.loginService.saveToken(token); // Guarda el token en local storage

        if (userRol == 'USER') {
          this.router.navigate(['/principal']); // Redirige a otra ruta, por ejemplo: /principal

        } else {
          this.router.navigate(['/admin/stadistics'])
        }
      },
      error => {
        const errorResponse: LoginResponseDto = error.error;
        console.error('Error en el login:', errorResponse);

        if (errorResponse.userFalse) {
          Swal.fire({
            icon: "error",
            title: "Usuario no existe",
            text: "¿Estás registrado?",
            footer: '<a href="/register" id="register-link">Registrarme</a>'
          });


        } else if (errorResponse.passwordFalse) {
          Swal.fire({
            icon: "error",
            title: "Contraseña incorrecta",
            text: "¿Olvidaste tu contraseña?",
            footer: '<a href="/passRecovery">Recuperar contraseña</a>'
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Algo salió mal, inténtalo de nuevo.",
            footer: '<a href="#">Contactar soporte</a>'
          });
        }
      }
    );
  }

}
