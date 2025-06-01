import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import Swal from 'sweetalert2';
import { ExpandedUserDTO } from '../../../models/backend/ExpandedUserDTO';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BackUserService } from '../../../services/backend-helpers/user/back-user.service';
import { KeycloakHelperService } from '../../../services/backend-helpers/keycloak/keycloak-helper.service';
import { UserGenre } from '../../../models/backend/embeddables/UserGenre';
import { Role } from '../../../models/backend/embeddables/Role';
import { CommonModule, formatDate } from '@angular/common';

@Component({
  selector: 'app-admin-user-dto-form',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-user-dto-form.component.html',
  styleUrl: './admin-user-dto-form.component.css'
})
export class AdminUserDtoFormComponent {
  
  @Input() userData: ExpandedUserDTO | null = null;
  @Output() modalClosed = new EventEmitter<boolean>();

  form: FormGroup;
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

  constructor(
    private fb: FormBuilder,
    private backUserService: BackUserService
  ) {
    this.form = this.fb.group({
      keycloakId: [''],
      role: [null, Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: [null],
      genre: [null],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userData'] && this.userData) {
      const birthDateParsed = this.parseDateString(this.userData.birthDate);
      this.form.patchValue({
        ...this.userData,
        birthDate: birthDateParsed
      });
    }
  }

  private parseDateString(dateStr: string): string {
    if (!dateStr) return '';
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day).toISOString().split('T')[0];
  }

  submitUpdatedKeycloakUser(): void {
    if (this.form.valid) {
      const form = this.form.value;
      const expandedUserDTO: ExpandedUserDTO = {
        ...form,
        birthDate: formatDate(form.birthDate, 'dd-MM-yyyy', 'en-US').toString(),
        teacherDisciplines: [],
        studentCategories: []
      };

      Swal.fire({
        title: '¿Confirmar actualización?',
        text: 'Se actualizarán los datos de usuario.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#aaa',
        confirmButtonText: 'Sí, actualizar',
        cancelButtonText: 'Cancelar'
      }).then(result => {
        if (result.isConfirmed) {
          this.backUserService.updateInfoOfKeycloakUser(
            expandedUserDTO.keycloakId,
            expandedUserDTO
          ).subscribe({
            next: (resp) => {
              this.backUserService.setCurrentUser(resp);
              Swal.fire('Actualizado', 'El usuario fue actualizado correctamente.', 'success');
              this.modalClosed.emit(true);
            },
            error: (err) => {
              console.error('Error actualizando usuario:', err);
              Swal.fire('Error', 'Hubo un problema al actualizar el usuario.', 'error');
              this.modalClosed.emit(false);
            }
          });
        }
      });
    }
  }

  closeModal() {
    this.modalClosed.emit(false);
  }
}
