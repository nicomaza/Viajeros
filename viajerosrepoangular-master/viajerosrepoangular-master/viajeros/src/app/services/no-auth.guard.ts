import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from './login.service';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService); // Inyecta el servicio
  const router = inject(Router); // Inyecta el enrutador

  // Verifica si el token existe
  const token = loginService.getToken();
  if (token) {
    // Si el token existe (usuario ya está logueado), redirige a la página principal
    router.navigate(['/principal']); // Redirige a la página principal o donde prefieras
    return false; // Bloquea el acceso a la página de login
  } else {
    // Si no hay token, permite el acceso a la página de login
    return true;
  }
};