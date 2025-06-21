import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { AgePipe } from '../../../CustomPipes/age.pipe';
import { GenrePipe } from '../../../CustomPipes/genre.pipe';
import { RolePipe } from '../../../CustomPipes/role.pipe';
import { BackUserService } from '../../../services/backend-helpers/user/back-user.service';
import { ExpandedUserDTO } from '../../../models/backend/ExpandedUserDTO';
import { Role } from '../../../models/backend/embeddables/Role';
import { UserGenre } from '../../../models/backend/embeddables/UserGenre';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users-report',
  imports: [CommonModule, NgxPaginationModule, AgePipe, GenrePipe, RolePipe, FormsModule],
  templateUrl: './users-report.component.html',
  styleUrl: './users-report.component.css'
})
export class UsersReportComponent {
private userService = inject(BackUserService);

  Math = Math;
  rolePipe = inject(RolePipe);

  // Filtros
  selectedRoles = signal<string[]>([]);
  selectedGenres = signal<string[]>([]);
  emailFilter = signal('');
  nameFilter = signal('');
  minAge = signal<number | null>(null);
  maxAge = signal<number | null>(null);

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

  // Señales reactivas
  users = signal<ExpandedUserDTO[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  currentPage = signal(1);
  itemsPerPage = signal(10);

  // Función para calcular la edad
  calculateAge(birthDate: string): number {
    if (!birthDate) return 0;
    const [day, month, year] = birthDate.split('-').map(Number);
    const birthDateObj = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    return age;
  }

  // Usuarios filtrados
  filteredUsers = computed(() => {
    return this.users().filter(user => {
      // Filtro por roles
      if (this.selectedRoles().length > 0 && !this.selectedRoles().includes(user.role)) {
        return false;
      }
      
      // Filtro por email
      if (this.emailFilter() && !user.email.toLowerCase().includes(this.emailFilter().toLowerCase())) {
        return false;
      }
      
      // Filtro por nombre completo
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      if (this.nameFilter() && !fullName.includes(this.nameFilter().toLowerCase())) {
        return false;
      }
      
      // Filtro por edad
      const age = this.calculateAge(user.birthDate);
      if (this.minAge() !== null && age < this.minAge()!) {
        return false;
      }
      if (this.maxAge() !== null && age > this.maxAge()!) {
        return false;
      }
      
      // Filtro por género
      if (this.selectedGenres().length > 0 && !this.selectedGenres().includes(user.genre)) {
        return false;
      }
      
      return true;
    });
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
        this.users.set(users);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar los usuarios');
        this.loading.set(false);
        //console.error(err);
      }
    });
  }

  // Métodos para manejar selección de filtros
  toggleRole(role: string): void {
    this.selectedRoles.update(roles => {
      if (roles.includes(role)) {
        return roles.filter(r => r !== role);
      } else {
        return [...roles, role];
      }
    });
  }

  toggleGenre(genre: string): void {
    this.selectedGenres.update(genres => {
      if (genres.includes(genre)) {
        return genres.filter(g => g !== genre);
      } else {
        return [...genres, genre];
      }
    });
  }
}
