import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { AgePipe } from '../../../CustomPipes/age.pipe';
import { GenrePipe } from '../../../CustomPipes/genre.pipe';
import { ExpandedUserDTO } from '../../../models/backend/ExpandedUserDTO';
import { CategorySummaryDTO } from '../../../models/backend/CategorySummaryDTO';
import { Role } from '../../../models/backend/embeddables/Role';
import { UserGenre } from '../../../models/backend/embeddables/UserGenre';
import { ExpandedStudentInscriptionDTO } from '../../../models/backend/ExpandedStudentInscriptionDTO';
import { BackUserService } from '../../../services/backend-helpers/user/back-user.service';
import { KeycloakHelperService } from '../../../services/backend-helpers/keycloak/keycloak-helper.service';
import { BackStudentInscriptionService } from '../../../services/backend-helpers/student-inscription/back-student-inscription.service';
import { catchError, filter, finalize, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { DisciplineSummaryDTO } from '../../../models/backend/DisciplineSummaryDTO';
import { BackDisciplineService } from '../../../services/backend-helpers/discipline/back-discipline.service';
import { DisciplinesDashboardComponent } from '../kpis/disciplines-dashboard/disciplines-dashboard.component';
import { RolePipe } from '../../../CustomPipes/role.pipe';

@Component({
  selector: 'app-disciplines-report',
  imports: [DisciplinesDashboardComponent, CommonModule, NgxPaginationModule, FormsModule, AgePipe, GenrePipe, RolePipe],
  templateUrl: './disciplines-report.component.html',
  styleUrl: './disciplines-report.component.css'
})
export class DisciplinesReportComponent {

  currentUser!: ExpandedUserDTO;
  isLoaded = false;

    uniqueCategories: { [disciplineId: string]: CategorySummaryDTO[] } = {};

    roles = [
      {value: Role.SUPER_ADMIN_CUU, label: "SuperAdmin"},
      {value: Role.ADMIN_CUU, label: "Admin"},
      {value: Role.TEACHER, label: "Profesor"},
      {value: Role.STUDENT, label: "Alumno"}
    ];
    
    genres = [
      { value: UserGenre.MALE, label: 'Masc.' },
      { value: UserGenre.FEMALE, label: 'Fem.' }
    ];

      applyFilters(disciplineId: string): void {
    // Solo dispara la detección de cambios
    this.disciplineInscriptions[disciplineId].inscriptions = [...this.disciplineInscriptions[disciplineId].inscriptions];
  }

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
      
      // Filtros existentes
      if (filters.genres.length > 0 && !filters.genres.includes(ins.student.genre)) {
        return false;
      }
      
      if (filters.roles.length > 0 && !filters.roles.includes(ins.student.role)) {
        return false;
      }

      if (filters.categories.length > 0 && !filters.categories.includes(ins.category.id)) {
        return false;
      }
      
      // Nuevo filtro: Rango de edad
      if (filters.ageRange.min !== null || filters.ageRange.max !== null) {
        const age = this.calculateAge(ins.student.birthDate);
        if (filters.ageRange.min !== null && age < filters.ageRange.min) return false;
        if (filters.ageRange.max !== null && age > filters.ageRange.max) return false;
      }
      
      // Nuevo filtro: Fecha de creación
      if (filters.createdDateRange.min || filters.createdDateRange.max) {
        const createdDate = new Date(ins.createdDate);
        if (filters.createdDateRange.min && 
            new Date(filters.createdDateRange.min) > createdDate) return false;
        if (filters.createdDateRange.max && 
            new Date(filters.createdDateRange.max) < createdDate) return false;
      }
      
      // Nuevo filtro: Fecha de actualización
      if (filters.updatedDateRange.min || filters.updatedDateRange.max) {
        // Solo excluir si no tiene updatedDate cuando hay filtros aplicados
        if (!ins.updatedDate) return false;
        
        const updatedDate = new Date(ins.updatedDate);
        if (filters.updatedDateRange.min && 
            new Date(filters.updatedDateRange.min) > updatedDate) return false;
        if (filters.updatedDateRange.max && 
            new Date(filters.updatedDateRange.max) < updatedDate) return false;
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
        genres: string[],
        roles: string[],
        categories: any[],
        ageRange: { min: number | null, max: number | null },
        createdDateRange: { min: string | null, max: string | null },
        updatedDateRange: { min: string | null, max: string | null }
      };
    }
  } = {};
  
  // Configuración paginación
  itemsPerPage = 5;

  private userService = inject(BackUserService);
  private keycloakHelper = inject(KeycloakHelperService);
  private inscriptionService = inject(BackStudentInscriptionService);
  private disciplineService = inject(BackDisciplineService);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {    
    this.loadCurrentUser();
    this.loadInitialData();
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
      },
      error: (error) => console.error('Error al obtener usuario:', error)
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
          if(user.role !== 'STUDENT' && ( user.role == 'ADMIN_CUU' || user.role == 'SUPER_ADMIN_CUU') ){
            return this.disciplineService.getAllSummary().pipe(
              finalize(() => this.isLoaded = true)
            );
  
          } else {
            return of([]); // Retorna array vacío si no es profesor
          }
        }),
        takeUntil(this.destroy$)
      ).subscribe({
        next: (disciplines) => {
          if(disciplines.length > 0){
            this.disciplines = disciplines;
            this.initializeDisciplineData();
          }        
          //console.log("TODAS las disciplinas:", disciplines);
        },
        error: (error) => {
          //console.error('Error al cargar datos iniciales:', error);
          this.isLoaded = false;
        }
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
        filters: {
          genres: [],
          roles: [],
          categories: [],
          ageRange: { min: null, max: null },
          createdDateRange: { min: null, max: null },
          updatedDateRange: { min: null, max: null }
        }
      };
    });

    this.disciplines.forEach(discipline => {
      this.loadInscriptionsForDiscipline(discipline.id);
    });
  }

  resetUpdatedDateFilter(disciplineId: string): void {
  this.disciplineInscriptions[disciplineId].filters.updatedDateRange = { 
    min: null, 
    max: null 
  };
  this.applyFilters(disciplineId);
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

    // Función para calcular la edad
  private calculateAge(birthDate: string): number {
    const [day, month, year] = birthDate.split('-').map(Number);
    const birth = new Date(year, month - 1, day);
    const today = new Date();
    
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
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
