import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BackUserService } from '../../../services/backend-helpers/user/back-user.service';
import { KeycloakHelperService } from '../../../services/backend-helpers/keycloak/keycloak-helper.service';
import { SyncUserInfoService } from '../../../services/backend-helpers/user/sync-user-info.service';
import { ExpandedUserDTO } from '../../../models/backend/ExpandedUserDTO';
import { combineLatest, filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-faq-modal',
  imports: [CommonModule],
  templateUrl: './faq-modal.component.html',
  styleUrl: './faq-modal.component.css'
})
export class FaqModalComponent {
  isLoaded = false;
  
  private userService = inject(BackUserService);
  private keycloakHelper = inject(KeycloakHelperService);
  private syncUserInfoService = inject(SyncUserInfoService);
  
  currentUser!: ExpandedUserDTO;
  isLoggedIn$ = this.keycloakHelper.isLoggedIn$;
  currentRole$ = this.userService.currentRole$;
  currentRole: string | null = null; 


  constructor() {}

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

    login() {
    this.keycloakHelper.login();
  }

}
