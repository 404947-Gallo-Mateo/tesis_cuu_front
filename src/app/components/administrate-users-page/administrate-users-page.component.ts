import { Component, computed, inject, signal } from '@angular/core';
import Swal from 'sweetalert2';
import { ExpandedUserDTO } from '../../models/backend/ExpandedUserDTO';
import { BackUserService } from '../../services/backend-helpers/user/back-user.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { AgePipe } from '../../CustomPipes/age.pipe';
import { GenrePipe } from '../../CustomPipes/genre.pipe';
import { RolePipe } from '../../CustomPipes/role.pipe';
import { UserDTOFormComponent } from '../forms/user-dto-form/user-dto-form.component';
import { firstValueFrom } from 'rxjs';
import { AdminUserDtoFormComponent } from "../forms/admin-user-dto-form/admin-user-dto-form.component";
import { Role } from '../../models/backend/embeddables/Role';
import { RouterLink, RouterLinkActive } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-administrate-users-page',
  imports: [CommonModule, NgxPaginationModule, AgePipe, GenrePipe, RolePipe, AdminUserDtoFormComponent, RouterLink, RouterLinkActive],
  templateUrl: './administrate-users-page.component.html',
  styleUrl: './administrate-users-page.component.css'
})
export class AdministrateUsersPageComponent {

private userService = inject(BackUserService);

  Math = Math;
  rolePipe = inject(RolePipe);

  // Señales reactivas
  users = signal<ExpandedUserDTO[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  searchTerm = signal('');
  //
   userSelected: ExpandedUserDTO | null = null;
  showModal = signal(false);

  async openUserFormModal(user: ExpandedUserDTO) {
    this.userSelected = user;
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.userSelected = null;
  }

  onUserUpdated(updated: boolean) {
    if (updated) {
      this.closeModal();
      this.loadUsers(); 
    }
  }

  currentPage = signal(1);
  itemsPerPage = signal(10);

  // Usuarios filtrados
  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.users().filter(user => 
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      this.rolePipe.transform(user.role.toString()).toLowerCase().includes(term)
    );
  });

  // Total de items filtrados
  totalItems = computed(() => this.filteredUsers().length);

  ngOnInit(): void {
    this.loadUsers();
  }

 loadUsers(): void {
  this.loading.set(true);
  this.error.set(null);

  this.userService.getAllUsers().subscribe({
    next: (users) => {

      console.log("loadUsers(): ", users);

      const filteredUsers = users.filter(user => {
        if (user.role === Role.SUPER_ADMIN_CUU) {
          return false;
        }
        
        return true;
      });
      
      this.users.set(filteredUsers);
      this.loading.set(false);
    },
    error: (err) => {
      this.error.set('Error al cargar los usuarios');
      this.loading.set(false);
      //console.error(err);
    }
  });
}

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
    this.currentPage.set(1);
  }


  deleteUser(userkeycloakId: string): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteKeycloakUser(userkeycloakId).subscribe({
          next: () => {
            this.loadUsers(); 
            Swal.fire(
              '¡Eliminado!',
              'El usuario ha sido eliminado.',
              'success'
            );
          },
          error: (err) => {
            Swal.fire(
              'Error',
              'No se pudo eliminar el usuario',
              'error'
            );
            //console.error(err);
          }
        });
      }
    });
  }
}
