import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, pipe, retry } from 'rxjs';
import { throwError as observableThrowError } from 'rxjs';
import { FeeDTO } from '../../../models/backend/FeeDTO';
import { Role } from '../../../models/backend/embeddables/Role';
import { FeeType } from '../../../models/backend/embeddables/FeeType';


@Injectable({
  providedIn: 'root'
})
export class FeeService {

  constructor() { }

  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8090/fee'; 

    // @PutMapping("/update-paid-state")
    Update_Discipline_FeePaidState(studentKeycloakId: string, feeType: FeeType, disciplineId: string, period: string, userResponsibleRole: Role): Observable<FeeDTO> {  
      const url = `${this.API_URL}/update-paid-state` +
                `?studentKeycloakId=${encodeURIComponent(studentKeycloakId)}` +
                `&feeType=${encodeURIComponent(feeType)}` +
                `&disciplineId=${encodeURIComponent(disciplineId)}` +
                `&period=${encodeURIComponent(period)}` + 
                `&userResponsibleRole=${encodeURIComponent(userResponsibleRole)}`;


      return this.http.put<FeeDTO>(url, null).pipe(
        retry({
          count: 3,
          delay: 1000,
          resetOnSuccess: true
        }),
        catchError(error => {
          console.error('No se pudo actualizar la disciplina.');
          return observableThrowError(() => error);
        })
      );
    }

    Update_Social_FeePaidState(studentKeycloakId: string, feeType: FeeType, period: string, userResponsibleRole: Role): Observable<FeeDTO> {
      // http://localhost:8090/fee/update-paid-state 
      //        ?studentKeycloakId=  3a07120e-0b2d-4edf-9560-33d17a43660e
      //        &feeType=  SOCIAL
      //        &period=   2025-05
      //        &userResponsibleRole=  ADMIN_CUU

      const url = `${this.API_URL}/update-paid-state` +
                `?studentKeycloakId=${encodeURIComponent(studentKeycloakId)}` +
                `&feeType=${encodeURIComponent(feeType)}` +
                `&period=${encodeURIComponent(period)}` + 
                `&userResponsibleRole=${encodeURIComponent(userResponsibleRole)}`;


      return this.http.put<FeeDTO>(url, null).pipe(
        retry({
          count: 3,
          delay: 1000,
          resetOnSuccess: true
        }),
        catchError(error => {
          console.error('No se pudo actualizar la disciplina.');
          return observableThrowError(() => error);
        })
      );
    }

    formatYearMonth(period: string): string {
      console.log("period: ", period);

      // Verifica si el formato ya es yyyy-mm
      const yearMonthRegex = /^\d{4}-\d{2}$/;
      
      if (yearMonthRegex.test(period)) {
        return period;
      }

      const [year, month] = period.split('-');
      if (month && year) {
        return `${year}-${month.padStart(2, '0')}`;
      }

      // Si no coincide con ningún formato conocido, lanza un error
      throw new Error(`Formato de periodo no válido: ${period}. Se espera yyyy-mm`);
    }

    // @GetMapping("/find-all/by-student-keycloak-id")
    getAllByStudentKeycloakId(studentKeycloakId: string): Observable<FeeDTO[]> {
      // http://localhost:8090/fee/find-all/by-student-keycloak-id?studentKeycloakId=1
      const url = `${this.API_URL}/find-all/by-student-keycloak-id` +
                  `?studentKeycloakId=${encodeURIComponent(studentKeycloakId)}`;
    
      return this.http.get<FeeDTO[]>(url).pipe(
        retry({
          count: 3,
          delay: 1000,
          resetOnSuccess: true
        }),
        catchError(error => {
          console.error('No se pudo obtener todas las cuotas del alumno.');
          return observableThrowError(() => error);
        })
      );
    }



    // @GetMapping("/find-all/by-student-keycloak-id-and-discipline-id")
    getAllByStudentKeycloakIdAndDisciplineId(studentKeycloakId: string, disciplineId: string): Observable<FeeDTO[]> {
      //  http://localhost:8090/fee/find-all/by-student-keycloak-id-and-discipline-id?studentKeycloakId=1&disciplineId=11111111-1111-1111-1111-111111111111
      const url = `${this.API_URL}/find-all/by-student-keycloak-id-and-discipline-id` +
                  `?studentKeycloakId=${encodeURIComponent(studentKeycloakId)}` +
                  `?disciplineId=${encodeURIComponent(disciplineId)}`;
    
      return this.http.get<FeeDTO[]>(url).pipe(
        retry({
          count: 3,
          delay: 1000,
          resetOnSuccess: true
        }),
        catchError(error => {
          console.error('No se pudo obtener todas las cuotas del alumno.');
          return observableThrowError(() => error);
        })
      );
    }
}
