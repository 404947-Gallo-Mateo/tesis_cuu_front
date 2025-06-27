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

  // Nuevo método para obtener el próximo horario
  getNextSchedule(category: CategoryDTO): string {
    if (!category.schedules || category.schedules.length === 0) {
      return 'Sin horarios programados';
    }

    const today = new Date();
    const currentDay = today.getDay(); // 0 (domingo) - 6 (sábado)
    const dayMap: { [key: string]: number } = {
      'SUNDAY': 0, 
      'MONDAY': 1,
      'TUESDAY': 2,
      'WEDNESDAY': 3,
      'THURSDAY': 4,
      'FRIDAY': 5,
      'SATURDAY': 6
    };

    // Encontrar el próximo horario
    const upcomingSchedules = category.schedules
      .map(schedule => ({
        ...schedule,
        dayNumber: dayMap[schedule.dayOfWeek],
        startTime: schedule.startHour.substring(0, 5)
      }))
      .filter(schedule => {
        // Si el día es hoy o en el futuro
        return schedule.dayNumber > currentDay || 
               (schedule.dayNumber === currentDay && 
                schedule.startHour > today.toTimeString().substring(0, 5));
      })
      .sort((a, b) => {
        // Ordenar por proximidad
        if (a.dayNumber !== b.dayNumber) return a.dayNumber - b.dayNumber;
        return a.startHour.localeCompare(b.startHour);
      });

    if (upcomingSchedules.length === 0) {
      // Si no hay horarios futuros esta semana, tomar el primero de la próxima semana
      const firstSchedule = category.schedules
        .map(s => ({...s, dayNumber: dayMap[s.dayOfWeek]}))
        .sort((a, b) => a.dayNumber - b.dayNumber)[0];
        
      return `${this.translateDay(firstSchedule.dayOfWeek)} ${firstSchedule.startHour.substring(0, 5)}`;
    }

    const next = upcomingSchedules[0];
    return `${this.translateDay(next.dayOfWeek)} ${next.startTime}`;
  }

  // Traducir días al español
  translateDay(dayOfWeek: string): string {
    const days: {[key: string]: string} = {
      'MONDAY': 'Lunes',
      'TUESDAY': 'Martes',
      'WEDNESDAY': 'Miércoles',
      'THURSDAY': 'Jueves',
      'FRIDAY': 'Viernes',
      'SATURDAY': 'Sábado',
      'SUNDAY': 'Domingo'
    };
    return days[dayOfWeek] || dayOfWeek;
  }
}