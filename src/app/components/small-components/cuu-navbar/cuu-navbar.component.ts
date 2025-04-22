import { Component, OnInit } from '@angular/core';
import { KeycloakHelperService } from '../../../services/keycloak-helper.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cuu-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cuu-navbar.component.html',
  styleUrl: './cuu-navbar.component.css'
})
export class CuuNavbarComponent implements OnInit{
  constructor(private keycloakHelper: KeycloakHelperService) {}

  logout() {
    this.keycloakHelper.logout();  
  }

  getUsername() {
    return this.keycloakHelper.getUsername();  
  }

  isLoggedIn() {
    return this.keycloakHelper.isLoggedIn();  
  }


ngOnInit() {
  if (this.keycloakHelper.isLoggedIn()) {
    console.log('Token:', this.keycloakHelper.getToken());
    console.log('Username:', this.keycloakHelper.getUsername());
    console.log('Roles:', this.keycloakHelper.getRoles()); // si implementás este método
  }
}

}
