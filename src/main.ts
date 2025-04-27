import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { KeycloakHelperService } from './app/services/keycloak-helper.service';

bootstrapApplication(AppComponent, {
  providers: [
    KeycloakHelperService,
    provideClientHydration()
  ]
}).catch(err => console.error(err));
