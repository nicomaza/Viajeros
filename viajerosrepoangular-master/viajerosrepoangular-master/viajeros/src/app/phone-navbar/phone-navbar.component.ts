import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-phone-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './phone-navbar.component.html',
  styleUrl: './phone-navbar.component.css'
})
export class PhoneNavbarComponent {

}
