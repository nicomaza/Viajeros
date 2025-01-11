import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { passwordValidator } from '../validators/password.validator';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {
  registerForm: FormGroup;
  constructor(private userService: UserService, private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordValidator()]],
      passwordConfirm: ['', [Validators.required]],
      phone: ['', Validators.required]
    });
  }
}
