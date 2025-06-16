import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CategoryDTO } from '../../../models/backend/CategoryDTO';
import { CommonModule } from '@angular/common';
import { BackUserService } from '../../../services/backend-helpers/user/back-user.service';
import Swal from 'sweetalert2';
import { BackStudentInscriptionService } from '../../../services/backend-helpers/student-inscription/back-student-inscription.service';

@Component({
  selector: 'app-category-dto-form',
  imports: [CommonModule],
  templateUrl: './category-dto-form.component.html',
  styleUrl: './category-dto-form.component.css'
})
export class CategoryDtoFormComponent {
  private backUserService = inject(BackUserService);
  private backStudentInscriptionService = inject(BackStudentInscriptionService);
  
  @Input() category!: CategoryDTO;
  @Input() show: boolean = false;
  @Output() close = new EventEmitter<void>();

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

  deleteInscription(): void {
    // Usar el snapshot para obtener el usuario actual de forma síncrona
    const currentUser = this.backUserService.getCurrentUserSnapshot();
    
    if (!currentUser) {
      console.error('No hay usuario actual disponible');
      Swal.fire('Error', 'No se pudo obtener la información del usuario.', 'error');
      return;
    }

    const studentkeycloakId = currentUser.keycloakId;
    const disciplineId = this.category.disciplineId;
    const categoryId = this.category.id;
    
    //console.log("DELETE deleteInscription params =", studentkeycloakId, disciplineId, categoryId);
    
    Swal.fire({
      title: '¿Confirmar desinscripción?',
      text: 'Se eliminará su inscripción en ' + this.category.name + '.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.backStudentInscriptionService
          .deleteStudentInscription(studentkeycloakId, disciplineId, categoryId)
          .subscribe({
            next: (resp) => {
              if (resp) {
                // IMPORTANTE: Actualizar la información del usuario después de la operación
                this.backUserService.refreshCurrentUser().subscribe({
                  next: (updatedUser) => {
                    //console.log("Usuario actualizado después de eliminar inscripción:", updatedUser);
                    Swal.fire('Actualizado', 'Se eliminó la inscripción en ' + this.category.name + '.', 'success');
                    this.onClose(); // Cerrar el modal
                  },
                  error: (refreshError) => {
                    console.error('Error al actualizar información del usuario:', refreshError);
                    // Mostrar éxito de la eliminación aunque falle la actualización
                    Swal.fire('Actualizado', 'Se eliminó la inscripción en ' + this.category.name + '.', 'success');
                    this.onClose();
                  }
                });
              } else {
                Swal.fire('Error', 'No se pudo eliminar, intente más tarde.', 'error');
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