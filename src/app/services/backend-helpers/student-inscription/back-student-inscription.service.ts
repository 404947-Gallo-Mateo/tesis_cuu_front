import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { KeycloakHelperService } from '../keycloak/keycloak-helper.service';
import { catchError, delay, firstValueFrom, retryWhen, take } from 'rxjs';
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
    async postStudentInscription(studentInscriptionDTO: StudentInscriptionDTO): Promise<StudentInscriptionDTO> {
    
      const resp: any = await firstValueFrom(
          this.http.post(`${this.API_URL}/create`, studentInscriptionDTO)
            .pipe(
              retryWhen(errors =>
                errors.pipe(
                  delay(1000),
                  take(3)
                )
              ),
              catchError(error => {
                console.error('No se pudo crear la inscripcion.');
                return observableThrowError(() => error);
              })
            )
      );
    
        let respStudentInscriptionDTO: StudentInscriptionDTO = resp;
        return respStudentInscriptionDTO;
    }
    

    // @PutMapping("/update")
    async putStudentInscription(studentInscriptionDTO: StudentInscriptionDTO): Promise<StudentInscriptionDTO> {
    
      const resp: any = await firstValueFrom(
          this.http.post(`${this.API_URL}/update`, studentInscriptionDTO)
            .pipe(
              retryWhen(errors =>
                errors.pipe(
                  delay(1000),
                  take(3)
                )
              ),
              catchError(error => {
                console.error('No se pudo actualizar la inscripcion.');
                return observableThrowError(() => error);
              })
            )
      );
    
        let respStudentInscriptionDTO: StudentInscriptionDTO = resp;
        return respStudentInscriptionDTO;
    }


    // @DeleteMapping("/delete")
  //llama al back, elimina en DB Disciplinas
  async deleteStudentInscription(studentKeycloakId: string, disciplineId: string, categoryId: string): Promise<boolean> {
    const url = `${this.API_URL}/delete` +
                `?studentKeycloakId=${encodeURIComponent(studentKeycloakId)}` +
                `&disciplineId=${encodeURIComponent(disciplineId)}` +
                `&categoryId=${encodeURIComponent(categoryId)}`;

    const resp: any = await firstValueFrom(
      this.http.delete(url).pipe(
        retryWhen(errors =>
          errors.pipe(delay(1000), take(3))
        ),
        catchError(error => {
          console.error('No se pudo eliminar la inscripción luego de 3 intentos.', error);
          return observableThrowError(() => error);
        })
      )
    );

    return resp;
  }


   // @GetMapping("/find-all/by-student-keycloak-id")
    //llama al back, trae todos los usuarios de la DB del MS
    async getAllByStudentKeycloakId(studentKeycloakId: string): Promise<StudentInscriptionDTO[]> {
  
      const url = `${this.API_URL}/find-all/by-student-keycloak-id` +
                `&studentKeycloakId=${encodeURIComponent(studentKeycloakId)}`;

      const resp = await firstValueFrom(
        this.http.get<StudentInscriptionDTO[]>(url)
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

    // @GetMapping("/find-all/by-discipline-id")
    //llama al back, trae todos los usuarios de la DB del MS
    async getAllByDisciplineId(disciplineId: string): Promise<StudentInscriptionDTO[]> {
  
      const url = `${this.API_URL}/find-all/by-discipline-id` +
                `&disciplineId=${encodeURIComponent(disciplineId)}`;

      const resp = await firstValueFrom(
        this.http.get<StudentInscriptionDTO[]>(url)
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

    // @GetMapping("/find-all/by-category-id")
    //llama al back, trae todos los usuarios de la DB del MS
    async getAllByCategoryId(categoryId: string): Promise<StudentInscriptionDTO[]> {
  
      const url = `${this.API_URL}/find-all/by-category-id` +
                `&categoryId=${encodeURIComponent(categoryId)}`;

      const resp = await firstValueFrom(
        this.http.get<StudentInscriptionDTO[]>(url)
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

    // @GetMapping("/find-one/by-student-keycloak-id-and-discipline-id-and-category-id")
    //llama al back, trae todos los usuarios de la DB del MS
    async getOneByKeycloakIdAnddisciplineIdAndCategoryId(studentKeycloakId: string, disciplineId: string, categoryId: string): Promise<StudentInscriptionDTO> {
  
          const url = `${this.API_URL}/find-one/by-student-keycloak-id-and-discipline-id-and-category-id` +
                `?studentKeycloakId=${encodeURIComponent(studentKeycloakId)}` +
                `&disciplineId=${encodeURIComponent(disciplineId)}` +
                `&categoryId=${encodeURIComponent(categoryId)}`;

      const resp = await firstValueFrom(
        this.http.get<StudentInscriptionDTO>(url)
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

    
    // @GetMapping("/find-one/by-student-keycloak-id-and-discipline-id")
    //llama al back, trae todos los usuarios de la DB del MS
    async getOneByKeycloakIdAnddisciplineId(studentKeycloakId: string, disciplineId: string): Promise<StudentInscriptionDTO> {
  
          const url = `${this.API_URL}/find-one/by-student-keycloak-id-and-discipline-id` +
                `?studentKeycloakId=${encodeURIComponent(studentKeycloakId)}` +
                `&disciplineId=${encodeURIComponent(disciplineId)}`;

      const resp = await firstValueFrom(
        this.http.get<StudentInscriptionDTO>(url)
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
