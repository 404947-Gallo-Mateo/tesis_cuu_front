import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { KeycloakHelperService } from '../keycloak/keycloak-helper.service';
import { catchError, delay, firstValueFrom, Observable, retry, take, throwError } from 'rxjs';
import { StudentInscriptionDTO } from '../../../models/StudentInscriptionDTO';
import { throwError as observableThrowError } from 'rxjs';
import { ExpandedStudentInscriptionDTO } from '../../../models/backend/ExpandedStudentInscriptionDTO';

@Injectable({
  providedIn: 'root'
})
export class BackStudentInscriptionService {

  constructor() { }

    private http = inject(HttpClient);
    private keycloakHelper = inject(KeycloakHelperService);
    private readonly API_URL = 'http://localhost:8090/student_inscription'; 

    // @PostMapping("/create")
postStudentInscription(studentKeycloakId: string, disciplineId: string, categoryId: string): Observable<StudentInscriptionDTO> {
  const url = `${this.API_URL}/create` +
              `?studentKeycloakId=${encodeURIComponent(studentKeycloakId)}` +
              `&disciplineId=${encodeURIComponent(disciplineId)}` +
              `&categoryId=${encodeURIComponent(categoryId)}`;

  return this.http.post<StudentInscriptionDTO>(url, null).pipe(
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
  putStudentInscription(studentKeycloakId: string, disciplineId: string, categoryId: string): Observable<StudentInscriptionDTO> {
     const url = `${this.API_URL}/update` +
                `?studentKeycloakId=${encodeURIComponent(studentKeycloakId)}` +
                `&disciplineId=${encodeURIComponent(disciplineId)}` +
                `&categoryId=${encodeURIComponent(categoryId)}`;

    return this.http.put<StudentInscriptionDTO>(url, null).pipe(
    retry({
      count: 3,
      delay: 1000,
      resetOnSuccess: true
    }),
    catchError((error: HttpErrorResponse) => {
      console.error('Error en inscripción:', error);
      // Extraer el mensaje de error del backend si existe
      const errorMessage = error.error?.message || error.error || error.message || 'Error desconocido al crear inscripción';
      return throwError(() => new Error(errorMessage));
    })
  );
  }


    // @DeleteMapping("/delete")
  //llama al back, elimina en DB Disciplinas
  deleteStudentInscription(studentKeycloakId: string, disciplineId: string, categoryId: string): Observable<boolean> {
    const url = `${this.API_URL}/delete` +
                `?studentKeycloakId=${encodeURIComponent(studentKeycloakId)}` +
                `&disciplineId=${encodeURIComponent(disciplineId)}` +
                `&categoryId=${encodeURIComponent(categoryId)}`;

    return this.http.delete<boolean>(url).pipe(
      retry({
      count: 3,
      delay: 1000,
      resetOnSuccess: true
    }),
      catchError(error => {
        console.error('No se pudo eliminar la inscripción luego de 3 intentos.', error);
        return observableThrowError(() => error);
      })
    );
  }



   // @GetMapping("/find-all/by-student-keycloak-id")
    //llama al back, trae todos los usuarios de la DB del MS
getAllByStudentKeycloakId(studentKeycloakId: string): Observable<StudentInscriptionDTO[]> {
  const url = `${this.API_URL}/find-all/by-student-keycloak-id` +
              `?studentKeycloakId=${encodeURIComponent(studentKeycloakId)}`;

  return this.http.get<StudentInscriptionDTO[]>(url).pipe(
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


    // @GetMapping("/find-all/by-discipline-id")
    //llama al back, trae todos los usuarios de la DB del MS
getAllByDisciplineId(disciplineId: string): Observable<StudentInscriptionDTO[]> {
  const url = `${this.API_URL}/find-all/by-discipline-id` +
              `?disciplineId=${encodeURIComponent(disciplineId)}`;

  return this.http.get<StudentInscriptionDTO[]>(url).pipe(
    retry({
      count: 3,
      delay: 1000,
      resetOnSuccess: true
    }),
    catchError(error => {
      console.error('No se pudo obtener las inscripciones por disciplina.');
      return observableThrowError(() => error);
    })
  );
}

getAllByDisciplineIdWithFees(disciplineId: string): Observable<ExpandedStudentInscriptionDTO[]> {
  const url = `${this.API_URL}/find-all/by-discipline-id-with-fees` +
              `?disciplineId=${encodeURIComponent(disciplineId)}`;

  return this.http.get<ExpandedStudentInscriptionDTO[]>(url).pipe(
    retry({
      count: 3,
      delay: 1000,
      resetOnSuccess: true
    }),
    catchError(error => {
      console.error('No se pudo obtener las inscripciones por disciplina.');
      return observableThrowError(() => error);
    })
  );
}


getAllWithFees(): Observable<ExpandedStudentInscriptionDTO[]> {
  const url = `${this.API_URL}/find-all/with-fees`;

  return this.http.get<ExpandedStudentInscriptionDTO[]>(url).pipe(
    retry({
      count: 3,
      delay: 1000,
      resetOnSuccess: true
    }),
    catchError(error => {
      console.error('No se pudo obtener las inscripciones por disciplina.');
      return observableThrowError(() => error);
    })
  );
}


    // @GetMapping("/find-all/by-category-id")
    //llama al back, trae todos los usuarios de la DB del MS
getAllByCategoryId(categoryId: string): Observable<StudentInscriptionDTO[]> {
  const url = `${this.API_URL}/find-all/by-category-id` +
              `?categoryId=${encodeURIComponent(categoryId)}`;

  return this.http.get<StudentInscriptionDTO[]>(url).pipe(
    retry({
      count: 3,
      delay: 1000,
      resetOnSuccess: true
    }),
    catchError(error => {
      console.error('No se pudo obtener las inscripciones por categoría.');
      return observableThrowError(() => error);
    })
  );
}


    // @GetMapping("/find-one/by-student-keycloak-id-and-discipline-id-and-category-id")
    //llama al back, trae todos los usuarios de la DB del MS
 getOneByKeycloakIdAnDisciplineIdAndCategoryId(
  studentKeycloakId: string,
  disciplineId: string,
  categoryId: string
): Observable<StudentInscriptionDTO> {
  const url = `${this.API_URL}/find-one/by-student-keycloak-id-and-discipline-id-and-category-id` +
              `?studentKeycloakId=${encodeURIComponent(studentKeycloakId)}` +
              `&disciplineId=${encodeURIComponent(disciplineId)}` +
              `&categoryId=${encodeURIComponent(categoryId)}`;

  return this.http.get<StudentInscriptionDTO>(url).pipe(
    retry({
      count: 3,
      delay: 1000,
      resetOnSuccess: true
    }),
    catchError(error => {
      console.error('No se pudo obtener la inscripción específica del alumno.');
      return observableThrowError(() => error);
    })
  );
}


    // @GetMapping("/find-one/by-student-keycloak-id-and-discipline-id")
    //llama al back, trae todos los usuarios de la DB del MS
getOneByKeycloakIdAnddisciplineId(
  studentKeycloakId: string,
  disciplineId: string
): Observable<StudentInscriptionDTO> {
  const url = `${this.API_URL}/find-one/by-student-keycloak-id-and-discipline-id` +
              `?studentKeycloakId=${encodeURIComponent(studentKeycloakId)}` +
              `&disciplineId=${encodeURIComponent(disciplineId)}`;

  return this.http.get<StudentInscriptionDTO>(url).pipe(
    retry({
      count: 3,
      delay: 1000,
      resetOnSuccess: true
    }),
    catchError(error => {
      console.error('No se pudo obtener la inscripción del alumno por disciplina.');
      return observableThrowError(() => error);
    })
  );
}


}
