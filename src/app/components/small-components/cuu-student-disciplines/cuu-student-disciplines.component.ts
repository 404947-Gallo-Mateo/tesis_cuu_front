import { Component, OnInit, OnDestroy } from '@angular/core';
import { ExpandedUserDTO } from '../../../models/backend/ExpandedUserDTO';
import { BackUserService } from '../../../services/backend-helpers/user/back-user.service';
import { KeycloakHelperService } from '../../../services/backend-helpers/keycloak/keycloak-helper.service';
import { inject } from '@angular/core';
import { CategoryDtoFormComponent } from '../../forms/category-dto-form/category-dto-form.component';
import { CategoryDTO } from '../../../models/backend/CategoryDTO';
import { filter, switchMap, tap, takeUntil } from 'rxjs';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cuu-student-disciplines',
  standalone: true,
  imports: [CategoryDtoFormComponent, CommonModule],
  templateUrl: './cuu-student-disciplines.component.html',
  styleUrl: './cuu-student-disciplines.component.css'
})
export class CuuStudentDisciplinesComponent implements OnInit, OnDestroy {
  currentUser!: ExpandedUserDTO;
  selectedCategory?: CategoryDTO;
  isLoaded = false;
  showModal: boolean = false;
  
  private userService = inject(BackUserService);
  private keycloakHelper = inject(KeycloakHelperService);
  private destroy$ = new Subject<void>();

  constructor() {}

  ngOnInit(): void {
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