import { Component, HostListener, inject, SimpleChanges } from '@angular/core';
import { ExpandedUserDTO } from '../../../models/backend/ExpandedUserDTO';
import { DisciplineDto } from '../../../models/backend/DisciplineDTO';
import { BackUserService } from '../../../services/backend-helpers/user/back-user.service';
import { KeycloakHelperService } from '../../../services/backend-helpers/keycloak/keycloak-helper.service';
import { filter, Subject, switchMap, takeUntil, tap, finalize, of } from 'rxjs';
import { BackDisciplineService } from '../../../services/backend-helpers/discipline/back-discipline.service';
import { CommonModule } from '@angular/common';
import { PutDisciplineFormComponent } from '../../forms/put-discipline-form/put-discipline-form.component';
import Swal from 'sweetalert2';
import { PostDisciplineFormComponent } from '../../forms/post-discipline-form/post-discipline-form.component';
import { AdministrateStudentInscriptionsComponent } from "../administrate-student-inscriptions/administrate-student-inscriptions.component";
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-teacher-disciplines',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, PutDisciplineFormComponent, PostDisciplineFormComponent, AdministrateStudentInscriptionsComponent],
  templateUrl: './teacher-disciplines.component.html',
  styleUrl: './teacher-disciplines.component.css'
})
export class TeacherDisciplinesComponent {

  openMenuId: string | null = null;

  showInscriptionsModal = false;
  selectedDisciplineId = '';

  openInscriptionsModal(disciplineId: string): void {
    //console.log("openInscriptionsModal");
    this.selectedDisciplineId = disciplineId;
    this.showInscriptionsModal = true;
  }

  closeInscriptionsModal(): void {
    this.showInscriptionsModal = false;
  }

  onInscriptionsUpdated(): void {
    // Lógica para actualizar datos si es necesario
    //console.log('Inscripciones actualizadas');
  }

  // En el componente padre
  selectedDiscipline?: DisciplineDto;
  showDisciplineModal = false;
  currentUser!: ExpandedUserDTO;
  currentUserDisciplines: DisciplineDto[] = [];
  
  // Estados de carga
  isLoaded = false;
  isLoadingDisciplines = false;
  showModal = false;

  //modal crear discipline
  showNewDisciplineModal = false;

  openNewDisciplineModal() {
    this.showNewDisciplineModal = true;
  }

  closeNewDisciplineModal() {
    this.showNewDisciplineModal = false;
  }

  onDisciplineCreated(newDiscipline: DisciplineDto) {
    // Actualiza la lista de disciplinas
    let currentUserIsATeachar = newDiscipline.teachers.find(x => x.keycloakId == this.currentUser.keycloakId);

    if(currentUserIsATeachar || (this.currentUser.role == "ADMIN_CUU"  || this.currentUser.role == "SUPER_ADMIN_CUU") ){
      this.currentUserDisciplines.push(newDiscipline);
    }
    this.closeNewDisciplineModal();
  }

   // Manejador para cerrar menús al hacer clic fuera
@HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent): void {
  if (!(event.target as HTMLElement).closest('.position-relative')) {
    this.openMenuId = null;
  }
}
  // Alternar menú
toggleMenu(disciplineId: string): void {
  this.openMenuId = this.openMenuId === disciplineId ? null : disciplineId;
}

  // Eliminar disciplina (adaptado de tu código extra)
  deleteDiscipline(discipline: DisciplineDto): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la Disciplina permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.disciplineService.deleteDisciplineById(discipline.id).subscribe({
          next: (resp: boolean) => {
            if (resp) {
              Swal.fire('Eliminada', 'La Disciplina fue eliminada correctamente.', 'success');
              // Actualizar la lista local
              this.currentUserDisciplines = this.currentUserDisciplines.filter(d => d.id !== discipline.id);
            } else {
              Swal.fire('Error', 'Hubo un problema en la Base de Datos al eliminar la Disciplina.', 'error');
            }
          },
          error: (err) => {
            console.error('Error eliminando disciplina:', err);
            Swal.fire('Error', 'Hubo un problema externo al eliminar la Disciplina.', 'error');
          }
        });
      }
    });
  }

  
openDisciplineModal(discipline: DisciplineDto): void {
  this.selectedDiscipline = discipline;
  this.showDisciplineModal = true;
}

closeDisciplineModal(): void {
  this.showDisciplineModal = false;
  this.selectedDiscipline = undefined;
}

// En TeacherDisciplinesComponent

onDisciplineUpdated(updatedDiscipline: DisciplineDto): void {
  // Encuentra el índice de la disciplina actualizada en el array
  const index = this.currentUserDisciplines.findIndex(d => d.id === updatedDiscipline.id);
  
  if (index !== -1) {
    // Actualiza la disciplina en el array
    this.currentUserDisciplines[index] = updatedDiscipline;
    
    // Opcional: Forzar una nueva referencia del array para detectar cambios
    this.currentUserDisciplines = [...this.currentUserDisciplines];
  } else {
    console.warn('Disciplina actualizada no encontrada en la lista actual');
  }
  
  // Cierra el modal
  this.closeDisciplineModal();
}

  private userService = inject(BackUserService);
  private disciplineService = inject(BackDisciplineService);
  private keycloakHelper = inject(KeycloakHelperService);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    //console.log("Inicializando teacherDisciplinesComponent...");
    this.loadInitialData();
    this.setupRealtimeUpdates();
    this.loadCurrentUser();
  }

    loadCurrentUser(): void {
      //console.log("Inicializando CuuStudentDisciplinesComponent...");
      
      // Inicializar Keycloak y luego suscribirse a los cambios del usuario
      this.keycloakHelper.isReady$.pipe(
        filter(isReady => isReady),
        tap(() => {
          //console.log("Keycloak está listo, iniciando suscripción al usuario...");
          this.isLoaded = true;
        }),
        switchMap(() => {
          // Primero obtener el usuario actual (esto iniciará la carga si es necesario)
          return this.userService.getCurrentUser();
        }),
        switchMap(() => {
          // Luego suscribirse a todos los cambios futuros del usuario
          return this.userService.currentUserValid$;
        }),
        takeUntil(this.destroy$)
      ).subscribe({
        next: (user) => {
          //console.log("Usuario actualizado en CuuStudentDisciplinesComponent:", user);
          this.currentUser = user;
        },
        error: (error) => {
          console.error('Error al obtener usuario:', error);
        }
      });
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
        } else if(user.role !== 'STUDENT'){
          this.isLoadingDisciplines = true;
          return this.disciplineService.getAll().pipe(
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
        //console.log("Disciplinas iniciales del profesor:", disciplines);
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
      switchMap(user => {
        if(user.role === 'TEACHER') {
          this.isLoadingDisciplines = true;
          return this.disciplineService.getAllByTeacherKeycloakId(user.keycloakId).pipe(
            finalize(() => this.isLoadingDisciplines = false)
          );
        } else if(user.role !== 'STUDENT'){
          this.isLoadingDisciplines = true;
          return this.disciplineService.getAll().pipe(
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
        //console.log("Disciplinas actualizadas:", disciplines);
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