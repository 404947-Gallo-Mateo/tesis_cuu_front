import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { KeycloakHelperService } from '../keycloak/keycloak-helper.service';
import { catchError, delay, firstValueFrom, retryWhen, take } from 'rxjs';
import { throwError as observableThrowError } from 'rxjs';
import { PostDisciplineDTO } from '../../../models/backend/PostDisciplineDTO';
import { DisciplineDto } from '../../../models/backend/DisciplineDTO';

@Injectable({
  providedIn: 'root'
})
export class BackDisciplineService {

  constructor() { }

    private http = inject(HttpClient);
    private keycloakHelper = inject(KeycloakHelperService);
    private readonly API_URL = 'http://localhost:8090/discipline'; 


    // @PostMapping("/create")
    async postDiscipline(postDisciplineDTO: PostDisciplineDTO): Promise<DisciplineDto> {
        
          const resp: any = await firstValueFrom(
              this.http.post(`${this.API_URL}/create`, postDisciplineDTO)
                .pipe(
                  retryWhen(errors =>
                    errors.pipe(
                      delay(1000),
                      take(3)
                    )
                  ),
                  catchError(error => {
                    console.error('No se pudo crear la disciplina.');
                    return observableThrowError(() => error);
                  })
                )
          );
        
            let respDisciplineDto: DisciplineDto = resp;
            return respDisciplineDto;
    }


    // @PutMapping("/update")
    async putDiscipline(disciplineDTO: DisciplineDto): Promise<DisciplineDto> {
        
          const resp: any = await firstValueFrom(
              this.http.post(`${this.API_URL}/update`, disciplineDTO)
                .pipe(
                  retryWhen(errors =>
                    errors.pipe(
                      delay(1000),
                      take(3)
                    )
                  ),
                  catchError(error => {
                    console.error('No se pudo actualizar la disciplina.');
                    return observableThrowError(() => error);
                  })
                )
          );
        
            let respDisciplineDto: DisciplineDto = resp;
            return respDisciplineDto;
    }


  // @DeleteMapping("/delete")
  //llama al back, elimina en DB Disciplinas
  async deleteDisciplineById(disciplineId: string): Promise<boolean> {
    const url = `${this.API_URL}/delete` +
                `&disciplineId=${encodeURIComponent(disciplineId)}`;

    const resp: any = await firstValueFrom(
      this.http.delete(url).pipe(
        retryWhen(errors =>
          errors.pipe(delay(1000), take(3))
        ),
        catchError(error => {
          console.error('No se pudo eliminar la disciplina luego de 3 intentos.', error);
          return observableThrowError(() => error);
        })
      )
    );

    return resp;
  }


  // @GetMapping("/find-one/by-name")
      //llama al back, trae todos los usuarios de la DB del MS
      async getOneByDisciplineName(disciplineName: string): Promise<DisciplineDto> {
    
        const url = `${this.API_URL}/find-one/by-name` +
                  `&disciplineName=${encodeURIComponent(disciplineName)}`;
  
        const resp = await firstValueFrom(
          this.http.get<DisciplineDto>(url)
            .pipe(
              retryWhen(errors =>
                errors.pipe(
                  delay(1000),
                  take(3)
                )
              ),
              catchError(error => {
                console.error('No se pudo obtener las disciplinas segun su nombre.');
                return observableThrowError(() => error);
              })
            )
        );
    
        return resp;
      }


      // @GetMapping("/find-one/by-id")
      //llama al back, trae todos los usuarios de la DB del MS
      async getOneByDisciplineId(disciplineId: string): Promise<DisciplineDto> {
    
        const url = `${this.API_URL}/find-one/by-id` +
                  `&disciplineId=${encodeURIComponent(disciplineId)}`;
  
        const resp = await firstValueFrom(
          this.http.get<DisciplineDto>(url)
            .pipe(
              retryWhen(errors =>
                errors.pipe(
                  delay(1000),
                  take(3)
                )
              ),
              catchError(error => {
                console.error('No se pudo obtener la disciplina segun su id.');
                return observableThrowError(() => error);
              })
            )
        );
    
        return resp;
      }


            // @GetMapping("/find-all/by-teacher-keycloak-id")
      //llama al back, trae todos los usuarios de la DB del MS
      async getAllByTeacherKeycloakId(teacherKeycloakId: string): Promise<DisciplineDto[]> {
    
        const url = `${this.API_URL}/find-all/by-teacher-keycloak-id` +
                  `&teacherKeycloakId=${encodeURIComponent(teacherKeycloakId)}`;
  
        const resp = await firstValueFrom(
          this.http.get<DisciplineDto[]>(url)
            .pipe(
              retryWhen(errors =>
                errors.pipe(
                  delay(1000),
                  take(3)
                )
              ),
              catchError(error => {
                console.error('No se pudo obtener las disciplinas segun teacherKeycloakId.');
                return observableThrowError(() => error);
              })
            )
        );
    
        return resp;
      }


      // @GetMapping("/get-all")
      //llama al back, trae todos los usuarios de la DB del MS
      async getAll(): Promise<DisciplineDto[]> {
    
        const url = `${this.API_URL}/get-all`;

        const resp = await firstValueFrom(
          this.http.get<DisciplineDto[]>(url)
            .pipe(
              retryWhen(errors =>
                errors.pipe(
                  delay(1000),
                  take(3)
                )
              ),
              catchError(error => {
                console.error('No se pudo obtener las disciplinas.');
                return observableThrowError(() => error);
              })
            )
        );
    
        return resp;
      }
}
