import { Component, ElementRef, inject, Input, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Role } from '../../../models/backend/embeddables/Role';
import { Genre } from '../../../models/backend/embeddables/Genre';
import { DisciplineSummaryDTO } from '../../../models/backend/DisciplineSummaryDTO';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BackUserService } from '../../../services/backend-helpers/back-user.service';
import Swal from 'sweetalert2';
import { ExpandedUserDTO } from '../../../models/backend/ExpandedUserDTO';

@Component({
  selector: 'app-user-dto-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './user-dto-form.component.html',
  styleUrl: './user-dto-form.component.css'
})
export class UserDTOFormComponent {

  form: FormGroup;
  @Input() userData!: ExpandedUserDTO;

  roles = Object.values(Role);
  genres = Object.values(Genre);

  private subscriptions = new Subscription();
  private readonly router = inject(Router)
  private readonly activatedRouter = inject(ActivatedRoute)
  private backUserService = inject(BackUserService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userData'] && this.userData) {
      this.form.patchValue(this.userData);
    }
  }

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      keycloakId: [''],
      role: [null, Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: [null], // formatea en el submit como 'dd-MM-yyyy' si hace falta
      genre: [null],
    });
  }

  submitUpdatedKeycloakUser() {
    if (this.form.valid) {
      const userDTO = this.form.value;
      console.log('Enviando datos del usuario:', userDTO);
      this.backUserService.updateInfoOfKeycloakUser(userDTO.keycloakId, userDTO);
    }
  }

  async deleteKeycloakUser() {
    const userDTO = this.form.value;

    console.log("borrando user keycloak id: ", userDTO.keycloakId);

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el Usuario permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await this.backUserService.deleteKeycloakUser(userDTO.keycloakId);
        Swal.fire('Eliminado', 'El usuario fue eliminado correctamente.', 'success');
      } catch (err) {
        console.error('Error eliminando usuario:', err);
        Swal.fire('Error', 'Hubo un problema al eliminar el usuario.', 'error');
      }
    }
  }

}
