import { inject, Inject, Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { BehaviorSubject, catchError, from, map, Observable, of, ReplaySubject, shareReplay, tap, throwError } from 'rxjs';
import { BackUserService } from '../user/back-user.service';
import { SyncUserInfoService } from '../user/sync-user-info.service';

@Injectable({
  providedIn: 'root'
})
export class KeycloakHelperService {
  private keycloak: Keycloak;
  private init$?: Observable<boolean>;
  private readySubject = new ReplaySubject<boolean>(1);
  isReady$ = this.readySubject.asObservable();
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedInSubject.asObservable();
 
  constructor() {
    this.keycloak = new Keycloak({
      url: 'http://localhost:8080',
      realm: 'Club_Union_Unquillo',
      clientId: 'cuu-front'
    });
  }

  init(): Observable<boolean> {
    if (this.init$) {
      return this.init$;
    }
    
    this.init$ = from(this.keycloak.init({
      onLoad: 'check-sso',
      checkLoginIframe: true,
      silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
      adapter: 'default'
    })).pipe(
      tap(() => this.readySubject.next(true)),
      tap(authenticated => {
        // CORRECCIÓN: Solo actualizar el estado con el valor real de authenticated
        this.loggedInSubject.next(authenticated);
        console.log('Estado de autenticación actualizado:', authenticated);
      }),
      map(authenticated => {
        if (authenticated) {
        } else {
          console.warn('Usuario no autenticado');
        }
        return authenticated;
      }),
      catchError(err => {
        console.error('Error al inicializar Keycloak:', err);
        this.readySubject.next(false);
        this.loggedInSubject.next(false);
        return of(false);
      }),
      shareReplay(1)
    );
    return this.init$;
  }

  login(): void {
    this.init().subscribe(authenticated => {
      if (!authenticated) {
        this.keycloak.login();
      } else {
        // Ya está autenticado, el estado ya se actualizó en init()
        console.log('Usuario ya está autenticado');
      }
    });
  }

  logout(): void {
    this.loggedInSubject.next(false);
    this.keycloak.logout({ redirectUri: window.location.origin });
  }

  getToken(): Observable<string | undefined> {
    return of(this.keycloak.token);
  }

  getUsername(): string | undefined {
    return this.keycloak.tokenParsed?.['preferred_username'];
  }

  getRoles(): string[] {
    return this.keycloak.tokenParsed?.realm_access?.roles || [];
  }

  // Método auxiliar para verificar el estado actual
  isLoggedIn(): boolean {
    return this.keycloak.authenticated || false;
  }

  refreshToken(): Observable<void> {
    return from(this.keycloak.updateToken(60)).pipe(
      map(refreshed => {
        if (refreshed) {
          console.log('Token actualizado');
        } else {
          console.log('Token todavía válido');
        }
      }),
      catchError(err => {
        console.warn('No se pudo refrescar el token, forzando logout');
        this.logout();
        return throwError(() => err);
      })
    );
  }

  // Método para sincronizar manualmente el estado (útil para debugging)
  syncAuthState(): void {
    const currentState = this.keycloak.authenticated || false;
    this.loggedInSubject.next(currentState);
    console.log('Estado sincronizado:', currentState);
  }
}