import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import Swal from 'sweetalert2';
import { BackUserService } from '../../../services/backend-helpers/user/back-user.service';
import { BackStudentInscriptionService } from '../../../services/backend-helpers/student-inscription/back-student-inscription.service';
import { CategoryDTO } from '../../../models/backend/CategoryDTO';
import { CommonModule } from '@angular/common';
import { StudentInscriptionDTO } from '../../../models/backend/StudentInscriptionDTO';
import { UserDTO } from '../../../models/backend/ExpandedUserDTO';
import { DisciplineSummaryDTO } from '../../../models/backend/DisciplineSummaryDTO';
import { CategorySummaryDTO } from '../../../models/backend/CategorySummaryDTO';
import { KeycloakHelperService } from '../../../services/backend-helpers/keycloak/keycloak-helper.service';
import { combineLatest, filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-inscription-to-category',
  imports: [CommonModule],
  templateUrl: './inscription-to-category.component.html',
  styleUrl: './inscription-to-category.component.css'
})
export class InscriptionToCategoryComponent implements OnInit {
  ngOnInit(): void {
    
    this.backUserService.currentRole$.subscribe(role => {
      this.currentRole = role;
      //console.log('Rol actualizado:', role);
    });
  }
  
  private backUserService = inject(BackUserService);
  private backStudentInscriptionService = inject(BackStudentInscriptionService);
  private keycloakHelper = inject(KeycloakHelperService);

  @Input() category!: CategoryDTO;
  @Input() show: boolean = false;
  @Output() close = new EventEmitter<void>();

  isLoggedIn$ = this.keycloakHelper.isLoggedIn$;
  currentRole$ = this.backUserService.currentRole$;
  currentRole: string | null = null; 

  onClose(): void {
    this.close.emit();
  }

  translateAllowedGenre(genreEnum: string): string {
    if (genreEnum === "MALE") {
      return "Masculino";
    } else if (genreEnum === "FEMALE") {
      return "Femenino";
    } else {
      return "Ambos";
    }
  }

  getFormattedSchedules(category: CategoryDTO): string[] {
    const dayMap: { [key: string]: string } = {
      MONDAY: 'Lunes',
      TUESDAY: 'Martes',
      WEDNESDAY: 'Miércoles',
      THURSDAY: 'Jueves',
      FRIDAY: 'Viernes',
      SATURDAY: 'Sábado',
      SUNDAY: 'Domingo'
    };

    const grouped: { [day: string]: Set<string> } = {};
    
    for (const s of category.schedules) {
      const day = s.dayOfWeek;
      const range = `${s.startHour.slice(0, 5)} - ${s.endHour.slice(0, 5)}`;
      if (!grouped[day]) {
        grouped[day] = new Set();
      }
      grouped[day].add(range);
    }

    const dayOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    return dayOrder
      .filter(day => grouped[day])
      .map(day => {
        const horarios = Array.from(grouped[day]).join('\n');
        return `${dayMap[day]}:\n${horarios}`;
      });
  }

  //por ahora te inscribe como si fuese una nueva Inscripcion, 
  // tengo q implementar el if para ACTUALIZAR una inscripcion o CREAR una 
  // (esto segun si la category a la q se quiere inscribir es de una Discipline donde ya esta inscrito en OTRA category)

