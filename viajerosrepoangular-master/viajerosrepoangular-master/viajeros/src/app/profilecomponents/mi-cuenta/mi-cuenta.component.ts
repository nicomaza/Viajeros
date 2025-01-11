import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EditProfileResponseDto } from '../../models/User/EditProfileResponseDto';
import { UpdateUserRequestDto } from '../../models/UpdateUserRequestDto';
import { passwordValidator } from '../../validators/password.validator';
import Swal from 'sweetalert2';
import { routes } from '../../app.routes';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-mi-cuenta',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './mi-cuenta.component.html',
  styleUrl: './mi-cuenta.component.css'
})
export class MiCuentaComponent {


  updateuserForm: FormGroup;
  dataEdit!: EditProfileResponseDto;
  updateDataNew!: UpdateUserRequestDto;

  constructor(private userService: UserService, private loginservice: LoginService, private fb: FormBuilder, private router: Router) {
    this.updateuserForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    const idString = localStorage.getItem('userId');
    if (idString) {
      const id = parseInt(idString, 10); // Convierte el string a número
      this.userService.getUserForEdit(id).subscribe(response => {
        this.dataEdit = response
        console.log(response); // Aquí puedes manejar la respuesta

        this.updateuserForm.patchValue({
          name: this.dataEdit.name,      // Asigna los valores de la respuesta al formulario
          lastname: this.dataEdit.lastname,
          phone: this.dataEdit.phone
        });
      });
    } else {
      console.error('ID not found in localStorage');
    }
  }


  updateUser() {
    this.updateDataNew = this.updateuserForm.value;
    const idString = localStorage.getItem('userId');
    console.log('lo que envio', this.updateDataNew)

    if (idString) {
      const id = parseInt(idString, 10); // Convier
      this.userService.updateUser(id, this.updateDataNew).subscribe(
        (response) => {
          console.log('User updated successfully', response);
          this.loginservice.logout();
          this.router.navigate(['/home']); // Redirigir a algún lugar después de la actualización
        },
        (error) => {
          console.error('Error updating user', error);
        }
      );
    } else {
      console.error('User ID not found');
    }

  }
  updatepassword() {
    Swal.fire({
      title: "¿Seguro que quiere cambiar la contraseña?",
      text: "Quedara desolgueado y tiene que proseguir con los pasos siguientes",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "CAMBIAR PASSWORD"
    }).then((result) => {
      if (result.isConfirmed) {
        this.loginservice.logout();
        this.router.navigate(['/passRecovery']);

      }
    });
  }

  deleteAccount() {
    Swal.fire({
      title: "¿Estás seguro de eliminar tu cuenta?",
      text: "¡No podrás revertir esto, perderas todos tus datos para siempre y quedaras deslogueado!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        // Recuperar el ID del usuario desde el localStorage
        const stringUserId = localStorage.getItem('userId');
        if (stringUserId === null) {
          // Manejar el caso en que no se encuentra el ID del usuario
          Swal.fire("Error", "No se encontró el ID del usuario.", "error");
          return;
        }

        const userId = parseInt(stringUserId, 10); // Convertir el ID de string a entero
        if (isNaN(userId)) {
          // Manejar el caso en que el ID no es un número
          Swal.fire("Error", "El ID del usuario no es válido.", "error");
          return;
        }

        // Llamar al servicio para eliminar el usuario con el ID obtenido
        this.userService.deleteUser(userId).subscribe({
          next: () => {
            Swal.fire("¡Eliminado!", "El usuario ha sido eliminado.", "success");
            this.loginservice.logout();
            this.router.navigate(['/home']);
          },
          error: (error) => {
            Swal.fire("Error", "No se pudo eliminar el usuario. Intente nuevamente más tarde.", "error");
          }
        });
      }
    });
  }
}
