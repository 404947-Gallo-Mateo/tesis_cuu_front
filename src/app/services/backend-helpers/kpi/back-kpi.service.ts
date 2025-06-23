import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, retry } from 'rxjs';
import { throwError as observableThrowError } from 'rxjs';
import { KpiGenreQuantities } from '../../../models/backend/kpis/KpiGenreQuantities';
import { KpiAgeDistribution } from '../../../models/backend/kpis/KpiAgeDistribution';
import { KpiDebtorsQuantity } from '../../../models/backend/kpis/KpiDebtorsQuantity';
import { KpiRevenuePerPeriodDistribution } from '../../../models/backend/kpis/KpiRevenuePerPeriodDistribution';

@Injectable({
  providedIn: 'root'
})
export class BackKpiService {

  constructor() { }

  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8090/kpi'; 

// -------------------- KPIs USER ------------------ //
  // @GetMapping("/user/get-quantity")
  kpiUserGetQuantity(startLocalDate: string, endLocalDate: string): Observable<number> {
    //url ej: http://localhost:8090/kpi/user/get-quantity?start=2020-10-10&end=2021-10-10
    const url = `${this.API_URL}/user/get-quantity?start=${encodeURIComponent(startLocalDate)}&end=${encodeURIComponent(endLocalDate)}`;
  
    return this.http.get<number>(url).pipe(
        retry({
          count: 3,
          delay: 1000,
          resetOnSuccess: true
        }),
        catchError(error => {
          console.error('KPI ERROR: No se pudo obtener la cant de usuarios entre las fechas indicadas.');
          return observableThrowError(() => error);
        })
    );
  }

  // @GetMapping("/user/get-quantity-for-each-gender")
  kpiUserGetQuantityForeachGender(startLocalDate: string, endLocalDate: string): Observable<KpiGenreQuantities> {
    //url ej: http://localhost:8090/kpi/user/get-quantity-for-each-gender?start=2020-10-10&end=2021-10-10
    const url = `${this.API_URL}/user/get-quantity-for-each-gender?start=${encodeURIComponent(startLocalDate)}&end=${encodeURIComponent(endLocalDate)}`;
  
    return this.http.get<KpiGenreQuantities>(url).pipe(
        retry({
          count: 3,
          delay: 1000,
          resetOnSuccess: true
        }),
        catchError(error => {
          console.error('KPI ERROR: No se pudo obtener la cant de usuarios, por cada genero, entre las fechas indicadas.');
          return observableThrowError(() => error);
        })
    );
  }

  // @GetMapping("/user/get-age-distribution")
  kpiUserGetAgeDistribution(startLocalDate: string, endLocalDate: string): Observable<KpiAgeDistribution[]> {
    //url ej: http://localhost:8090/kpi/user/get-age-distribution?start=2020-10-10&end=2021-10-10
    const url = `${this.API_URL}/user/get-age-distribution?start=${encodeURIComponent(startLocalDate)}&end=${encodeURIComponent(endLocalDate)}`;
  
    return this.http.get<KpiAgeDistribution[]>(url).pipe(
        retry({
          count: 3,
          delay: 1000,
          resetOnSuccess: true
        }),
        catchError(error => {
          console.error('KPI ERROR: No se pudo obtener la distribucion de edad los de usuarios, entre las fechas indicadas.');
          return observableThrowError(() => error);
        })
    );
  }

// -------------------- KPIs FEE feeType:SOCIAL ------------------ //
  // @GetMapping("/fee-social/get-debtor-and-uptodate")
  kpiFeeSocialGetDebtorsAndUpToDateQuantities(startLocalDate: string, endLocalDate: string): Observable<KpiDebtorsQuantity> {
    //url ej: http://localhost:8090/kpi/fee-social/get-debtor-and-uptodate?start=2020-10-10&end=2021-10-10
    const url = `${this.API_URL}/fee-social/get-debtor-and-uptodate?start=${encodeURIComponent(startLocalDate)}&end=${encodeURIComponent(endLocalDate)}`;
  
    return this.http.get<KpiDebtorsQuantity>(url).pipe(
        retry({
          count: 3,
          delay: 1000,
          resetOnSuccess: true
        }),
        catchError(error => {
          console.error('KPI ERROR: No se pudo obtener la cant de usuarios deudores y NO deudores de las Cuotas tipo SOCIAL, entre las fechas indicadas.');
          return observableThrowError(() => error);
        })
    );
  }

