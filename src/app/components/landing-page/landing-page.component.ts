import { Component } from '@angular/core';
import { KeycloakHelperService } from '../../services/keycloak-helper.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  constructor(private keycloakHelper: KeycloakHelperService) {}

  getUsername() {
    return this.keycloakHelper.getUsername();  
  }

  isLoggedIn() {
    return this.keycloakHelper.isLoggedIn();  
  }
}