  //basicamente, si es cambiar de Category, se consulta al usuario si esta seguro y se actualiza la StudentInscrition
 newInscriptionToCategory(): void {
    const currentUser = this.backUserService.getCurrentUserSnapshot();
    
    if (!currentUser) {
        console.error('No hay usuario actual disponible');
        Swal.fire('Error', 'No se pudo obtener la información del usuario.', 'error');
        return;
    }
    
    const studentKeycloakId: string = currentUser.keycloakId;
    const disciplineId: string = this.category.disciplineId;
    const categoryId: string = this.category.id;

    // console.log("CREATE studentInscription params:", {
    //     studentKeycloakId,
    //     disciplineId,
    //     categoryId
    // });

    //true
    // si es una NUEVA inscripcion a una category de una Discipline donde NO se tiene una inscripcion, se CREA la studentInscription sin consultar
    if(this.isNewInscription(disciplineId)){
        Swal.showLoading();
        
        this.backStudentInscriptionService
            .postStudentInscription(studentKeycloakId, disciplineId, categoryId)
            .subscribe({
                next: (resp) => {
                        Swal.hideLoading();
                        if (resp) {
                            Swal.fire({
                                title: 'Inscripción exitosa!',
                                text: 'Se inscribió en ' + this.category.name + '.',
                                icon: 'success'
                            }).then(() => {
                                this.backUserService.refreshCurrentUser().subscribe({
                                    next: (updatedUser) => {
                                        //console.log("Usuario actualizado:", updatedUser);
                                        this.onClose();
                                    },
                                    error: (refreshError) => {
                                        console.error('Error al actualizar usuario:', refreshError);
                                        this.onClose();
                                    }
                                });
                            });
                        } else {
                            Swal.fire('Error', 'No se pudo completar la inscripción.', 'error');
                        }
                    },
                error: (err: {message: string, status?: number}) => {
                    Swal.hideLoading();
                    console.error('Error completo en componente:', err);
                    
                    Swal.fire({
                        title: `Error`,
                        text: err.message,
                        icon: 'error',
                        confirmButtonText: 'Entendido'
                    });
                }
            });
    }
    else {
      const previousCategoryName: string | undefined = currentUser.studentCategories.find(x => x.disciplineId == disciplineId)?.name;

      Swal.fire({
        title: '¿Confirmar Inscripción?',
        text: 'Se inscribirá en ' + this.category.name + ', anulando su inscripcion anterior en Categoría ' + previousCategoryName + ".",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#aaa',
        confirmButtonText: 'Sí, inscribirme',
        cancelButtonText: 'Cancelar'
    }).then(result => {
        if (result.isConfirmed) {
        Swal.showLoading();
        
        this.backStudentInscriptionService
            .putStudentInscription(studentKeycloakId, disciplineId, categoryId)
            .subscribe({
                next: (resp) => {
                        Swal.hideLoading();
                        if (resp) {
                            Swal.fire({
                                title: 'Inscripción exitosa!',
                                text: 'Se inscribió en ' + this.category.name + '.',
                                icon: 'success'
                            }).then(() => {
                                this.backUserService.refreshCurrentUser().subscribe({
                                    next: (updatedUser) => {
                                        //console.log("Usuario actualizado:", updatedUser);
                                        this.onClose();
                                    },
                                    error: (refreshError) => {
                                        console.error('Error al actualizar usuario:', refreshError);
                                        this.onClose();
                                    }
                                });
                            });
                        } else {
                            Swal.fire('Error', 'No se pudo completar la inscripción, se mantuvo su inscripción anterior.', 'error');
                        }
                    },
                error: (err: {message: string, status?: number}) => {
                    Swal.hideLoading();
                    console.error('Error completo en componente:', err);
                    
                    Swal.fire({
                        title: `Error`,
                        text: err.message,
                        icon: 'error',
                        confirmButtonText: 'Entendido'
                    });
                }
            });
          }
      });
    }
    
}


//devuelve true si es una nueva StudentInscription (1ra vez q el Alumno se inscribe a una Category de ESA Discipline)
//devuelve false si el Alumno ya tiene una StudentInscription con esa Discipline (entonces se actualiza el StudentInscription existente)
isNewInscription(disciplineId: string): boolean {
  const currentUser = this.backUserService.getCurrentUserSnapshot();
  const currentUserInscriptedCategories: CategoryDTO[] = currentUser?.studentCategories || [];

  return !currentUserInscriptedCategories.some(category => 
    category.disciplineId === disciplineId
  );
}

}
