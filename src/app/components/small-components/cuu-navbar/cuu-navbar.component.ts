import { Component, OnInit, ViewChild } from '@angular/core';
import { KeycloakHelperService } from '../../../services/backend-helpers/keycloak/keycloak-helper.service';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { UserDTOFormComponent } from "../../forms/user-dto-form/user-dto-form.component";
import { ExpandedUserDTO } from '../../../models/backend/ExpandedUserDTO';
import { BackUserService } from '../../../services/backend-helpers/user/back-user.service';

declare var bootstrap: any;

@Component({
  selector: 'app-cuu-navbar',
  standalone: true,
  imports: [CommonModule, UserDTOFormComponent],
  templateUrl: './cuu-navbar.component.html',
  styleUrl: './cuu-navbar.component.css'
})
export class CuuNavbarComponent implements OnInit{

  isLoaded = false; // indica si se cargo el estado del login
  
  private userService = inject(BackUserService);
  private keycloakHelper = inject(KeycloakHelperService);
  
  constructor() {}

  currentUser!: ExpandedUserDTO;

  openUserFormModal() {
    const modalElement = document.getElementById('userFormModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  //async ngOnInit()Promise<void> {
  async ngOnInit() {
    await this.keycloakHelper.init();
    this.isLoaded = true; // marcamos que se cargo el estado de login

    // if (this.keycloakHelper.isLoggedIn()) {
    //    console.log('Token:', this.keycloakHelper.getToken());
    //    console.log('Navbar component username:', this.keycloakHelper.getUsername());
    //    console.log('Roles:', this.keycloakHelper.getRoles());
    // }

    const waitForKeycloak = async () => {
        while (!this.keycloakHelper.isReady()) {
          await new Promise(resolve => setTimeout(resolve, 100)); // esperar 100ms
        }
      };
    
      await waitForKeycloak();
    
      // ahora sí el token está disponible
      this.currentUser = await this.userService.getCurrentUser();
      console.log("Expanded Current User: ", this.currentUser);
  }

  login() {
    this.keycloakHelper.login();
  }

  logout() {
    this.keycloakHelper.logout();  
  }

  getUsername() {
    return this.keycloakHelper.getUsername();  
  }

  isLoggedIn() {
    //console.log("esta logueado?", this.keycloakHelper.isLoggedIn())
    return this.keycloakHelper.isLoggedIn();  
  }

}
