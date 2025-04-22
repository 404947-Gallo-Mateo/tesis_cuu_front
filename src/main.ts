import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { APP_INITIALIZER } from '@angular/core';
import { AppComponent } from './app/app.component';
import { KeycloakHelperService } from './app/services/keycloak-helper.service';

export function initializeKeycloak(keycloakService: KeycloakHelperService) {
  return () => keycloakService.init();
}

bootstrapApplication(AppComponent, {
  providers: [
    KeycloakHelperService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakHelperService]
    },
    provideClientHydration()
  ]
}).catch(err => console.error(err));
