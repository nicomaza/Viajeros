import { Component } from '@angular/core';
import { PhoneNavbarComponent } from "../phone-navbar/phone-navbar.component";
import { LoginService } from '../services/login.service';
import { ActivatedRoute, Route, Router, RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';
import { UserDataDto } from '../models/User/UserDataDto';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { UserSummaryDto } from '../models/User/UserSummaryDto';
import { ResponsePaymentDto } from '../models/Payments/ResponsePaymentDto';
import { PaymentsService } from '../services/payments.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [PhoneNavbarComponent, RouterLink, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  userSummary: UserSummaryDto | undefined;
  userdata = new UserDataDto();
  payment: ResponsePaymentDto | null = null;
  error: string | null = null;

  constructor(private loginservice: LoginService, private routes: Router, private userservice: UserService, private paymentService: PaymentsService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.userservice.getUserDataById().subscribe(
      (response) => {
        this.userdata = response
        console.log(response)
      },
      (error) => { console.log(error) }
    );

    this.userservice.getUserSummary().subscribe({
      next: (data) => {
        this.userSummary = data;
        this.userSummary.averageRating = this.userSummary.averageRating ?? 0;  // Asegura un valor por defecto
      },
      error: (err) => console.error('Error loading user summary', err)
    });


    
  }
  round(value: number): number {
    return Math.round(value);
  }
  logout() {

    Swal.fire({
      title: "¿Seguro que quiere desloguearse?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Desloguear"
    }).then((result) => {
      if (result.isConfirmed) {
        this.loginservice.logout();
        this.routes.navigate(['/home']);

      }
    });


  }
}
