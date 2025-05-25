import { Component, ElementRef, inject, Input, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Role } from '../../../models/backend/embeddables/Role';
import { Genre } from '../../../models/backend/embeddables/Genre';
import { DisciplineSummaryDTO } from '../../../models/backend/DisciplineSummaryDTO';
import { CommonModule, formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BackUserService } from '../../../services/backend-helpers/user/back-user.service';
import Swal from 'sweetalert2';
import { ExpandedUserDTO } from '../../../models/backend/ExpandedUserDTO';
import { KeycloakHelperService } from '../../../services/backend-helpers/keycloak/keycloak-helper.service';
import { UserGenre } from '../../../models/backend/embeddables/UserGenre';

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
  @Input() currentRole!: string | null;

  roles = Object.values(Role);
  genres = [
    { value: UserGenre.MALE, label: 'Masculino' },
    { value: UserGenre.FEMALE, label: 'Femenino' }
  ];
  
  private subscriptions = new Subscription();
  private readonly router = inject(Router)
  private readonly activatedRouter = inject(ActivatedRoute)
  private backUserService = inject(BackUserService);
  private keycloakHelper = inject(KeycloakHelperService);

ngOnChanges(changes: SimpleChanges): void {
  if (changes['userData'] && this.userData) {
    const birthDateParsed = this.parseDateString(this.userData.birthDate);
    console.log("birthDateParsed con fecha en yyyy-MM-dd: ", birthDateParsed);

    this.userData.birthDate = birthDateParsed;

    this.form.patchValue({
      ...this.userData,
    });
  }
}

private parseDateString(dateStr: string): string {
  let [day, month, year] = dateStr.split('-').map(Number);

  let stringDay = "day";
  let stringMonth = "month";

  if(day < 10){
    stringDay = "0" + day;
  }
  else {
    stringDay = day.toString();
  }

  month = month - 1;
  if(month < 10){
    stringMonth = "0" + month;
  }
  else {
    stringMonth = month.toString();
  }

  console.log("[day, month, year]= ", [day, month, year]);
  return year+"-"+ stringMonth + "-" + stringDay;
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

submitUpdatedKeycloakUser(): void {
  if (this.form.valid) {
    const form = this.form.value;

    console.log("asi sale del form el birthDate: ", form.birthDate);

    const expandedUserDTO: ExpandedUserDTO = {
      keycloakId: form.keycloakId,
      role: form.role,
      username: form.username,
      email: form.email,
      firstName: form.firstName,
      lastName: form.lastName,
      birthDate: formatDate(form.birthDate, 'dd-MM-yyyy', 'en-US').toString(),
      genre: form.genre,
      teacherDisciplines: (form.teacherDisciplines || []).map((d: any) => ({
        id: d.id,
        name: d.name
      })),
      studentCategories: (form.studentCategories || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        disciplineId: c.disciplineId
      }))
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
          },
          error: (err) => {
            console.error('Error actualizando usuario:', err);
            Swal.fire('Error', 'Hubo un problema al actualizar el usuario.', 'error');
          }
        });
      }
    });
  }
}


deleteKeycloakUser(): void {
  const userDTO = this.form.value;
  const userKeycloakId = userDTO.keycloakId;

  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el Usuario permanentemente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.isConfirmed) {
      this.backUserService.deleteKeycloakUser(userKeycloakId).subscribe({
        next: (resp: boolean) => {
          console.log("resp deleteKeycloakUser(): ", resp);

          if (resp) {
            Swal.fire('Eliminado', 'El usuario fue eliminado correctamente.', 'success');
            this.keycloakHelper.logout();
          } else {
            Swal.fire('Error', 'Hubo un problema en la Base de Datos al eliminar el usuario.', 'error');
          }
        },
        error: (err) => {
          console.error('Error eliminando usuario:', err);
          Swal.fire('Error', 'Hubo un problema en Keycloak al eliminar el usuario.', 'error');
        }
      });
    }
  });
}

}
