import { Component, OnInit, ViewChild } from '@angular/core';
import { KeycloakHelperService } from '../../../services/backend-helpers/keycloak/keycloak-helper.service';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { UserDTOFormComponent } from "../../forms/user-dto-form/user-dto-form.component";
import { ExpandedUserDTO } from '../../../models/backend/ExpandedUserDTO';
import { BackUserService } from '../../../services/backend-helpers/user/back-user.service';
import { filter, of, switchMap, take, tap, timer, combineLatest, firstValueFrom } from 'rxjs';
import { SyncUserInfoService } from '../../../services/backend-helpers/user/sync-user-info.service';

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
  private syncUserInfoService = inject(SyncUserInfoService);
  
  currentUser!: ExpandedUserDTO;
  isLoggedIn$ = this.keycloakHelper.isLoggedIn$;
  currentRole$ = this.userService.currentRole$;
  currentRole: string | null = null; // Variable para almacenar el valor


  constructor() {}

  ngOnInit(): void {
    //console.log("Inicializando navbar component...");
    // IMPORTANTE: Primero inicializar Keycloak
    this.keycloakHelper.init().subscribe({
      next: (authenticated) => {
        
      },
      error: (error) => {
        console.error('Error al inicializar Keycloak:', error);
      }
    });

    // Escuchar cuando Keycloak esté listo Y el usuario esté autenticado
    combineLatest([
      this.keycloakHelper.isReady$,
      this.keycloakHelper.isLoggedIn$
    ]).pipe(
      filter(([isReady, isLoggedIn]) => isReady), // Solo proceder cuando esté listo
      tap(([isReady, isLoggedIn]) => {
        //console.log('Estado:', { isReady, isLoggedIn });
        this.isLoaded = true;
      }),
      filter(([isReady, isLoggedIn]) => isLoggedIn), // Solo cargar usuario si está logueado
      switchMap(() => this.userService.getCurrentUser()),
      switchMap(() => {
        // Suscribirse a los cambios del usuario de forma reactiva
        return this.userService.currentUserValid$;
      })
    ).subscribe({
      next: (user) => {
        this.currentUser = user;
        //console.log("Usuario actual cargado/actualizado en navbar:", this.currentUser);
      },
      error: (error) => {
        console.error('Error al cargar usuario:', error);
        this.isLoaded = true; // Marcar como cargado incluso si hay error
      }
    });

    // Debug: Monitorear cambios en el estado de login
    this.isLoggedIn$.subscribe(isLoggedIn => {
      console.log('Estado de login cambió:', isLoggedIn);
    });

    if(this.isLoggedIn$){
      console.log("se llamo a this.syncUserInfoService.syncInfoOfCurrentUser()");
      this.syncUserInfoService.syncInfoOfCurrentUser();
    }

    this.userService.currentRole$.subscribe(role => {
      this.currentRole = role;
      console.log('Rol actualizado:', role);
    });
  }

  async openUserFormModal() {
    try {
      // Obtener el valor actual del rol
      this.currentRole = await firstValueFrom(this.userService.currentRole$);
      
      // Abrir el modal
      const modalElement = document.getElementById('userFormModal');
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
    } catch (error) {
      console.error('Error al obtener el rol:', error);
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