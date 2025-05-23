import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { KeycloakHelperService } from '../backend-helpers/keycloak/keycloak-helper.service';
import { CategoryDTO } from '../../models/backend/CategoryDTO';
import { catchError, delay, firstValueFrom, retryWhen, take } from 'rxjs';
import { throwError as observableThrowError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackCategoryService {

  constructor() { }

  private http = inject(HttpClient);
  private keycloakHelper = inject(KeycloakHelperService);
  private readonly API_URL = 'http://localhost:8090/category'; 

  // @GetMapping("/find-all/by-discipline-id")
      // @GetMapping("/find-all/by-discipline-id")
      //llama al back, trae todos los usuarios de la DB del MS
      async getAllByDisciplineId(disciplineId: string): Promise<CategoryDTO[]> {
    
        const url = `${this.API_URL}/find-all/by-discipline-id` +
                  `&disciplineId=${encodeURIComponent(disciplineId)}`;
  
        const resp = await firstValueFrom(
          this.http.get<CategoryDTO[]>(url)
            .pipe(
              retryWhen(errors =>
                errors.pipe(
                  delay(1000),
                  take(3)
                )
              ),
              catchError(error => {
                console.error('No se pudo obtener todos los usuarios.');
                return observableThrowError(() => error);
              })
            )
        );
    
        return resp;
      }

}
