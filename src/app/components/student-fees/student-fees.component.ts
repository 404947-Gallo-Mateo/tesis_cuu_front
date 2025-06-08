import { Component, inject } from '@angular/core';
import { ExpandedUserDTO } from '../../models/backend/ExpandedUserDTO';
import { BackUserService } from '../../services/backend-helpers/user/back-user.service';
import { FeeService } from '../../services/backend-helpers/fee/fee.service';
import { KeycloakHelperService } from '../../services/backend-helpers/keycloak/keycloak-helper.service';
import { filter, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { FeeDTO } from '../../models/backend/FeeDTO';
import { FeeType } from '../../models/backend/embeddables/FeeType';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-fees',
  imports: [CommonModule],
  templateUrl: './student-fees.component.html',
  styleUrl: './student-fees.component.css'
})
export class StudentFeesComponent {
  currentUser!: ExpandedUserDTO;
  isLoaded = false;
  feesLoaded = false;

  showUnpaid = true; // Mostrar pendientes por defecto
  showPaid = false;  // Ocultar pagadas por defecto

  toggleView(): void {
    this.showUnpaid = !this.showUnpaid;
    this.showPaid = !this.showPaid;
  }
  // Estructura para organizar las cuotas
  unpaidFees: { social: FeeDTO[]; discipline: FeeDTO[] } = { social: [], discipline: [] };
  paidFees: { social: FeeDTO[]; discipline: FeeDTO[] } = { social: [], discipline: [] };
  
  private userService = inject(BackUserService);
  private feeService = inject(FeeService);
  private keycloakHelper = inject(KeycloakHelperService);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {    
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.keycloakHelper.isReady$.pipe(
      filter(isReady => isReady),
      tap(() => this.isLoaded = true),
      switchMap(() => this.userService.getCurrentUser()),
      switchMap(() => this.userService.currentUserValid$),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (user) => {
        this.currentUser = user;
        this.loadFees();
      },
      error: (error) => console.error('Error al obtener usuario:', error)
    });
  }

  loadFees(): void {
    if (!this.currentUser?.keycloakId) return;
    
    this.feeService.getAllByStudentKeycloakId(this.currentUser.keycloakId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (fees) => this.processFees(fees),
        error: (error) => console.error('Error al cargar cuotas:', error)
      });
  }

  private processFees(fees: FeeDTO[]): void {
    // Reiniciar estructuras
    this.unpaidFees = { social: [], discipline: [] };
    this.paidFees = { social: [], discipline: [] };

    // Dividir cuotas pagadas/no pagadas
    const unpaid = fees.filter(fee => !fee.paid);
    const paid = fees.filter(fee => fee.paid);

    // Procesar cuotas SOCIAL
    this.unpaidFees.social = unpaid.filter(f => f.feeType === FeeType.SOCIAL);
    this.paidFees.social = paid.filter(f => f.feeType === FeeType.SOCIAL);

    // Procesar y ordenar cuotas DISCIPLINE
    this.unpaidFees.discipline = this.sortDisciplineFees(
      unpaid.filter(f => f.feeType === FeeType.DISCIPLINE)
    );
    this.paidFees.discipline = this.sortDisciplineFees(
      paid.filter(f => f.feeType === FeeType.DISCIPLINE)
    );
    
    this.feesLoaded = true;
  }

  private sortDisciplineFees(fees: FeeDTO[]): FeeDTO[] {
    return fees.sort((a, b) => {
      // Ordenar por nombre de disciplina
      if (a.disciplineName! < b.disciplineName!) return -1;
      if (a.disciplineName! > b.disciplineName!) return 1;
      
      // Ordenar por periodo si misma disciplina
      return a.period.localeCompare(b.period);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
