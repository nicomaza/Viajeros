import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { EditProfileResponseDto } from '../../models/User/EditProfileResponseDto';
import { UpdateUserRequestDto } from '../../models/UpdateUserRequestDto';

@Component({
  selector: 'app-mis-datos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './mis-datos.component.html',
  styleUrl: './mis-datos.component.css'
})
export class MisDatosComponent {
  updateuserForm: FormGroup;
  dataEdit!: EditProfileResponseDto;
  updateDataNew!: UpdateUserRequestDto;

  constructor(private userService: UserService, private fb: FormBuilder, private router: Router) {
    this.updateuserForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', [Validators.required]],
      phone: ['', [Validators.required]],
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
          this.router.navigate(['/profile']); // Redirigir a algún lugar después de la actualización
        },
        (error) => {
          console.error('Error updating user', error);
        }
      );
    } else {
      console.error('User ID not found');
    }

  }
}
