import { Component, OnInit, ViewChild } from '@angular/core';
import { KeycloakHelperService } from '../../../services/backend-helpers/keycloak/keycloak-helper.service';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { UserDTOFormComponent } from "../../forms/user-dto-form/user-dto-form.component";
import { ExpandedUserDTO } from '../../../models/backend/ExpandedUserDTO';
import { BackUserService } from '../../../services/backend-helpers/user/back-user.service';
import { filter, of, switchMap, take, tap, timer, combineLatest, firstValueFrom } from 'rxjs';
import { SyncUserInfoService } from '../../../services/backend-helpers/user/sync-user-info.service';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-cuu-navbar',
  standalone: true,
  imports: [CommonModule, UserDTOFormComponent, CommonModule, 
    UserDTOFormComponent, 
    RouterModule],
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
  currentRole: string | null = null; 

  isCollapsed = true;

  constructor() {}

    toggleNavbar() {
    this.isCollapsed = !this.isCollapsed;
  }

  closeNavbar() {
    this.isCollapsed = true;
  }

  ngOnInit(): void {
    this.keycloakHelper.init().subscribe({
      next: (authenticated) => {
        
      },
      error: (error) => {
        console.error('Error al inicializar Keycloak:', error);
      }
    });

    combineLatest([
      this.keycloakHelper.isReady$,
      this.keycloakHelper.isLoggedIn$
    ]).pipe(
      filter(([isReady, isLoggedIn]) => isReady),
      tap(([isReady, isLoggedIn]) => {
        this.isLoaded = true;
      }),
      filter(([isReady, isLoggedIn]) => isLoggedIn), 
      switchMap(() => this.userService.getCurrentUser()),
      switchMap(() => {
        return this.userService.currentUserValid$;
      })
    ).subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (error) => {
        console.error('Error al cargar usuario:', error);
        this.isLoaded = true;
      }
    });

    this.isLoggedIn$.subscribe(isLoggedIn => {
    });

    if(this.isLoggedIn$){
      this.syncUserInfoService.syncInfoOfCurrentUser();
    }

    this.userService.currentRole$.subscribe(role => {
      this.currentRole = role;
    });
  }

  async openUserFormModal() {
    try {
      this.currentRole = await firstValueFrom(this.userService.currentRole$);
      
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