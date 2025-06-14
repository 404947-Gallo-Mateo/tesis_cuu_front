import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { DatePipe, registerLocaleData } from '@angular/common';
import localeEsExtra from '@angular/common/locales/extra/es';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs, 'es', localeEsExtra);

export const appConfig: ApplicationConfig = {
  providers:  [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    DatePipe,
    { provide: LOCALE_ID, useValue: 'es' }
  ]
};
