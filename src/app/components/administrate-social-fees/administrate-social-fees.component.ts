import { Component, inject } from '@angular/core';
import { ExpandedUserDTO } from '../../models/backend/ExpandedUserDTO';
import { BackUserService } from '../../services/backend-helpers/user/back-user.service';
import { KeycloakHelperService } from '../../services/backend-helpers/keycloak/keycloak-helper.service';
import { BackStudentInscriptionService } from '../../services/backend-helpers/student-inscription/back-student-inscription.service';
import { filter, Subject, switchMap, takeUntil } from 'rxjs';
import { FeeService } from '../../services/backend-helpers/fee/fee.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { UserWithFeesDTO } from '../../models/backend/UserWithFeesDTO';
import { FeeDTO } from '../../models/backend/FeeDTO';
import { FeeType } from '../../models/backend/embeddables/FeeType';
import { ModalSocialFeesComponent } from '../forms/modal-social-fees/modal-social-fees.component';
import { RolePipe } from '../../CustomPipes/role.pipe';
import { AgePipe } from '../../CustomPipes/age.pipe';
import { Genre } from '../../models/backend/embeddables/Genre';
import { GenrePipe } from '../../CustomPipes/genre.pipe';

@Component({
  selector: 'app-administrate-social-fees',
  imports: [CommonModule, NgxPaginationModule, FormsModule, ModalSocialFeesComponent, RolePipe, AgePipe, GenrePipe],
  templateUrl: './administrate-social-fees.component.html',
  styleUrl: './administrate-social-fees.component.css'
})
export class AdministrateSocialFeesComponent {
   currentUser!: ExpandedUserDTO;
  isLoaded = false;
  debtorMode = false;
  
  // Lista de usuarios
  allUsers: UserWithFeesDTO[] = [];
  filteredUsers: UserWithFeesDTO[] = [];
  
  // Paginación
  page = 1;
  itemsPerPage = 5;
  
  // Modal
  showModal = false;
  selectedUser: UserWithFeesDTO | null = null;
  
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
        this.allUsers = users;
        this.updateFilteredUsers();
      },
      error: (error) => console.error('Error al cargar usuarios:', error)
    });
  }

  toggleView(): void {
    this.debtorMode = !this.debtorMode;
    this.page = 1; // Resetear a la primera página
    this.updateFilteredUsers();
  }

// Agregar esta propiedad a la clase
searchTerm = '';

// Modificar el método updateFilteredUsers para incluir el filtro de búsqueda
updateFilteredUsers(): void {
  // Primero filtramos por modo deudor
  let filtered = this.debtorMode 
    ? this.allUsers.filter(user => user.isDebtor) 
    : [...this.allUsers];

  // Luego aplicamos el filtro de búsqueda si hay término
  if (this.searchTerm) {
    const term = this.searchTerm.toLowerCase();
    filtered = filtered.filter(user => 
      (user.firstName + ' ' + user.lastName).toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  }

  this.filteredUsers = filtered;
}

// Agregar este método para aplicar el filtro al escribir
applyFilter(): void {
  this.page = 1; // Resetear a la primera página
  this.updateFilteredUsers();
}

  openSocialFeesModal(user: UserWithFeesDTO): void {
    this.selectedUser = user;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  handleFeeUpdated(updatedFee: FeeDTO): void {
    if (!this.selectedUser) return;
    
    // Actualizar la cuota en el usuario seleccionado
    const feeIndex = this.selectedUser.userFees.findIndex(f => 
      f.feeType === updatedFee.feeType && 
      f.period === updatedFee.period
    );
    
    if (feeIndex !== -1) {
      this.selectedUser.userFees[feeIndex] = updatedFee;
      
      // Recalcular si el usuario es deudor
      this.selectedUser.isDebtor = this.selectedUser.userFees.some(
        fee => fee.feeType === FeeType.SOCIAL && !fee.paid
      );
    }
    
    // Actualizar en la lista principal
    const userIndex = this.allUsers.findIndex(u => u.keycloakId === this.selectedUser?.keycloakId);
    if (userIndex !== -1) {
      this.allUsers[userIndex] = {...this.selectedUser};
      this.updateFilteredUsers();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


}
