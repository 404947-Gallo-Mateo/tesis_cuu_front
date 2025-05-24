import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { KeycloakHelperService } from '../keycloak/keycloak-helper.service';
import { catchError, delay, firstValueFrom, Observable, retryWhen, take } from 'rxjs';
import { StudentInscriptionDTO } from '../../../models/StudentInscriptionDTO';
import { throwError as observableThrowError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackStudentInscriptionService {

  constructor() { }

    private http = inject(HttpClient);
    private keycloakHelper = inject(KeycloakHelperService);
    private readonly API_URL = 'http://localhost:8090/student_inscription'; 

    // @PostMapping("/create")
postStudentInscription(studentInscriptionDTO: StudentInscriptionDTO): Observable<StudentInscriptionDTO> {
  return this.http.post<StudentInscriptionDTO>(`${this.API_URL}/create`, studentInscriptionDTO).pipe(
    retryWhen(errors => errors.pipe(delay(1000), take(3))),
    catchError(error => {
      console.error('No se pudo crear la inscripción.');
      return observableThrowError(() => error);
    })
  );
}

    

    // @PutMapping("/update")
  putStudentInscription(studentInscriptionDTO: StudentInscriptionDTO): Observable<StudentInscriptionDTO> {
    return this.http.put<StudentInscriptionDTO>(`${this.API_URL}/update`, studentInscriptionDTO).pipe(
      retryWhen(errors => errors.pipe(delay(1000), take(3))),
      catchError(error => {
        console.error('No se pudo actualizar la inscripción.');
        return observableThrowError(() => error);
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
      retryWhen(errors => errors.pipe(delay(1000), take(3))),
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
    retryWhen(errors => errors.pipe(delay(1000), take(3))),
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
    retryWhen(errors => errors.pipe(delay(1000), take(3))),
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
    retryWhen(errors => errors.pipe(delay(1000), take(3))),
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
    retryWhen(errors => errors.pipe(delay(1000), take(3))),
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
    retryWhen(errors => errors.pipe(delay(1000), take(3))),
    catchError(error => {
      console.error('No se pudo obtener la inscripción del alumno por disciplina.');
      return observableThrowError(() => error);
    })
  );
}


}
