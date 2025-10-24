import { Component, inject } from '@angular/core';
import { FeeDTO } from '../../models/backend/FeeDTO';
import { ExpandedUserDTO } from '../../models/backend/ExpandedUserDTO';
import { BackUserService } from '../../services/backend-helpers/user/back-user.service';
import { FeeService } from '../../services/backend-helpers/fee/fee.service';
import { KeycloakHelperService } from '../../services/backend-helpers/keycloak/keycloak-helper.service';
import { catchError, filter, forkJoin, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { ExpandedStudentInscriptionDTO } from '../../models/backend/ExpandedStudentInscriptionDTO';
import { BackStudentInscriptionService } from '../../services/backend-helpers/student-inscription/back-student-inscription.service';
import { DisciplineSummaryDTO } from '../../models/backend/DisciplineSummaryDTO';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { AgePipe } from '../../CustomPipes/age.pipe';
import { GenrePipe } from '../../CustomPipes/genre.pipe';
import { ModalStudentFeesComponent } from "../forms/modal-student-fees/modal-student-fees.component";
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-administrate-fees',
  imports: [RouterLink, RouterLinkActive, CommonModule, NgxPaginationModule, FormsModule, AgePipe, GenrePipe, ModalStudentFeesComponent],
  templateUrl: './administrate-fees.component.html',
  styleUrl: './administrate-fees.component.css'
})
export class AdministrateFeesComponent {

  currentUser!: ExpandedUserDTO;
  isLoaded = false;

  // Agrega esta función de filtro en la clase
filterInscriptions(inscriptions: ExpandedStudentInscriptionDTO[], term: string): ExpandedStudentInscriptionDTO[] {
  if (!term || term.trim() === '') return inscriptions;
  
  const lowerTerm = term.toLowerCase().trim();
  return inscriptions.filter(ins => 
    (ins.student.firstName.toLowerCase() + ' ' + ins.student.lastName.toLowerCase()).includes(lowerTerm) ||
    ins.student.email.toLowerCase().includes(lowerTerm)
  );
}

// Agrega esta propiedad en la clase
debtorSearchTerm: string = '';

  // Modos de visualización
  debtorMode = false;
  
  // Estructuras para datos
  disciplines: DisciplineSummaryDTO[] = [];
// En la propiedad disciplineInscriptions, agrega searchTerm
disciplineInscriptions: { 
  [disciplineId: string]: {
    inscriptions: ExpandedStudentInscriptionDTO[];
    expanded: boolean;
    loading: boolean;
    page: number;
    searchTerm: string; 
  }
} = {};
  
  debtorInscriptions: ExpandedStudentInscriptionDTO[] = [];
  
  // Configuración paginación
  itemsPerPage = 5;
  debtorPage = 1;
  loadingDebtors = false;

  private userService = inject(BackUserService);
  private keycloakHelper = inject(KeycloakHelperService);
  private inscriptionService = inject(BackStudentInscriptionService);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {    
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.keycloakHelper.isReady$.pipe(
      filter(isReady => isReady),
      switchMap(() => this.userService.getCurrentUser()),
      switchMap(() => this.userService.currentUserValid$),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (user) => {
        this.currentUser = user;
        this.disciplines = user.teacherDisciplines || [];
        this.initializeDisciplineData();
        this.isLoaded = true;

        //console.log('disciplines del teacher', this.disciplines);
      },
      error: (error) => console.error('Error al obtener usuario:', error)
    });
  }

