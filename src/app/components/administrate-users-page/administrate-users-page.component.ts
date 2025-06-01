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

declare var bootstrap: any;

@Component({
  selector: 'app-administrate-users-page',
  imports: [CommonModule, UserDTOFormComponent, NgxPaginationModule, AgePipe, GenrePipe, RolePipe],
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

  // Paginación
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

  //
  currentRole: string | null = null; // Variable para almacenar el valor
  userSelected!: ExpandedUserDTO;

  async openUserFormModal(user: ExpandedUserDTO) {
    try {
      this.userSelected = user;
      // Obtener el valor actual del rol
      this.currentRole = await firstValueFrom(this.userService.currentRole$);
      // Abrir el modal
      const modalElement = document.getElementById('userFormModal');
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
    } catch (error) {
      console.error('Error al obtener el rol:', error);
    }
  }
  //
  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.error.set(null);

    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar los usuarios');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
    this.currentPage.set(1);
  }

  editUser(userId: ExpandedUserDTO): void {
    // Lógica para editar usuario
    console.log('Editar usuario:', userId);
    // Aquí podrías abrir un modal o navegar a una ruta de edición
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
        // Lógica para eliminar usuario
        this.userService.deleteKeycloakUser(userkeycloakId).subscribe({
          next: () => {
            this.loadUsers(); // Recargar lista
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
            console.error(err);
          }
        });
      }
    });
  }
}
