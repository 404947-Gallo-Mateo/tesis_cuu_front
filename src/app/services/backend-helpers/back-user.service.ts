import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { KeycloakHelperService } from '../keycloak-helper.service';
import { ExpandedUserDTO } from '../../models/backend/ExpandedUserDTO';
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


  async getLatestInfoFromCurrentUser(): Promise<ExpandedUserDTO> {

    const token = await this.keycloakHelper.getToken();

    const headers = {
      Authorization: `Bearer ${token}`
    };

    //console.log("header de la solicitud: ", headers);
    //console.log("token", token);

    return await firstValueFrom(
      this.http.get<ExpandedUserDTO>(`${this.API_URL}/get-current-user-info`, { headers })
        .pipe(
          retryWhen(errors =>
            errors.pipe(
              delay(1000), // espera 1 segundo entre intentos
              take(3)      // máximo 3 intentos
            )
          ),
          catchError(error => {
            // Acá podés mostrar un mensaje de error personalizado
            console.error('No se pudo obtener la información del usuario luego de 3 intentos.');
            // Si tenés un servicio de notificación, lo usás acá:
            // this.notificationService.showError('Error al cargar información del usuario.');
            return observableThrowError(() => error); // o lanzar un error personalizado
          })
        )
    );
  }
}