initializeDisciplineData(): void {
  let startexpanded:boolean = false;

  this.disciplines.forEach(discipline => {
    this.disciplineInscriptions[discipline.id] = {
      inscriptions: [],
      expanded: startexpanded,
      loading: false,
      page: 1,
      searchTerm: '' 
    };
  });

  //agregar disciplinesInscriptions con isDue==true  a this.debtorInscriptions

}

  toggleView(): void {
    this.debtorMode = !this.debtorMode;
    if (this.debtorMode) {
      this.loadDebtorInscriptions();
    }
  }

  toggleDiscipline(disciplineId: string): void {
    const disciplineData = this.disciplineInscriptions[disciplineId];
    disciplineData.expanded = !disciplineData.expanded;
    
    if (disciplineData.expanded && disciplineData.inscriptions.length === 0) {
      this.loadInscriptionsForDiscipline(disciplineId);
    }
  }

  loadInscriptionsForDiscipline(disciplineId: string): void {
    const disciplineData = this.disciplineInscriptions[disciplineId];
    disciplineData.loading = true;
    
    this.inscriptionService.getAllByDisciplineIdWithFees(disciplineId).pipe(
      catchError(error => {
        console.error('Error cargando inscripciones:', error);
        disciplineData.loading = false;
        return of([]);
      })
    ).subscribe(inscriptions => {
      //console.log("inscriptions: ", inscriptions);
      disciplineData.inscriptions = inscriptions;
      disciplineData.loading = false;
      //console.log("disciplineID: ", disciplineId, " | inscriptions: ", disciplineData.inscriptions)
    });    
  }

loadDebtorInscriptions(): void {
  this.loadingDebtors = true;
  this.debtorInscriptions = [];

  this.inscriptionService.getAllWithFees().pipe(
    catchError(error => {
      console.error('Error cargando inscripciones:', error);
      this.loadingDebtors = false;
      return of([]);
    })
  ).subscribe(inscriptions => {
    // Extraemos los IDs de las disciplinas permitidas
    const allowedDisciplineIds = this.disciplines.map(d => d.id);
    
    // Filtramos usando los IDs
    this.debtorInscriptions = inscriptions.filter(ins => 
      ins.isDebtor && 
      allowedDisciplineIds.includes(ins.discipline.id)
    );
    
    this.loadingDebtors = false;
  });      
}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Control del modal
  showFeesModal = false;
  selectedInscriptionFees: FeeDTO[] = [];

   openFeesModal(fees: FeeDTO[]): void {
    this.selectedInscriptionFees = [...fees]; 
    this.showFeesModal = true;
  }

  closeFeesModal(): void {
    this.showFeesModal = false;
  }

  handleFeeUpdated(updatedFee: FeeDTO): void {
    // Actualizar todas las estructuras que contengan esta cuota
    
    // 1. Actualizar en las inscripciones por disciplina
    for (const disciplineId in this.disciplineInscriptions) {
      const disciplineData = this.disciplineInscriptions[disciplineId];
      disciplineData.inscriptions.forEach(inscription => {
        const feeIndex = inscription.inscriptionFees.findIndex(f => 
          f.feeType === updatedFee.feeType &&
          f.disciplineId === updatedFee.disciplineId &&
          f.period === updatedFee.period
        );
        
        if (feeIndex !== -1) {
          inscription.inscriptionFees[feeIndex] = updatedFee;
          
          // Actualizar estado deudor si es necesario
          if (inscription.isDebtor && updatedFee.paid) {
            inscription.isDebtor = inscription.inscriptionFees.some(fee => !fee.paid);
          }
        }
      });
    }
    
    // 2. Actualizar en la lista de deudores
    this.debtorInscriptions.forEach(inscription => {
      const feeIndex = inscription.inscriptionFees.findIndex(f => 
        f.feeType === updatedFee.feeType &&
        f.disciplineId === updatedFee.disciplineId &&
        f.period === updatedFee.period
      );
      
      if (feeIndex !== -1) {
        inscription.inscriptionFees[feeIndex] = updatedFee;
        
        // Si ya no es deudor, remover de la lista
        if (inscription.isDebtor && updatedFee.paid) {
          inscription.isDebtor = inscription.inscriptionFees.some(fee => !fee.paid);
          
          if (!inscription.isDebtor) {
            this.debtorInscriptions = this.debtorInscriptions.filter(
              ins => ins.student.keycloakId !== inscription.student.keycloakId || 
                     ins.discipline.id !== inscription.discipline.id
            );
          }
        }
      }
    });
    
    // 3. Actualizar la lista actual en el modal
    const modalFeeIndex = this.selectedInscriptionFees.findIndex(f => 
      f.feeType === updatedFee.feeType &&
      f.disciplineId === updatedFee.disciplineId &&
      f.period === updatedFee.period
    );
    
    if (modalFeeIndex !== -1) {
      this.selectedInscriptionFees[modalFeeIndex] = updatedFee;
    }
  }
  
}
