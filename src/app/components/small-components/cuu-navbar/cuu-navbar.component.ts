import { Component, OnInit } from '@angular/core';
import { KeycloakHelperService } from '../../../services/keycloak-helper.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cuu-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cuu-navbar.component.html',
  styleUrl: './cuu-navbar.component.css'
})
export class CuuNavbarComponent implements OnInit{

  isLoaded = false; // indica si se cargo el estado del login

  constructor(private keycloakHelper: KeycloakHelperService) {}

  async ngOnInit() {
    await this.keycloakHelper.init();
    this.isLoaded = true; // marcamos que se cargo el estado de login

    if (this.keycloakHelper.isLoggedIn()) {
      // console.log('Token:', this.keycloakHelper.getToken());
       //console.log('Navbar component username:', this.keycloakHelper.getUsername());
      // console.log('Roles:', this.keycloakHelper.getRoles());
    }
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
