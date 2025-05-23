import { Component, inject, OnInit } from '@angular/core';
import { KeycloakHelperService } from '../../services/backend-helpers/keycloak/keycloak-helper.service';
import { BackUserService } from '../../services/backend-helpers/user/back-user.service';
import { ExpandedUserDTO } from '../../models/backend/ExpandedUserDTO';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent implements OnInit{
  constructor() {}

  private keycloakHelper = inject(KeycloakHelperService);
  private userService = inject(BackUserService);

  isLoaded = false; // indica si se cargo el estado del login

  currentUser!: ExpandedUserDTO;

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

  getUserName() {
    return this.currentUser.firstName;
  }

  isLoggedIn() {
    return this.keycloakHelper.isLoggedIn();  
  }
}
