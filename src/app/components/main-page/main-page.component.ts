import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UserDTOFormComponent } from '../forms/user-dto-form/user-dto-form.component';
import { CategoryDtoFormComponent } from '../forms/category-dto-form/category-dto-form.component';
import { BackUserService } from '../../services/backend-helpers/user/back-user.service';
import { KeycloakHelperService } from '../../services/backend-helpers/keycloak/keycloak-helper.service';
import { ExpandedUserDTO } from '../../models/backend/ExpandedUserDTO';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {

  constructor() {}
    
  private userService = inject(BackUserService);
  private keycloakHelper = inject(KeycloakHelperService);

    currentUser!: ExpandedUserDTO;
  
}
