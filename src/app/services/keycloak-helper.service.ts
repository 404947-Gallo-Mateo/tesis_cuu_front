import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class KeycloakHelperService {
  private keycloak: Keycloak;

  constructor() {
    this.keycloak = new Keycloak({
      url: 'http://localhost:8080',
      realm: 'Club_Union_Unquillo',
      clientId: 'cuu-front'
    });
  }

  init(): Promise<boolean> {
    return this.keycloak.init({
      onLoad: 'login-required',
      checkLoginIframe: false
    }).then(authenticated => {
      if (authenticated) {
        console.log('Usuario autenticado');
        console.log('Token:', this.keycloak.token);
        console.log('Usuario:', this.keycloak.tokenParsed?.['preferred_username']);
        console.log('Roles:', this.keycloak.tokenParsed?.realm_access?.roles);
      } else {
        console.warn('Usuario no autenticado');
      }
      return authenticated;
    }).catch(err => {
      console.error('Error al inicializar Keycloak:', err);
      return false;
    });
  }

  login() {
    this.keycloak.login();
  }

  logout() {
    this.keycloak.logout({ redirectUri: window.location.origin });
  }

  getToken(): string | undefined {
    return this.keycloak.token;
  }

  getUsername(): string | undefined {
    return this.keycloak.tokenParsed?.['preferred_username'];
  }

  getRoles(): string[] {
    return this.keycloak.tokenParsed?.realm_access?.roles || [];
  }

  isLoggedIn(): boolean {
    return !!this.keycloak.token;
  }

  refreshToken(): Promise<void> {
    return this.keycloak.updateToken(60).then(refreshed => {
      if (refreshed) {
        console.log('Token actualizado');
      } else {
        console.log('Token todavía válido');
      }
    }).catch(() => {
      console.warn('No se pudo refrescar el token, forzando logout');
      this.logout();
    });
  }
}
