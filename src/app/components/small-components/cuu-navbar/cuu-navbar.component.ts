import { Component, OnInit, ViewChild } from '@angular/core';
import { KeycloakHelperService } from '../../../services/backend-helpers/keycloak/keycloak-helper.service';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { UserDTOFormComponent } from "../../forms/user-dto-form/user-dto-form.component";
import { ExpandedUserDTO } from '../../../models/backend/ExpandedUserDTO';
import { BackUserService } from '../../../services/backend-helpers/user/back-user.service';
import { filter, of, switchMap, take, tap, timer, combineLatest } from 'rxjs';

declare var bootstrap: any;

@Component({
  selector: 'app-cuu-navbar',
  standalone: true,
  imports: [CommonModule, UserDTOFormComponent],
  templateUrl: './cuu-navbar.component.html',
  styleUrl: './cuu-navbar.component.css'
})
export class CuuNavbarComponent implements OnInit {
  isLoaded = false;
  
  private userService = inject(BackUserService);
  private keycloakHelper = inject(KeycloakHelperService);
  
  currentUser!: ExpandedUserDTO;
  isLoggedIn$ = this.keycloakHelper.isLoggedIn$;

  constructor() {}

  ngOnInit(): void {
    console.log("Inicializando navbar component...");
    
    // IMPORTANTE: Primero inicializar Keycloak
    this.keycloakHelper.init().subscribe({
      next: (authenticated) => {
        console.log('Keycloak inicializado, usuario autenticado:', authenticated);
      },
      error: (error) => {
        console.error('Error al inicializar Keycloak:', error);
      }
    });

    // Luego escuchar cuando esté listo Y autenticado para cargar el usuario
    combineLatest([
      this.keycloakHelper.isReady$,
      this.keycloakHelper.isLoggedIn$
    ]).pipe(
      filter(([isReady, isLoggedIn]) => isReady), // Solo proceder cuando esté listo
      tap(([isReady, isLoggedIn]) => {
        console.log('Estado:', { isReady, isLoggedIn });
        this.isLoaded = true;
      }),
      filter(([isReady, isLoggedIn]) => isLoggedIn), // Solo cargar usuario si está logueado
      switchMap(() => this.userService.getCurrentUser()),
      tap(user => {
        this.currentUser = user;
        console.log("Usuario actual cargado:", this.currentUser);
      })
    ).subscribe({
      error: (error) => {
        console.error('Error al cargar usuario:', error);
        this.isLoaded = true; // Marcar como cargado incluso si hay error
      }
    });

    // Debug: Monitorear cambios en el estado de login
    this.isLoggedIn$.subscribe(isLoggedIn => {
      console.log('Estado de login cambió:', isLoggedIn);
    });
  }

  openUserFormModal() {
    const modalElement = document.getElementById('userFormModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
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
}