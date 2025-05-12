import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KeycloakHelperService {
  private keycloak: Keycloak;
  private isInitialized = false;

  constructor() {
    this.keycloak = new Keycloak({
      url: 'http://localhost:8080',
      realm: 'Club_Union_Unquillo',
      clientId: 'cuu-front'
    });
  }

  async init(): Promise<boolean> {
      try {
        const authenticated = await this.keycloak.init({
          onLoad: 'check-sso', 
          checkLoginIframe: true, // Opcional ponerlo en true
          // opcional, esta puesto para q use SSO silencioso
          silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html' 
        });

        if (authenticated) {
          console.log('Usuario autenticado: ', this.keycloak);
          //console.log('Token:', this.keycloak.token);
          // console.log('Usuario:', this.keycloak.tokenParsed?.['preferred_username']);
          // console.log('Roles:', this.keycloak.tokenParsed?.realm_access?.roles);
        } else {
          console.warn('Usuario no autenticado');
        }
        this.isInitialized = true;
        return authenticated;
      } catch (err) {
        console.error('Error al inicializar Keycloak:', err);
        return false;
      }
  }
  
  isReady(): boolean {
    return this.isInitialized;
  }

  login() {
    this.keycloak.login();
  }

  logout() {
    this.keycloak.logout({ redirectUri: window.location.origin });
  }

  async getToken(): Promise<string | undefined> {
    return this.keycloak.token;
  }

  getUsername(): string | undefined {
    return this.keycloak.tokenParsed?.['preferred_username'];
  }

  getRoles(): string[] {
    return this.keycloak.tokenParsed?.realm_access?.roles || [];
  }

  isLoggedIn(): boolean {
    return this.keycloak.authenticated || false;
  }


  //# llamarlo desde un setInterval, asi se mantiene activa la sesion
  async refreshToken(): Promise<void> {
    try {
      const refreshed = await this.keycloak.updateToken(60);
      if (refreshed) {
        console.log('Token actualizado');
      } else {
        console.log('Token todavía válido');
      }
    } catch {
      console.warn('No se pudo refrescar el token, forzando logout');
      this.logout();
    }
  }
}
