import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MPFeeDTO } from '../../../models/backend/MPFeeDTO';
import { catchError, Observable, retry } from 'rxjs';
import { throwError as observableThrowError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MpService {

  constructor() { }

  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8090/mercado-pago'; 

      // @PostMapping("/create")
  createPreference(mpFeeDTO: MPFeeDTO): Observable<any> {
    return this.http.post<any>(`${this.API_URL}`, mpFeeDTO).pipe(
      retry({
            count: 3,
            delay: 1000,
            resetOnSuccess: true
          }),
      catchError(error => {
        console.error('No se pudo empezar el proceso de pago.');
        return observableThrowError(() => error);
      })
    );
  }
  
}
