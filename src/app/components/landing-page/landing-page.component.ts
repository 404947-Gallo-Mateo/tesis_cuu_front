import { Component, inject, OnInit } from '@angular/core';
import { KeycloakHelperService } from '../../services/backend-helpers/keycloak/keycloak-helper.service';
import { BackUserService } from '../../services/backend-helpers/user/back-user.service';
import { ExpandedUserDTO } from '../../models/backend/ExpandedUserDTO';
import { filter, of, Subject, switchMap, take, takeUntil, tap, timer } from 'rxjs';

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

  private destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //viejo oninit
  // ngOnInit(): void {
  //   this.keycloakHelper.isReady$.pipe(
  //     filter(isReady => isReady),
  //     tap(() => this.isLoaded = true),
  //     switchMap(() => this.userService.getCurrentUser()),
  //     tap(user => {
  //       this.currentUser = user;
  //       // console.log("Expanded Current User: ", this.currentUser);
  //     })
  //   ).subscribe();
  // }

  ngOnInit(): void {
      //console.log("Inicializando CuuStudentDisciplinesComponent...");
      
      // Inicializar Keycloak y luego suscribirse a los cambios del usuario
      this.keycloakHelper.isReady$.pipe(
        filter(isReady => isReady),
        tap(() => {
          //console.log("Keycloak está listo, iniciando suscripción al usuario...");
          this.isLoaded = true;
        }),
        switchMap(() => {
          // Primero obtener el usuario actual (esto iniciará la carga si es necesario)
          return this.userService.getCurrentUser();
        }),
        switchMap(() => {
          // Luego suscribirse a todos los cambios futuros del usuario
          return this.userService.currentUserValid$;
        }),
        takeUntil(this.destroy$)
      ).subscribe({
        next: (user) => {
          //console.log("Usuario actualizado en CuuStudentDisciplinesComponent:", user);
          this.currentUser = user;
        },
        error: (error) => {
          console.error('Error al obtener usuario:', error);
        }
      });
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
