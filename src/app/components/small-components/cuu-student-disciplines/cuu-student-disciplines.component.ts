import { Component } from '@angular/core';
import { ExpandedUserDTO } from '../../../models/backend/ExpandedUserDTO';
import { BackUserService } from '../../../services/backend-helpers/user/back-user.service';
import { KeycloakHelperService } from '../../../services/backend-helpers/keycloak/keycloak-helper.service';
import { inject } from '@angular/core';
import { CategoryDtoFormComponent } from '../../forms/category-dto-form/category-dto-form.component';
import { CategoryDTO } from '../../../models/backend/CategoryDTO';
import { filter, of, switchMap, take, tap, timer } from 'rxjs';

@Component({
  selector: 'app-cuu-student-disciplines',
  standalone: true,
  imports: [CategoryDtoFormComponent],
  templateUrl: './cuu-student-disciplines.component.html',
  styleUrl: './cuu-student-disciplines.component.css'
})
export class CuuStudentDisciplinesComponent {

  currentUser!: ExpandedUserDTO;
  selectedCategory?: CategoryDTO;
  isLoaded = false; // indica si se cargo el estado del login

  private userService = inject(BackUserService);
  private keycloakHelper = inject(KeycloakHelperService);

  constructor() {}

ngOnInit(): void {
  this.keycloakHelper.isReady$.pipe(
    filter(isReady => isReady), // solo continúa si está listo
    tap(() => this.isLoaded = true),
    switchMap(() => this.userService.getCurrentUser()),
    tap(user => {
      this.currentUser = user;
      //console.log("Expanded Current User: ", this.currentUser);
    })
  ).subscribe();
}

  showModal: boolean = false;

  openModal(category: CategoryDTO): void {
    this.selectedCategory = category;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedCategory = undefined;
  }
}
