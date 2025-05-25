import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { KeycloakHelperService } from '../../../services/backend-helpers/keycloak/keycloak-helper.service';
import { BehaviorSubject, Observable, of, throwError as observableThrowError } from 'rxjs';
import { delay, take, catchError, switchMap, tap, filter, retry } from 'rxjs/operators';
import { UserDTO, ExpandedUserDTO } from '../../../models/backend/ExpandedUserDTO';

@Injectable({
  providedIn: 'root'
})
export class BackUserService {
  private http = inject(HttpClient);
  private keycloakHelper = inject(KeycloakHelperService);
  private readonly API_URL = 'http://localhost:8090/user';

  // BehaviorSubject para manejar el estado reactivo del usuario
  private currentUserSubject = new BehaviorSubject<ExpandedUserDTO | null>(null);
  
  // Observable público para que los componentes se suscriban
  public currentUser$ = this.currentUserSubject.asObservable();
  
  // Observable filtrado que solo emite cuando hay un usuario válido
  public currentUserValid$ = this.currentUser$.pipe(
    filter(user => user !== null)
  ) as Observable<ExpandedUserDTO>;

  constructor() { }

  /**
   * Obtiene el usuario actual desde el cache (si existe) o desde el servidor
   * Retorna un Observable que siempre estará actualizado
   */
  getCurrentUser(): Observable<ExpandedUserDTO> {
    // Si ya tenemos un usuario cacheado, lo retornamos
    if (this.currentUserSubject.value) {
      return of(this.currentUserSubject.value);
    }
    
    // Si no, obtenemos la información actualizada
    return this.getUpdatedInfoOfCurrentUser();
  }

  /**
   * Obtiene información actualizada del usuario desde el servidor
   * y actualiza el BehaviorSubject para notificar a todos los suscriptores
   */
  getUpdatedInfoOfCurrentUser(): Observable<ExpandedUserDTO> {
    return this.keycloakHelper.getToken().pipe(
      switchMap(token => {
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.get<ExpandedUserDTO>(`${this.API_URL}/get-current-user-info`, { headers }).pipe(
          retry({
                count: 3,
                delay: 1000,
                resetOnSuccess: true
              }),
          tap(user => {
            //console.log("Usuario actualizado desde servidor: ", user);
            // IMPORTANTE: Actualizar el BehaviorSubject para notificar a todos los suscriptores
            this.currentUserSubject.next(user);
          }),
          catchError(error => {
            console.error('No se pudo obtener la información del usuario luego de 3 intentos.');
            return observableThrowError(() => error);
          })
        );
      })    
    );
  }

  /**
   * Establece manualmente el usuario actual
   * Útil cuando se obtiene información del usuario desde otras fuentes
   */
  setCurrentUser(newCurrentUser: ExpandedUserDTO): void {
    this.currentUserSubject.next(newCurrentUser);
    console.log("Usuario establecido manualmente:", newCurrentUser);
  }

  /**
   * Limpia el cache del usuario y notifica a los suscriptores
   */
  clearCachedUser(): void {
    this.currentUserSubject.next(null);
    console.log("Cache de usuario limpiado");
  }

  /**
   * Fuerza la actualización del usuario desde el servidor
   * Útil después de operaciones que modifican el estado del usuario
   */
  refreshCurrentUser(): Observable<ExpandedUserDTO> {
    console.log("Forzando actualización del usuario...");
    return this.getUpdatedInfoOfCurrentUser();
  }

  /**
   * Obtiene el valor actual del usuario de forma síncrona
   * Retorna null si no hay usuario cacheado
   */
  getCurrentUserSnapshot(): ExpandedUserDTO | null {
    return this.currentUserSubject.value;
  }

  deleteKeycloakUser(keycloakId: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.API_URL}/delete/${encodeURIComponent(keycloakId)}`).pipe(
      retry({
      count: 3,
      delay: 1000,
      resetOnSuccess: true
    }),
      catchError(error => {
        console.error('No se pudo eliminar el usuario luego de 3 intentos.');
        return observableThrowError(() => error);
      })
    );
  }

  updateInfoOfKeycloakUser(keycloakId: string, userDTO: UserDTO): Observable<ExpandedUserDTO> {
    return this.http.put<ExpandedUserDTO>(`${this.API_URL}/update/${encodeURIComponent(keycloakId)}`, userDTO).pipe(
      retry({
      count: 3,
      delay: 1000,
      resetOnSuccess: true
    }),
      tap(updatedUser => {
        // Actualizar automáticamente el usuario en cache cuando se actualiza
        console.log("Usuario actualizado via API:", updatedUser);
        this.currentUserSubject.next(updatedUser);
      }),
      catchError(error => {
        console.error('No se pudo actualizar la información del usuario luego de 3 intentos.');
        return observableThrowError(() => error);
      })
    );
  }

  getAllUsers(): Observable<ExpandedUserDTO> {
    return this.http.get<ExpandedUserDTO>(`${this.API_URL}/get-all`).pipe(
      retry({
      count: 3,
      delay: 1000,
      resetOnSuccess: true
    }),
      catchError(error => {
        console.error('No se pudo obtener todos los usuarios.');
        return observableThrowError(() => error);
      })
    );
  }
}