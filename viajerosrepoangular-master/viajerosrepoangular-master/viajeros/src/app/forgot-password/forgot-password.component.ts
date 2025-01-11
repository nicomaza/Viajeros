import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { passwordValidator } from '../validators/password.validator';
import Swal from 'sweetalert2';
import { Route, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  registerForm: FormGroup;
  constructor(private userservice: UserService, private fb:FormBuilder, private route:Router) { 
    this.registerForm = this.fb.group({
      email: ['', [Validators.required]],

    });
  }
 

  sendMail() {
    this.userservice.userRecovery(this.registerForm.get('email')?.value).subscribe(
        response => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Se envio un correo de confirmacion",
            text: "Ingresa a la bandeja de entrada de tu correo y segui las instrucciones",
            showConfirmButton: true,
          });
          this.route.navigate(['/home']);
        },
        error => {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "El correo no existe tenes que registrarte",
            text: "Ingresa a la seccion de registro",
            showConfirmButton: true
          });
         }
    );
}

}
