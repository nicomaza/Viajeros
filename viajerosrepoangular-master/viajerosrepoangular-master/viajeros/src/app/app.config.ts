import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { HttpClient, provideHttpClient } from '@angular/common/http';

import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes, withComponentInputBinding()), provideHttpClient(),  provideCharts(withDefaultRegisterables()), // Esto es clave para que funcione Chart.js
  ]
};
