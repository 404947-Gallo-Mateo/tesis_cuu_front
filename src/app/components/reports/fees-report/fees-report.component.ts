import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { AgePipe } from '../../../CustomPipes/age.pipe';
import { GenrePipe } from '../../../CustomPipes/genre.pipe';
import { ExpandedUserDTO } from '../../../models/backend/ExpandedUserDTO';
import { ExpandedStudentInscriptionDTO } from '../../../models/backend/ExpandedStudentInscriptionDTO';
import { DisciplineSummaryDTO } from '../../../models/backend/DisciplineSummaryDTO';
import { BackUserService } from '../../../services/backend-helpers/user/back-user.service';
import { KeycloakHelperService } from '../../../services/backend-helpers/keycloak/keycloak-helper.service';
import { BackStudentInscriptionService } from '../../../services/backend-helpers/student-inscription/back-student-inscription.service';
import { catchError, filter, of, Subject, switchMap, takeUntil } from 'rxjs';
import { Role } from '../../../models/backend/embeddables/Role';
import { UserGenre } from '../../../models/backend/embeddables/UserGenre';
import { FeeDTO } from '../../../models/backend/FeeDTO';
import { CategorySummaryDTO } from '../../../models/backend/CategorySummaryDTO';
import { DisciplineFeesDashboardComponent } from '../kpis/discipline-fees-dashboard/discipline-fees-dashboard.component';

@Component({
  selector: 'app-fees-report',
  imports: [DisciplineFeesDashboardComponent, CommonModule, NgxPaginationModule, FormsModule, AgePipe, GenrePipe],
  templateUrl: './fees-report.component.html',
  styleUrl: './fees-report.component.css'
})
export class FeesReportComponent {

  currentUser!: ExpandedUserDTO;
  isLoaded = false;

    uniqueCategories: { [disciplineId: string]: CategorySummaryDTO[] } = {};
    
    // Nuevas propiedades para filtros
  debtorStates = [
    { value: true, label: 'Deudor' },
    { value: false, label: 'Al día' }
  ];

    roles = [
      {value: Role.SUPER_ADMIN_CUU, label: "SuperAdmin"},
      {value: Role.ADMIN_CUU, label: "Admin"},
      {value: Role.TEACHER, label: "Profesor"},
      {value: Role.STUDENT, label: "Alumno"}
    ];
    
    genres = [
      { value: UserGenre.MALE, label: 'Masculino' },
      { value: UserGenre.FEMALE, label: 'Femenino' }
    ];

  getFilteredInscriptions(disciplineId: string): ExpandedStudentInscriptionDTO[] {
    const discData = this.disciplineInscriptions[disciplineId];
    
    // Primero aplica el filtro de checkboxes
    const checkboxFiltered = this.filterByCheckboxes(
      discData.inscriptions, 
      discData.filters
    );
    
    // Luego aplica el filtro de búsqueda
    return this.filterBySearchTerm(checkboxFiltered, discData.searchTerm);
  }

filterByCheckboxes(inscriptions: ExpandedStudentInscriptionDTO[], filters: any): ExpandedStudentInscriptionDTO[] {
  return inscriptions.filter(ins => {
    if (filters.isDebtor.length > 0 && !filters.isDebtor.includes(ins.isDebtor)) {
      return false;
    }
    
    if (filters.genres.length > 0 && !filters.genres.includes(ins.student.genre)) {
      return false;
    }
    
    if (filters.roles.length > 0 && !filters.roles.includes(ins.student.role)) {
      return false;
    }

      if (filters.categories.length > 0 && !filters.categories.includes(ins.category.id)) {
        return false;
      }
    
    return true;
  });
}

filterBySearchTerm(inscriptions: ExpandedStudentInscriptionDTO[], term: string): ExpandedStudentInscriptionDTO[] {
  if (!term || term.trim() === '') return inscriptions;
  
  const lowerTerm = term.toLowerCase().trim();
  return inscriptions.filter(ins => 
    (ins.student.firstName.toLowerCase() + ' ' + ins.student.lastName.toLowerCase()).includes(lowerTerm) ||
    ins.student.email.toLowerCase().includes(lowerTerm)
  );
}
  
  disciplines: DisciplineSummaryDTO[] = [];

  disciplineInscriptions: { 
  [disciplineId: string]: {
    inscriptions: ExpandedStudentInscriptionDTO[];
    expanded: boolean;
    loading: boolean;
    page: number;
    searchTerm: string;
    filters: {
          isDebtor: boolean[],
          genres: string[],
          roles: string[],
          categories: any[]
        };
  }
} = {};
  
  // Configuración paginación
  itemsPerPage = 5;

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
        //console.log("disciplines en report: ", this.disciplines);
        this.initializeDisciplineData();
        this.isLoaded = true;
      },
      error: (error) => console.error('Error al obtener usuario:', error)
    });
  }

initializeDisciplineData(): void {
    let startexpanded: boolean = this.disciplines.length <= 2;

    this.disciplines.forEach(discipline => {
      this.disciplineInscriptions[discipline.id] = {
        inscriptions: [],
        expanded: startexpanded,
        loading: false,
        page: 1,
        searchTerm: '',
        // Nuevas propiedades de filtro
        filters: {
          isDebtor: [],
          genres: [],
          roles: [],
          categories: []
        }
      };
    });

    this.disciplines.forEach(discipline => {
      this.loadInscriptionsForDiscipline(discipline.id);
    });

}

    updateDebtorFilter(disciplineId: string, value: boolean, isChecked: boolean): void {
    const filterArray = this.disciplineInscriptions[disciplineId].filters.isDebtor;
    const index = filterArray.indexOf(value);
    
    if (isChecked && index === -1) {
      filterArray.push(value);
    } else if (!isChecked && index !== -1) {
      filterArray.splice(index, 1);
    }
  }

  updateGenreFilter(disciplineId: string, value: string, isChecked: boolean): void {
    const filterArray = this.disciplineInscriptions[disciplineId].filters.genres;
    const index = filterArray.indexOf(value);
    
    if (isChecked && index === -1) {
      filterArray.push(value);
    } else if (!isChecked && index !== -1) {
      filterArray.splice(index, 1);
    }
  }

  updateRoleFilter(disciplineId: string, value: string, isChecked: boolean): void {
    const filterArray = this.disciplineInscriptions[disciplineId].filters.roles;
    const index = filterArray.indexOf(value);
    
    if (isChecked && index === -1) {
      filterArray.push(value);
    } else if (!isChecked && index !== -1) {
      filterArray.splice(index, 1);
    }
  }

   // Nuevo método para actualizar filtro de categorías
  updateCategoryFilter(disciplineId: string, categoryId: string, isChecked: boolean): void {
    const filterArray = this.disciplineInscriptions[disciplineId].filters.categories;
    const index = filterArray.indexOf(categoryId);
    
    if (isChecked && index === -1) {
      filterArray.push(categoryId);
    } else if (!isChecked && index !== -1) {
      filterArray.splice(index, 1);
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

      //console.log("loadInscriptionsForDiscipline: ", inscriptions);

      disciplineData.inscriptions = inscriptions;

       // Calcular categorías únicas para esta disciplina
      const categoryMap = new Map<string, CategorySummaryDTO>();
      inscriptions.forEach(ins => {
        if (!categoryMap.has(ins.category.id)) {
          categoryMap.set(ins.category.id, ins.category);
        }
      });
      //console.log("categoryMap.values(): ", categoryMap.values())
      this.uniqueCategories[disciplineId] = Array.from(categoryMap.values());

      disciplineData.loading = false;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
