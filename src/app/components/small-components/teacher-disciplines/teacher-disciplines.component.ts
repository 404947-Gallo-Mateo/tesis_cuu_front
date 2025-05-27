import { Component, inject } from '@angular/core';
import { ExpandedUserDTO } from '../../../models/backend/ExpandedUserDTO';
import { DisciplineDto } from '../../../models/backend/DisciplineDTO';
import { BackUserService } from '../../../services/backend-helpers/user/back-user.service';
import { KeycloakHelperService } from '../../../services/backend-helpers/keycloak/keycloak-helper.service';
import { filter, Subject, switchMap, takeUntil, tap, finalize, of } from 'rxjs';
import { BackDisciplineService } from '../../../services/backend-helpers/discipline/back-discipline.service';
import { CommonModule } from '@angular/common';
import { PutDisciplineFormComponent } from '../../forms/put-discipline-form/put-discipline-form.component';

@Component({
  selector: 'app-teacher-disciplines',
  standalone: true,
  imports: [CommonModule, PutDisciplineFormComponent],
  templateUrl: './teacher-disciplines.component.html',
  styleUrl: './teacher-disciplines.component.css'
})
export class TeacherDisciplinesComponent {

  // En el componente padre
selectedDiscipline?: DisciplineDto;
showDisciplineModal = false;

openDisciplineModal(discipline: DisciplineDto): void {
  this.selectedDiscipline = discipline;
  this.showDisciplineModal = true;
}

closeDisciplineModal(): void {
  this.showDisciplineModal = false;
  this.selectedDiscipline = undefined;
}

onDisciplineUpdated(updatedDiscipline: DisciplineDto): void {
  // Actualizar la lista de disciplinas o hacer lo que necesites
  console.log('Disciplina actualizada:', updatedDiscipline);
}

  currentUser!: ExpandedUserDTO;
  currentUserDisciplines: DisciplineDto[] = [];
  
  // Estados de carga
  isLoaded = false;
  isLoadingDisciplines = false;
  showModal = false;
  
  private userService = inject(BackUserService);
  private disciplineService = inject(BackDisciplineService);
  private keycloakHelper = inject(KeycloakHelperService);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    console.log("Inicializando teacherDisciplinesComponent...");
    
    this.loadInitialData();
    this.setupRealtimeUpdates();
  }

  private loadInitialData(): void {
    this.keycloakHelper.isReady$.pipe(
      filter(isReady => isReady),
      tap(() => this.isLoaded = true),
      switchMap(() => this.userService.getCurrentUser()),
      switchMap(() => this.userService.currentUserValid$),
      tap(user => this.currentUser = user),
      switchMap(user => {
        if (user.role === 'TEACHER') {
          this.isLoadingDisciplines = true;
          return this.disciplineService.getAllByTeacherKeycloakId(user.keycloakId).pipe(
            finalize(() => this.isLoadingDisciplines = false)
          );
        } else {
          return of([]); // Retorna array vacío si no es profesor
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (disciplines) => {
        this.currentUserDisciplines = disciplines;
        console.log("Disciplinas iniciales del profesor:", disciplines);
      },
      error: (error) => {
        console.error('Error al cargar datos iniciales:', error);
        this.isLoadingDisciplines = false;
      }
    });
  }

  private setupRealtimeUpdates(): void {
    this.userService.currentUserValid$.pipe(
      filter(user => user.role != 'STUDENT'), // Solo si es profesor
      tap(() => this.isLoadingDisciplines = true),
      switchMap(user => 
        this.disciplineService.getAllByTeacherKeycloakId(user.keycloakId).pipe(
          finalize(() => this.isLoadingDisciplines = false)
        )
      ),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (disciplines) => {
        this.currentUserDisciplines = disciplines;
        console.log("Disciplinas actualizadas:", disciplines);
      },
      error: (error) => {
        console.error('Error en actualización en tiempo real:', error);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // openModal(discipline: DisciplineDto): void {
  //   this.selectedDiscipline = discipline;
  //   this.showModal = true;
  // }

  // closeModal(): void {
  //   this.showModal = false;
  //   this.selectedDiscipline = undefined;
  // }
}