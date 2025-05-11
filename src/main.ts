import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { KeycloakHelperService } from './app/services/keycloak-helper.service';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    KeycloakHelperService,
    provideClientHydration(),
    provideHttpClient()
  ]
}).catch(err => console.error(err));
