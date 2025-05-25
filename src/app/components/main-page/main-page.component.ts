import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UserDTOFormComponent } from '../forms/user-dto-form/user-dto-form.component';
import { CategoryDtoFormComponent } from '../forms/category-dto-form/category-dto-form.component';
import { BackUserService } from '../../services/backend-helpers/user/back-user.service';
import { KeycloakHelperService } from '../../services/backend-helpers/keycloak/keycloak-helper.service';
import { ExpandedUserDTO } from '../../models/backend/ExpandedUserDTO';
import { CategoryDTO } from '../../models/backend/CategoryDTO';
import { filter, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { DisciplineDto } from '../../models/backend/DisciplineDTO';
import { BackDisciplineService } from '../../services/backend-helpers/discipline/back-discipline.service';
import { InscriptionToCategoryComponent } from "../forms/inscription-to-category/inscription-to-category.component";

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, InscriptionToCategoryComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {
    
    expandedDisciplines: { [key: string]: boolean } = {};

    toggleDiscipline(disciplineId: string): void {
      this.expandedDisciplines[disciplineId] = !this.expandedDisciplines[disciplineId];
    }
    isExpanded(disciplineId: string): boolean {
      return this.expandedDisciplines[disciplineId];
    }

    currentUser!: ExpandedUserDTO;
    selectedCategory?: CategoryDTO;
    allDisciplines: DisciplineDto[] = [];

    isLoaded = false;
    showModal: boolean = false;
    
    private disciplineService = inject(BackDisciplineService);
    private userService = inject(BackUserService);
    private keycloakHelper = inject(KeycloakHelperService);
    private destroy$ = new Subject<void>();
  
    constructor() {}
  
    ngOnInit(): void {
      
      this.loadDisciplines();
      
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
          //console.log("Usuario actualizado en main-page-component:", user);
          this.currentUser = user;
        },
        error: (error) => {
          console.error('Error al obtener usuario:', error);
        }
      });
    }

    private loadDisciplines(): void {
      this.disciplineService.getAll().pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (disciplines) => {
          this.allDisciplines = disciplines;
          console.log('Disciplinas cargadas:', this.allDisciplines);
        },
        error: (error) => {
          console.error('Error al cargar disciplinas:', error);
        }
      });
    }
  
    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }
  
    openModal(category: CategoryDTO): void {
      this.selectedCategory = category;
      this.showModal = true;
    }
  
    closeModal(): void {
      this.showModal = false;
      this.selectedCategory = undefined;
    }
  
}
