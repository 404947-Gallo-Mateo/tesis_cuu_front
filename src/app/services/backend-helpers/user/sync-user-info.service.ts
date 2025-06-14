import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ExpandedUserDTO } from "../../../models/backend/ExpandedUserDTO";
import { catchError, retry, tap } from "rxjs";
import { throwError as observableThrowError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SyncUserInfoService {

  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8090/user';

  syncInfoOfCurrentUser(): void {

        const user = this.http.get<ExpandedUserDTO>(`${this.API_URL}/get-current-user-info`).pipe(
            retry({
                  count: 3,
                  delay: 1000,
                  resetOnSuccess: true
                }),
            tap(user => {
              //console.log("Usuario actualizado desde servidor: ", user);
              // IMPORTANTE: Actualizar el BehaviorSubject para notificar a todos los suscriptores
              console.log("user:", user);
            }),
            catchError(error => {
              console.error('No se pudo sincronizar la información del usuario luego de 3 intentos.');
              return observableThrowError(() => error);
            })
          );
        }
    
}