  // @GetMapping("/fee-social/get-revenue")
  kpiFeeSocialGetRevenueAmount(startLocalDate: string, endLocalDate: string): Observable<number> {
    //url ej: http://localhost:8090/kpi/fee-social/get-revenue?start=2020-10-10&end=2021-10-10
    const url = `${this.API_URL}/fee-social/get-revenue?start=${encodeURIComponent(startLocalDate)}&end=${encodeURIComponent(endLocalDate)}`;
  
    return this.http.get<number>(url).pipe(
        retry({
          count: 3,
          delay: 1000,
          resetOnSuccess: true
        }),
        catchError(error => {
          console.error('KPI ERROR: No se pudo obtener la cant de Ingresos de las Cuotas tipo SOCIAL, entre las fechas indicadas.');
          return observableThrowError(() => error);
        })
    );
  }

  // @GetMapping("/fee-social/get-revenue-per-period")
  kpiFeeSocialGetRevenuePerPeriod(startLocalDate: string, endLocalDate: string): Observable<KpiRevenuePerPeriodDistribution[]> {
    //url ej: http://localhost:8090/kpi/fee-social/get-revenue-per-period?start=2020-10-10&end=2021-10-10
    const url = `${this.API_URL}/fee-social/get-revenue-per-period?start=${encodeURIComponent(startLocalDate)}&end=${encodeURIComponent(endLocalDate)}`;
  
    return this.http.get<KpiRevenuePerPeriodDistribution[]>(url).pipe(
        retry({
          count: 3,
          delay: 1000,
          resetOnSuccess: true
        }),
        catchError(error => {
          console.error('KPI ERROR: No se pudo obtener la cant de Ingresos, POR PERIODO, de las Cuotas tipo SOCIAL, entre las fechas indicadas.');
          return observableThrowError(() => error);
        })
    );
  }

// -------------------- KPIs FEE feeType:DISCIPLINE ------------------ //
  // @GetMapping("/fee-discipline/get-debtor-and-uptodate/{disciplineId}")
  kpiFeeDisciplineGetDebtorsAndUpToDateQuantities(disciplineId: string, startLocalDate: string, endLocalDate: string): Observable<KpiDebtorsQuantity> {
    //url ej: http://localhost:8090/kpi/fee-discipline/get-debtor-and-uptodate/22222222-2222-2222-2222-222222222222?start=2020-10-10&end=2021-10-10
    const url = `${this.API_URL}/fee-discipline/get-debtor-and-uptodate/${encodeURIComponent(disciplineId)}?start=${encodeURIComponent(startLocalDate)}&end=${encodeURIComponent(endLocalDate)}`;

    return this.http.get<KpiDebtorsQuantity>(url).pipe(
        retry({
          count: 3,
          delay: 1000,
          resetOnSuccess: true
        }),
        catchError(error => {
          console.error('KPI ERROR: No se pudo obtener la cant de usuarios deudores y NO deudores de la Disciplina indicada, entre las fechas indicadas.');
          return observableThrowError(() => error);
        })
    );
  }

  // @GetMapping("/fee-discipline/get-revenue/{disciplineId}")
  kpiFeeDisciplineGetRevenueAmount(disciplineId: string, startLocalDate: string, endLocalDate: string): Observable<number> {
    //url ej: http://localhost:8090/kpi/fee-discipline/get-revenue/22222222-2222-2222-2222-222222222222?start=2020-10-10&end=2021-10-10
    const url = `${this.API_URL}/fee-discipline/get-revenue/${encodeURIComponent(disciplineId)}?start=${encodeURIComponent(startLocalDate)}&end=${encodeURIComponent(endLocalDate)}`;
  
    return this.http.get<number>(url).pipe(
        retry({
          count: 3,
          delay: 1000,
          resetOnSuccess: true
        }),
        catchError(error => {
          console.error('KPI ERROR: No se pudo obtener la cant de Ingresos de la Disciplina indicada, entre las fechas indicadas.');
          return observableThrowError(() => error);
        })
    );
  }

