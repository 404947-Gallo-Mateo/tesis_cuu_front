import { Component } from '@angular/core';
import { ExpandedUserDTO } from '../../../models/backend/ExpandedUserDTO';
import { BackUserService } from '../../../services/backend-helpers/back-user.service';
import { KeycloakHelperService } from '../../../services/keycloak-helper.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-cuu-student-disciplines',
  standalone: true,
  imports: [],
  templateUrl: './cuu-student-disciplines.component.html',
  styleUrl: './cuu-student-disciplines.component.css'
})
export class CuuStudentDisciplinesComponent {

  currentUser!: ExpandedUserDTO;

  private userService = inject(BackUserService);
  private keycloakHelper = inject(KeycloakHelperService);

  constructor() {}

  async ngOnInit(): Promise<void> {
    // Esperar hasta que Keycloak esté listo
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

}
