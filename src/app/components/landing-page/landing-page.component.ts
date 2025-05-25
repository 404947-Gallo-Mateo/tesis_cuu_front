import { Component, inject, OnInit } from '@angular/core';
import { KeycloakHelperService } from '../../services/backend-helpers/keycloak/keycloak-helper.service';
import { BackUserService } from '../../services/backend-helpers/user/back-user.service';
import { ExpandedUserDTO } from '../../models/backend/ExpandedUserDTO';
import { filter, of, switchMap, take, tap, timer } from 'rxjs';

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

  isLoaded = false;
  currentUser!: ExpandedUserDTO;

  // Nueva propiedad observable
  isLoggedIn$ = this.keycloakHelper.isLoggedIn$;

  ngOnInit(): void {
    this.keycloakHelper.isReady$.pipe(
      filter(isReady => isReady),
      tap(() => this.isLoaded = true),
      switchMap(() => this.userService.getCurrentUser()),
      tap(user => {
        this.currentUser = user;
        // console.log("Expanded Current User: ", this.currentUser);
      })
    ).subscribe();
  }

  // Este método ahora depende de si `currentUser` fue seteado.
  getUserName(): string | null {
    if (this.currentUser) {
      return this.currentUser.firstName;
    } else {
      //console.log("No se puede obtener username porque no está cargado el usuario");
      return null;
    }
  }

}
