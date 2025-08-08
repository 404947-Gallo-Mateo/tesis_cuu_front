import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { KeycloakHelperService } from '../keycloak/keycloak-helper.service';
import { catchError, delay, firstValueFrom, Observable, retry, take, throwError } from 'rxjs';
import { throwError as observableThrowError } from 'rxjs';
import { PostDisciplineDTO, PutDisciplineDTO } from '../../../models/backend/PostDisciplineDTO';
import { DisciplineDto } from '../../../models/backend/DisciplineDTO';
import { DisciplineSummaryDTO } from '../../../models/backend/DisciplineSummaryDTO';

@Injectable({
  providedIn: 'root'
})
export class BackDisciplineService {

  constructor() { }

    private http = inject(HttpClient);
    private readonly API_URL = 'http://localhost:8090/discipline'; 


    // @PostMapping("/create")
postDiscipline(postDisciplineDTO: PostDisciplineDTO): Observable<DisciplineDto> {
  return this.http.post<DisciplineDto>(`${this.API_URL}/create`, postDisciplineDTO).pipe(
    retry({
          count: 3,
          delay: 1000,
          resetOnSuccess: true
        }),
    catchError((error: HttpErrorResponse) => {
          console.error('Error en inscripción:', error);
          const errorMessage = typeof error.error === 'string' 
            ? error.error 
            : error.error?.message || error.message || 'Error desconocido al crear inscripción';
          return throwError(() => ({
            message: errorMessage,
            status: error.status
          }));
        })
  );
}

    // @PutMapping("/update")
putDiscipline(disciplineDTO: PutDisciplineDTO): Observable<DisciplineDto> {
  return this.http.put<DisciplineDto>(`${this.API_URL}/update`, disciplineDTO).pipe(
    retry({
      count: 3,
      delay: 1000,
      resetOnSuccess: true
    }),
    catchError((error: HttpErrorResponse) => {
      console.error('Error en inscripción:', error);
      const errorMessage = typeof error.error === 'string' 
        ? error.error 
        : error.error?.message || error.message || 'Error desconocido al crear inscripción';
      return throwError(() => ({
        message: errorMessage,
        status: error.status
      }));
    })
  );
}

  // @DeleteMapping("/delete")
  //llama al back, elimina en DB Disciplinas
  deleteDisciplineById(disciplineId: string): Observable<boolean> {
  const url = `${this.API_URL}/delete?disciplineId=${encodeURIComponent(disciplineId)}`;

  return this.http.delete<boolean>(url).pipe(
    retry({
      count: 3,
      delay: 1000,
      resetOnSuccess: true
    }),
    catchError(error => {
      console.error('No se pudo eliminar la disciplina luego de 3 intentos.', error);
      return observableThrowError(() => error);
    })
  );
}

  // @GetMapping("/find-one/by-name")
  //llama al back, trae todos los usuarios de la DB del MS
    getOneByDisciplineName(disciplineName: string): Observable<DisciplineDto> {
        const url = `${this.API_URL}/find-one/by-name?disciplineName=${encodeURIComponent(disciplineName)}`;

        return this.http.get<DisciplineDto>(url).pipe(
          retry({
      count: 3,
      delay: 1000,
      resetOnSuccess: true
    }),
          catchError(error => {
            console.error('No se pudo obtener la disciplina por nombre.');
            return observableThrowError(() => error);
          })
        );
    }



  // @GetMapping("/find-one/by-id")
  //llama al back, trae todos los usuarios de la DB del MS
  getOneByDisciplineId(disciplineId: string): Observable<DisciplineDto> {    
    const url = `${this.API_URL}/find-one/by-id?disciplineId=${encodeURIComponent(disciplineId)}`;

    return this.http.get<DisciplineDto>(url).pipe(
     retry({
            count: 3,
            delay: 1000,
            resetOnSuccess: true
          }),      
        catchError(error => {
        console.error('No se pudo obtener la disciplina por ID.');
        return observableThrowError(() => error);
      })
    );
  }



  // @GetMapping("/find-all/by-teacher-keycloak-id")
  //llama al back, trae todos los usuarios de la DB del MS
  getAllByTeacherKeycloakId(teacherKeycloakId: string): Observable<DisciplineDto[]> {
    const url = `${this.API_URL}/find-all/by-teacher-keycloak-id?teacherKeycloakId=${encodeURIComponent(teacherKeycloakId)}`;

    return this.http.get<DisciplineDto[]>(url).pipe(
      retry({
      count: 3,
      delay: 1000,
      resetOnSuccess: true
    }),
      catchError(error => {
        console.error('No se pudo obtener las disciplinas por teacherKeycloakId.');
        return observableThrowError(() => error);
      })
    );
  }

  // @GetMapping("/get-all")
  //llama al back, trae todos los usuarios de la DB del MS
  getAll(): Observable<DisciplineDto[]> {
    return this.http.get<DisciplineDto[]>(`${this.API_URL}/get-all`).pipe(
      retry({
      count: 3,
      delay: 1000,
      resetOnSuccess: true
    }),
      catchError(error => {
        console.error('No se pudo obtener las disciplinas.');
        return observableThrowError(() => error);
      })
    );
  }

  getAllSummary(): Observable<DisciplineSummaryDTO[]> {
    return this.http.get<DisciplineSummaryDTO[]>(`${this.API_URL}/get-all`).pipe(
      retry({
      count: 3,
      delay: 1000,
      resetOnSuccess: true
    }),
      catchError(error => {
        console.error('No se pudo obtener las disciplinas.');
        return observableThrowError(() => error);
      })
    );
  }

}
