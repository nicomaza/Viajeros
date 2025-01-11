import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UpdateUserRequestDto } from '../../models/UpdateUserRequestDto';

@Component({
  selector: 'app-mis-bancos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './mis-bancos.component.html',
  styleUrl: './mis-bancos.component.css'
})
export class MisBancosComponent {
  updatebankForm: FormGroup;
  updateUserRequestDto!: UpdateUserRequestDto;

  constructor(private userService: UserService, private fb: FormBuilder, private router: Router) {
    this.updatebankForm = this.fb.group({
      bank: ['', Validators.required],
      cuil: ['', [Validators.required]],
      cbu: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    const stringId = localStorage.getItem('userId');
    if (stringId) {
      const idNumber = parseInt(stringId, 10);
      if (!isNaN(idNumber)) {
        this.userService.getUserForEdit(idNumber).subscribe(
          (response) => {
            // Asegúrate de que la respuesta tiene la estructura esperada y contiene los datos necesarios
            this.updatebankForm.patchValue({
              bank: response.bank,
              cuil: response.cuil,
              cbu: response.cbu
            });
          },
          (error) => {
            console.error('Error fetching user for edit', error);
            // Aquí puedes manejar errores, como mostrar un mensaje de error al usuario
          }
        );
      } else {
        console.error('Invalid ID');
        // Manejo de error si el ID no es un número
      }
    } else {
      console.error('No ID found in localStorage');
      // Manejo de error si no se encuentra el ID en localStorage
    }
  }

  updateBank() {
    const id = localStorage.getItem('userId'); // Suponiendo que el ID del usuario está guardado en localStorage
    if (id) {
      this.updateUserRequestDto = this.updatebankForm.value

      this.userService.updateUser(+id, this.updateUserRequestDto).subscribe(
        (response) => {
          console.log('User updated successfully', response);
          this.router.navigate(['/edit-profile']); // Redirigir a algún lugar después de la actualización
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
