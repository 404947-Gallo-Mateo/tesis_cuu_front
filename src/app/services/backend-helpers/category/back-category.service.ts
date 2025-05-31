import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { KeycloakHelperService } from '../keycloak/keycloak-helper.service';
import { CategoryDTO } from '../../../models/backend/CategoryDTO';
import { catchError, delay, firstValueFrom, Observable, retry, take } from 'rxjs';
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
getAllByDisciplineId(disciplineId: string): Observable<CategoryDTO[]> {
  const url = `${this.API_URL}/find-all/by-discipline-id?disciplineId=${encodeURIComponent(disciplineId)}`;

  return this.http.get<CategoryDTO[]>(url).pipe(
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
