import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminUserUpdateResponseDto } from '../../models/Admin/AdminUserUpdateResponseDto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-user-ad',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './edit-user-ad.component.html',
  styleUrl: './edit-user-ad.component.css'
})
export class EditUserAdComponent {

  iduser: string = '';

  @Input() set id(id: string) {
    this.iduser = id
  }
  userDetails!: AdminUserUpdateResponseDto;

  updateuserForm: FormGroup;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log(this.iduser)
    this.loadUserDetails(parseInt(this.iduser, 10))
  }

  constructor(private userService: UserService, private fb: FormBuilder, private router: Router) {
    this.updateuserForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', ],
      phone: ['', ],
      bank: [''],
      cbu: [''],
      cuil: [''],
      password: ['',], // Agregar validación de contraseña
      deleted: [false],
      blocked: [false],
      commentBlocked: [''],
      rol: [{ value: '', disabled: true }]
    });
  }


  loadUserDetails(userId: number): void {
    console.log('MIRAR US',userId);
    this.userService.getUserDetailsForAdmin(userId).subscribe({
      next: (data) => {
        this.userDetails = data;
        // Llenar el formulario con los datos del usuario
        this.updateuserForm.patchValue({
          name: data.name,
          lastname: data.lastname,
          password: data.password,
          email: data.email,
          phone: data.phone,
          bank: data.bank,
          cbu: data.cbu,
          cuil: data.cuil,
          deleted: data.deleted,
          blocked: data.blocked,
          commentBlocked: data.commentBlocked,
          rol: data.rol
        });
      },
      error: (error) => {
        console.error('Error loading user details:', error);
      }
    });
  }

  
updateUser(): void {
  if (this.updateuserForm.valid) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Confirma si deseas actualizar los datos del usuario.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, actualizar!',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedData = this.updateuserForm.value;
        const id = parseInt(this.iduser, 10);
        this.userService.updateUserByAdmin(id, updatedData).subscribe({
          next: (response) => {
            // Asumimos que quieres mostrar otro SweetAlert para confirmar que la operación fue exitosa
            Swal.fire(
              'Actualizado!',
              'Los datos del usuario han sido actualizados.',
              'success'
            );
          },
          error: (error) => {
            // En caso de error, mostramos un SweetAlert indicando el fallo
            console.log(error)
            Swal.fire(
              'Error!',
              'No se pudo actualizar el usuario: ' + error.message,
              'error'
            );
          }
        });
      }
    });
  } else {
    // Si el formulario no es válido, puedes mostrar una alerta
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Por favor, revisa los datos del formulario antes de enviar.'
    });
  }
}
}
