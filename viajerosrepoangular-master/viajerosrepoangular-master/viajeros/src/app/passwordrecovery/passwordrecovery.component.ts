import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { passwordValidator } from '../validators/password.validator';
import Swal from 'sweetalert2';
import { passwordMatchValidator } from '../validators/passwordMatchValidator';

@Component({
  selector: 'app-passwordrecovery',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule, RouterLink],
  templateUrl: './passwordrecovery.component.html',
  styleUrl: './passwordrecovery.component.css'
})
export class PasswordrecoveryComponent implements OnInit{

  recoveryForm: FormGroup;
  token!: string | null;
  newPassword: string = '';

  constructor(private userService: UserService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router) {
    this.recoveryForm = this.fb.group({
      password: ['', [Validators.required]],
      passwordConfirm: ['', [Validators.required]],
    }, { validator: passwordMatchValidator() });
  }
  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  checkPasswords() {
    const password = this.recoveryForm.get('password')?.value;
    const passwordConfirm = this.recoveryForm.get('passwordConfirm')?.value;
    return password === passwordConfirm;
  }

  resetPassword(): void {
    if (this.recoveryForm.valid) {
        const newPassword = this.recoveryForm.get('password')?.value;
        this.userService.resetPassword(this.token, newPassword).subscribe(
            response => {
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Password cambiado con exito",
                text: "Logueate normalmente",
                showConfirmButton: true,
                timer: 1500
              });
                this.router.navigate(['/home']); // Redirigir a la página de inicio de sesión
            },
            error => {
              Swal.fire({
                position: "center",
                icon: "error",
                title: "Ocurrio un error",
                text: "Contactate con soporte",
                showConfirmButton: true
              });
            }
        );
    }
}
  }
