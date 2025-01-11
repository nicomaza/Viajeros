import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PrincipalComponent } from './principal/principal.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { RegisterComponent } from './register/register.component';
import { ListMessagesComponent } from './list-messages/list-messages.component';
import { ProfileComponent } from './profile/profile.component';
import { adminGuard, authGuard } from './services/auth.guard';
import { noAuthGuard } from './services/no-auth.guard';
import { PasswordrecoveryComponent } from './passwordrecovery/passwordrecovery.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { MisDatosComponent } from './profilecomponents/mis-datos/mis-datos.component';
import { MisBancosComponent } from './profilecomponents/mis-bancos/mis-bancos.component';
import { MiCuentaComponent } from './profilecomponents/mi-cuenta/mi-cuenta.component';
import { VehicleComponent } from './profilecomponents/vehicle/vehicle.component';
import { VehicleEditComponent } from './profilecomponents/vehicle-edit/vehicle-edit.component';
import { MisMascotasComponent } from './profilecomponents/mis-mascotas/mis-mascotas.component';
import { EditMascotaComponent } from './profilecomponents/edit-mascota/edit-mascota.component';
import { NewTripComponent } from './new-trip/new-trip.component';
import { SearchTripComponent } from './search-trip/search-trip.component';
import { ViajesBuscadosComponent } from './viajes-buscados/viajes-buscados.component';
import { MisViajesComponent } from './mis-viajes/mis-viajes.component';
import { ChatComponent } from './chat/chat.component';
import { SubirmeComponent } from './subirme/subirme.component';
import { PaymentConfirmationComponent } from './payment-confirmation/payment-confirmation.component';
import { ManageUsersComponent } from './ADMIN/manage-users/manage-users.component';
import { ViajesComponent } from './ADMIN/viajes/viajes.component';
import { ReintegrosComponent } from './ADMIN/reintegros/reintegros.component';
import { SenasComponent } from './ADMIN/senas/senas.component';
import { StadisticsComponent } from './ADMIN/stadistics/stadistics.component';
import { IncidentesComponent } from './ADMIN/incidentes/incidentes.component';
import { VehiculosComponent } from './ADMIN/vehiculos/vehiculos.component';
import { VehiculosEditComponent } from './ADMIN/vehiculos-edit/vehiculos-edit.component';
import { FaqsComponent } from './faqs/faqs.component';
import { TermsComponent } from './terms/terms.component';
import { EditUserAdComponent } from './ADMIN/edit-user-ad/edit-user-ad.component';

export const routes: Routes = [{
    path: 'home',
    component: HomeComponent,
    canActivate: [noAuthGuard]
},
{
    path: 'register',
    component: RegisterComponent,
    canActivate: [noAuthGuard]
},
{
    path: 'profile',
    component: ProfileComponent
},
{
    path: 'notifications',
    component: NotificationsComponent
},
{
    path: 'principal',
    component: PrincipalComponent,
    canActivate: [authGuard],
},
{
    path: 'listMenssages',
    component: ListMessagesComponent
},
{
    path: 'passRecovery',
    component: ForgotPasswordComponent
},
{
    path: 'renewPass',
    component: PasswordrecoveryComponent
},
{
    path: 'vehicle',
    component: VehicleComponent
},
{
    path: 'vehicle-edit',
    component: VehicleEditComponent
},
{
    path: 'mis-datos',
    component: MisDatosComponent,
    canActivate: [authGuard],
},
{
    path: 'mi-cuenta',
    component: MiCuentaComponent,
    canActivate: [authGuard],
},
{
    path: 'mis-bancos',
    component: MisBancosComponent,
    canActivate: [authGuard],
},
{
    path: 'mis-mascotas',
    component: MisMascotasComponent,
    canActivate: [authGuard],
},
{
    path: 'edit-mascotas',
    component: EditMascotaComponent,
    canActivate: [authGuard],
},
{
    path: 'edit-profile',
    component: EditProfileComponent,
    canActivate: [authGuard],
},
{
    path: 'new-trip',
    component: NewTripComponent,
    canActivate: [authGuard],
},
{
    path: 'search-trip',
    component: SearchTripComponent,
    canActivate: [authGuard],
},
{
    path: 'viajes-buscados',
    component: ViajesBuscadosComponent,
    canActivate: [authGuard],
},
{
    path: 'faqs',
    component: FaqsComponent,
},
{
    path: 'terms',
    component: TermsComponent,
},
{
    path: 'payment-confirmation',
    component: PaymentConfirmationComponent,
    canActivate: [authGuard],
},
{
    path: 'subirme/:tripId',
    component: SubirmeComponent,
    canActivate: [authGuard],
},
{
    path: 'mis-viajes',
    component: MisViajesComponent,
    canActivate: [authGuard],
},
{
    path: 'chat/:tripId',
    component: ChatComponent
},
{
    path: 'admin/manage-users',
    component: ManageUsersComponent,
    canActivate: [adminGuard],
},
{
    path: 'admin/edit-user-ad/:id',
    component: EditUserAdComponent,
    canActivate: [adminGuard],
},
{
    path: 'admin/viajes',
    component: ViajesComponent,
    canActivate: [adminGuard],
},
{
    path: 'admin/reintegros',
    component: ReintegrosComponent,
    canActivate: [adminGuard],
},
{
    path: 'admin/senas',
    component: SenasComponent,
    canActivate: [adminGuard],
},
{
    path: 'admin/stadistics',
    component: StadisticsComponent,
    canActivate: [adminGuard],
},
{
    path: 'admin/incidentes',
    component: IncidentesComponent,
    canActivate: [adminGuard],
},
{
    path: 'admin/vehiculos',
    component: VehiculosComponent,
    canActivate: [adminGuard],
},
{
    path: 'admin/vehiculos/:id',
    component: VehiculosEditComponent,
    canActivate: [adminGuard],
},
{
    path: 'edit-trip/:id',
    component: NewTripComponent
},


{
    path: '',
    component: HomeComponent
},
{
    path: '#',
    component: HomeComponent
},


];
