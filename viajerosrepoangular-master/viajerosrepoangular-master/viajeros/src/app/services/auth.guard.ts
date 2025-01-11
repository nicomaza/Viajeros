import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from './login.service';

export const authGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService); // Inyecta el servicio
  const router = inject(Router); // Inyecta el enrutador
  const role = loginService.getRol();
  // Verifica si el token existe
  const token = loginService.getToken();
  if (token && (role == null || role == 'USER')) {
    return true;
} else {
    router.navigate(['/home']);
    return false;
}

};

export const adminGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  const token = loginService.getToken();
  const role = loginService.getRol(); // Obtener el rol del localStorage

  if (token && role === 'ADMIN') {
    // Si el token existe y el rol es 'ADMIN', permite el acceso
    return true;
  } else {
    // Si no es administrador, redirige al usuario a la página principal
    router.navigate(['/principal']);
    return false;
  }
};