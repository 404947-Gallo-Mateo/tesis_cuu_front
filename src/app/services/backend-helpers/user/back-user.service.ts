import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { KeycloakHelperService } from '../../../services/backend-helpers/keycloak/keycloak-helper.service';
import { BehaviorSubject, Observable, of, throwError as observableThrowError, EMPTY } from 'rxjs';
import { delay, take, catchError, switchMap, tap, filter, retry, map } from 'rxjs/operators';
import { UserDTO, ExpandedUserDTO } from '../../../models/backend/ExpandedUserDTO';
import { Role } from '../../../models/backend/embeddables/Role';
import { UserWithFeesDTO } from '../../../models/backend/UserWithFeesDTO';

@Injectable({
  providedIn: 'root'
})
export class BackUserService {
  private http = inject(HttpClient);
  private keycloakHelper = inject(KeycloakHelperService);
  private readonly API_URL = 'http://localhost:8090/user';

  //verifica si keycloak fue iniciado (si el usuario intento loguearse)
  isLoggedIn$ = this.keycloakHelper.isLoggedIn$;

  // BehaviorSubject para manejar el estado reactivo del usuario
  private currentUserSubject = new BehaviorSubject<ExpandedUserDTO | null>(null);
  private currentRoleSubject = new BehaviorSubject<string | null>(null);

  // Observable publico para que los components se suscriban
  public currentUser$ = this.currentUserSubject.asObservable();
  public currentRole$ = this.currentRoleSubject.asObservable();

  // Observable filtrado, solo emite cuando hay un user valido
  public currentUserValid$ = this.currentUser$.pipe(
    filter(user => user !== null)
  ) as Observable<ExpandedUserDTO>;

  public currentRoleValid$ = this.currentRole$.pipe(
    switchMap(role => {
      if (role) {
        return of(role);
      } else {
        return this.getUpdatedInfoOfCurrentUser().pipe(
          map(user => user?.role),
          catchError(() => EMPTY)
        );
      }
    })
  );

  // obtiene el rol actual (de forma sincronica)
  getCurrentRole(): string | null {
    console.log("backUserService -> currentRole.value: ", this.currentRoleSubject.value);
    return this.currentRoleSubject.value;
  }

  constructor() { }

  /**
   * Obtiene el usuario actual desde el cache (si existe) o desde el servidor
   * Retorna un Observable que siempre estará actualizado
   */
  getCurrentUser(): Observable<ExpandedUserDTO> {
    if (this.currentUserSubject.value) {
      return of(this.currentUserSubject.value);
    }
    
    return this.getUpdatedInfoOfCurrentUser();
  }

  /**
   * Obtiene información actualizada del usuario desde el servidor
   * y actualiza el BehaviorSubject para notificar a todos los suscriptores
   */
  getUpdatedInfoOfCurrentUser(): Observable<ExpandedUserDTO> {
    console.log("this.isLoggedIn$: ", this.isLoggedIn$);
    if(this.isLoggedIn$){
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
              this.currentUserSubject.next(user);
              this.currentRoleSubject.next(user.role);
            }),
            catchError(error => {
              console.error('No se pudo obtener la información del usuario luego de 3 intentos.');
              return observableThrowError(() => error);
            })
          );
        })    
      ); 
    }    
    else {
      console.log("no se inicio sesion");
      return EMPTY;
    }
  }

  /**
   * Establece manualmente el usuario actual
   */
  setCurrentUser(newCurrentUser: ExpandedUserDTO): void {
    this.currentUserSubject.next(newCurrentUser);
  }

  /**
   * Limpia el cache del usuario y notifica a los suscriptores
   */
  clearCachedUser(): void {
    this.currentUserSubject.next(null);
  }

  /**
   * Fuerza la actualización del usuario desde el servidor
   */
  refreshCurrentUser(): Observable<ExpandedUserDTO> {
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
    let url = `${this.API_URL}/delete/${encodeURIComponent(keycloakId)}`;
    console.log("deleteKeycloakUser url: ",url);
    return this.http.delete<boolean>(url).pipe(
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

  selfUpdateInfoOfKeycloakUser(keycloakId: string, userDTO: UserDTO): Observable<ExpandedUserDTO> {
    return this.http.put<ExpandedUserDTO>(`${this.API_URL}/update/${encodeURIComponent(keycloakId)}`, userDTO).pipe(
      retry({
      count: 3,
      delay: 1000,
      resetOnSuccess: true
    }),
      tap(updatedUser => {
        this.currentUserSubject.next(updatedUser);
      }),
      catchError(error => {
        console.error('No se pudo actualizar la información del usuario luego de 3 intentos.');
        return observableThrowError(() => error);
      })
    );
  }

    adminsUpdateInfoOfKeycloakUser(keycloakId: string, userDTO: UserDTO): Observable<ExpandedUserDTO> {
    return this.http.put<ExpandedUserDTO>(`${this.API_URL}/update/${encodeURIComponent(keycloakId)}`, userDTO).pipe(
      retry({
      count: 3,
      delay: 1000,
      resetOnSuccess: true
    }),
      tap(updatedUser => {
        //console.log("Usuario actualizado via API:", updatedUser);
      }),
      catchError(error => {
        console.error('No se pudo actualizar la información del usuario luego de 3 intentos.');
        return observableThrowError(() => error);
      })
    );
  }

  getAllUsers(): Observable<ExpandedUserDTO[]> {
    return this.http.get<ExpandedUserDTO[]>(`${this.API_URL}/get-all`).pipe(
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

  getAllUsersWithSocialFees(): Observable<UserWithFeesDTO[]> {
    return this.http.get<UserWithFeesDTO[]>(`${this.API_URL}/get-all-with-social-fees`).pipe(
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

  //    @GetMapping("/get-all/by-role/{role}")
  getAllUsersByRole(role: Role): Observable<ExpandedUserDTO[]> {
    //http://localhost:8090/user/get-all/by-role/TEACHER
    return this.http.get<ExpandedUserDTO[]>(`${this.API_URL}/get-all/by-role/${role}`).pipe(
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