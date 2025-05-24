import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { KeycloakHelperService } from '../../../services/backend-helpers/keycloak/keycloak-helper.service';
import { firstValueFrom, Observable, of } from 'rxjs';
import { retryWhen, delay, take, catchError, switchMap, tap } from 'rxjs/operators';
import { throwError as observableThrowError } from 'rxjs';
import { UserDTO, ExpandedUserDTO } from '../../../models/backend/ExpandedUserDTO';

@Injectable({
  providedIn: 'root'
})
export class BackUserService {

  constructor() { }

  private http = inject(HttpClient);
  private keycloakHelper = inject(KeycloakHelperService);
  private readonly API_URL = 'http://localhost:8090/user'; 

  //http://localhost:8090/user/update/412d79db-c95f-4290-94b3-ddd40f5d52cb

  private currentUser: ExpandedUserDTO | null = null; 

  getCurrentUser(): Observable<ExpandedUserDTO> {
  if (this.currentUser) {
    return of(this.currentUser);
  }
  return this.getUpdatedInfoOfCurrentUser();
}

setCurrentUser(newCurrentUser: ExpandedUserDTO): void {
  this.currentUser = newCurrentUser;
}

clearCachedUser(): void {
  this.currentUser = null;
}

getUpdatedInfoOfCurrentUser(): Observable<ExpandedUserDTO> {
  return this.keycloakHelper.getToken().pipe(
    switchMap(token => {
      const headers = { Authorization: `Bearer ${token}` };
      return this.http.get<ExpandedUserDTO>(`${this.API_URL}/get-current-user-info`, { headers }).pipe(
        retryWhen(errors => errors.pipe(delay(1000), take(3))),
        tap(user => this.currentUser = user),
        catchError(error => {
          console.error('No se pudo obtener la información del usuario luego de 3 intentos.');
          return observableThrowError(() => error);
        })
      );
    })
  );
}

deleteKeycloakUser(keycloakId: string): Observable<boolean> {
  return this.http.delete<boolean>(`${this.API_URL}/delete/${encodeURIComponent(keycloakId)}`).pipe(
    retryWhen(errors => errors.pipe(delay(1000), take(3))),
    catchError(error => {
      console.error('No se pudo eliminar el usuario luego de 3 intentos.');
      return observableThrowError(() => error);
    })
  );
}

updateInfoOfKeycloakUser(keycloakId: string, userDTO: UserDTO): Observable<ExpandedUserDTO> {
  return this.http.put<ExpandedUserDTO>(`${this.API_URL}/update/${encodeURIComponent(keycloakId)}`, userDTO).pipe(
    retryWhen(errors => errors.pipe(delay(1000), take(3))),
    catchError(error => {
      console.error('No se pudo actualizar la información del usuario luego de 3 intentos.');
      return observableThrowError(() => error);
    })
  );
}


  getAllUsers(): Observable<ExpandedUserDTO> {
  return this.http.get<ExpandedUserDTO>(`${this.API_URL}/get-all`).pipe(
    retryWhen(errors =>
      errors.pipe(
        delay(1000),
        take(3)
      )
    ),
    tap(user => this.currentUser = user), // guarda en caché si es necesario
    catchError(error => {
      console.error('No se pudo obtener todos los usuarios.');
      return observableThrowError(() => error);
    })
  );
}

}
