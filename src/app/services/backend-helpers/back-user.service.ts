import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { KeycloakHelperService } from '../keycloak-helper.service';
import { ExpandedUserDTO, UserDTO } from '../../models/backend/ExpandedUserDTO';
import { firstValueFrom } from 'rxjs';
import { retryWhen, delay, take, catchError } from 'rxjs/operators';
import { throwError as observableThrowError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackUserService {

  constructor() { }

  private http = inject(HttpClient);
  private keycloakHelper = inject(KeycloakHelperService);
  private readonly API_URL = 'http://localhost:8090/user'; 

  private currentUser: ExpandedUserDTO | null = null; 

    // Devuelve el usuario si existe aca, caso contrario lo solicita al back
  async getCurrentUser(): Promise<ExpandedUserDTO> {
    if (this.currentUser) {
      return this.currentUser;
    }
    return await this.getUpdatedInfoOfCurrentUser();
  }

   clearCachedUser(): void {
    this.currentUser = null;
  }

  //llama al back, guarda y despues devuelve el usuario actual
  async getUpdatedInfoOfCurrentUser(): Promise<ExpandedUserDTO> {
    const token = await this.keycloakHelper.getToken();

    const headers = {
      Authorization: `Bearer ${token}`
    };

    const user = await firstValueFrom(
      this.http.get<ExpandedUserDTO>(`${this.API_URL}/get-current-user-info`, { headers })
        .pipe(
          retryWhen(errors =>
            errors.pipe(
              delay(1000),
              take(3)
            )
          ),
          catchError(error => {
            console.error('No se pudo obtener la información del usuario luego de 3 intentos.');
            return observableThrowError(() => error);
          })
        )
    );

    this.currentUser = user; 
    return user;
  }

  // Eliminar
  //llama al back, elimina en keycloak y despues elimina en DB Disciplinas
  async deleteKeycloakUser(keycloakId: string): Promise<Boolean> {
    const token = await this.keycloakHelper.getToken();

    const headers = {
      Authorization: `Bearer ${token}`
    };

    const resp: any = await firstValueFrom(
      this.http.delete(`${this.API_URL}/${keycloakId}`, { headers })
        .pipe(
          retryWhen(errors =>
            errors.pipe(
              delay(1000),
              take(3)
            )
          ),
          catchError(error => {
            console.error('No se pudo eliminar el usuario luego de 3 intentos.');
            return observableThrowError(() => error);
          })
        )
    );

    return resp;
  }

// Editar
//this.http.put(`${this.API_URL}/${keycloakId}`, userDTO);
//llama al back, guarda y despues devuelve el usuario actual
  async updateInfoOfKeycloakUser(keycloakId: string, userDTO: UserDTO): Promise<ExpandedUserDTO> {
    const token = await this.keycloakHelper.getToken();

    const headers = {
      Authorization: `Bearer ${token}`
    };

    const resp: any = await firstValueFrom(
      this.http.put(`${this.API_URL}/${keycloakId}`, userDTO, { headers })
        .pipe(
          retryWhen(errors =>
            errors.pipe(
              delay(1000),
              take(3)
            )
          ),
          catchError(error => {
            console.error('No se pudo obtener la información del usuario luego de 3 intentos.');
            return observableThrowError(() => error);
          })
        )
    );

    let expandedUserDTO: ExpandedUserDTO = resp;
    return expandedUserDTO;
  }
}
