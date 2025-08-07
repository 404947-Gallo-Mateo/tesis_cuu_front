import { Component, inject } from '@angular/core';
import { ExpandedUserDTO } from '../../../models/backend/ExpandedUserDTO';
import { UserWithFeesDTO } from '../../../models/backend/UserWithFeesDTO';
import { BackUserService } from '../../../services/backend-helpers/user/back-user.service';
import { KeycloakHelperService } from '../../../services/backend-helpers/keycloak/keycloak-helper.service';
import { FeeService } from '../../../services/backend-helpers/fee/fee.service';
import { filter, Subject, switchMap, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { RolePipe } from '../../../CustomPipes/role.pipe';
import { AgePipe } from '../../../CustomPipes/age.pipe';
import { GenrePipe } from '../../../CustomPipes/genre.pipe';
import { Role } from '../../../models/backend/embeddables/Role';
import { UserGenre } from '../../../models/backend/embeddables/UserGenre';
import { SocialFeesDashboardComponent } from '../kpis/social-fees-dashboard/social-fees-dashboard.component';

@Component({
  selector: 'app-social-fees-report',
  imports: [SocialFeesDashboardComponent ,CommonModule, NgxPaginationModule, FormsModule, RolePipe, AgePipe, GenrePipe],
  templateUrl: './social-fees-report.component.html',
  styleUrl: './social-fees-report.component.css'
})
export class SocialFeesReportComponent {
   currentUser!: ExpandedUserDTO;
  isLoaded = false;
  
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
  
  // Lista de usuarios
  allUsers: UserWithFeesDTO[] = [];
  filteredUsers: UserWithFeesDTO[] = [];
  
  // Paginación
  page = 1;
  itemsPerPage = 5;
  
  // Filtros
  searchTerm = '';
  filters = {
    isDebtor: [] as boolean[],
    genres: [] as string[],
    roles: [] as string[]
  };
  
  private userService = inject(BackUserService);
  private keycloakHelper = inject(KeycloakHelperService);
  private feeService = inject(FeeService);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {    
    this.loadCurrentUser();
    this.loadUsers();
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
        this.isLoaded = true;
      },
      error: (error) => console.error('Error al obtener usuario:', error)
    });
  }

  loadUsers(): void {
    this.userService.getAllUsersWithSocialFees().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (users) => {
        //console.log("users", users);
        this.allUsers = users;
        this.updateFilteredUsers();
      },
      error: (error) => console.error('Error al cargar usuarios:', error)
    });
  }

  updateFilteredUsers(): void {
    let filtered = [...this.allUsers];
    
    // Filtro por estado deudor
    if (this.filters.isDebtor.length > 0) {
      filtered = filtered.filter(user => 
        this.filters.isDebtor.includes(user.isDebtor)
      );
    }
    
    // Filtro por género
    if (this.filters.genres.length > 0) {
      filtered = filtered.filter(user => 
        this.filters.genres.includes(user.genre)
      );
    }
    
    // Filtro por rol
    if (this.filters.roles.length > 0) {
      filtered = filtered.filter(user => 
        this.filters.roles.includes(user.role)
      );
    }
    
    // Filtro de búsqueda
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        (user.firstName + ' ' + user.lastName).toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      );
    }

    this.filteredUsers = filtered;
  }

  applyFilter(): void {
    this.page = 1;
    this.updateFilteredUsers();
  }
  
  // Métodos para actualizar los filtros
  updateDebtorFilter(value: boolean, isChecked: boolean): void {
    const index = this.filters.isDebtor.indexOf(value);
    
    if (isChecked && index === -1) {
      this.filters.isDebtor.push(value);
    } else if (!isChecked && index !== -1) {
      this.filters.isDebtor.splice(index, 1);
    }

    console.log("updateDebtorFilter filters debtor: ", this.filters.isDebtor);
    
    this.applyFilter();
  }

  updateGenreFilter(value: string, isChecked: boolean): void {
    const index = this.filters.genres.indexOf(value);
    
    if (isChecked && index === -1) {
      this.filters.genres.push(value);
    } else if (!isChecked && index !== -1) {
      this.filters.genres.splice(index, 1);
    }
    
    this.applyFilter();
  }

  updateRoleFilter(value: string, isChecked: boolean): void {
    const index = this.filters.roles.indexOf(value);
    
    if (isChecked && index === -1) {
      this.filters.roles.push(value);
    } else if (!isChecked && index !== -1) {
      this.filters.roles.splice(index, 1);
    }
    
    this.applyFilter();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