  // @GetMapping("/fee-discipline/get-revenue-per-period/{disciplineId}")
  kpiFeeDisciplineGetRevenuePerPeriod(disciplineId: string, startLocalDate: string, endLocalDate: string): Observable<KpiRevenuePerPeriodDistribution[]> {
    //url ej: http://localhost:8090/kpi/fee-discipline/get-revenue-per-period/22222222-2222-2222-2222-222222222222?start=2020-10-10&end=2021-10-10
    const url = `${this.API_URL}/fee-discipline/get-revenue-per-period/${encodeURIComponent(disciplineId)}?start=${encodeURIComponent(startLocalDate)}&end=${encodeURIComponent(endLocalDate)}`;
  
    return this.http.get<KpiRevenuePerPeriodDistribution[]>(url).pipe(
        retry({
          count: 3,
          delay: 1000,
          resetOnSuccess: true
        }),
        catchError(error => {
          console.error('KPI ERROR: No se pudo obtener la cant de Ingresos, POR PERIODO, de la Disciplina indicada, entre las fechas indicadas.');
          return observableThrowError(() => error);
        })
    );
  }

// -------------------- KPIs DISCIPLINE ------------------ //
// @GetMapping("/discipline/get-inscriptions/{disciplineId}")
  kpiDisciplineGetInscriptionsQuantity(disciplineId: string, startLocalDate: string, endLocalDate: string): Observable<number> {
    //url ej: http://localhost:8090/kpi/discipline/get-inscriptions/22222222-2222-2222-2222-222222222222?start=2020-10-10&end=2021-10-10
    const url = `${this.API_URL}/discipline/get-inscriptions/${encodeURIComponent(disciplineId)}?start=${encodeURIComponent(startLocalDate)}&end=${encodeURIComponent(endLocalDate)}`;
  
    return this.http.get<number>(url).pipe(
        retry({
          count: 3,
          delay: 1000,
          resetOnSuccess: true
        }),
        catchError(error => {
          console.error('KPI ERROR: No se pudo obtener la cant de usuarios inscriptos en la Discipline indicada, entre las fechas indicadas.');
          return observableThrowError(() => error);
        })
    );
  }

  // @GetMapping("/discipline/get-inscriptions-foreach-gender/{disciplineId}")
  kpiDisciplineGetInscriptionsQuantityForeachGender(disciplineId: string, startLocalDate: string, endLocalDate: string): Observable<KpiGenreQuantities> {
    //url ej: http://localhost:8090/kpi/discipline/get-inscriptions-foreach-gender/22222222-2222-2222-2222-222222222222?start=2020-10-10&end=2021-10-10
    const url = `${this.API_URL}/discipline/get-inscriptions-foreach-gender/${encodeURIComponent(disciplineId)}?start=${encodeURIComponent(startLocalDate)}&end=${encodeURIComponent(endLocalDate)}`;
  
    return this.http.get<KpiGenreQuantities>(url).pipe(
        retry({
          count: 3,
          delay: 1000,
          resetOnSuccess: true
        }),
        catchError(error => {
          console.error('KPI ERROR: No se pudo obtener la cant de usuarios inscriptos en la Discipline indicada, por cada genero, entre las fechas indicadas.');
          return observableThrowError(() => error);
        })
    );
  }

  // @GetMapping("/discipline/get-age-distribution/{disciplineId}")
  kpiDisciplineGetAgeDistribution(disciplineId: string, startLocalDate: string, endLocalDate: string): Observable<KpiAgeDistribution[]> {
    //url ej: http://localhost:8090/kpi/discipline/get-age-distribution/22222222-2222-2222-2222-222222222222?start=2020-10-10&end=2021-10-10
    const url = `${this.API_URL}/discipline/get-age-distribution/${encodeURIComponent(disciplineId)}?start=${encodeURIComponent(startLocalDate)}&end=${encodeURIComponent(endLocalDate)}`;
  
    return this.http.get<KpiAgeDistribution[]>(url).pipe(
        retry({
          count: 3,
          delay: 1000,
          resetOnSuccess: true
        }),
        catchError(error => {
          console.error('KPI ERROR: No se pudo obtener la distribucion de edad los de usuarios inscriptos en la Discipline indicada, entre las fechas indicadas.');
          return observableThrowError(() => error);
        })
    );
  }


}
