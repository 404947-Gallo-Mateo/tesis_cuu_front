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

  translateAllowedGenre(genreEnum: string ){
    if(genreEnum === "MALE"){
      return "Masculino";
    }
    else if(genreEnum === "FEMALE"){
      return "Femenino";
    }
    else{
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


    async deleteInscription() {

      const studentkeycloakId = (await this.backUserService.getCurrentUser()).keycloakId;
      const disciplineId = this.category.disciplineId;
      const categoryId = this.category.id;

      console.log("DELETE deleteInscription params = studentkeycloakId: ", studentkeycloakId, " | disciplineId: ", disciplineId, " | categoryId: ", categoryId);

      const result = await Swal.fire({
        title: '¿Confirmar desinscripción?',
        text: 'Se eliminara se inscripción en ' + this.category.name + '.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#aaa',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        try {
          let resp = await this.backStudentInscriptionService.deleteStudentInscription(
            studentkeycloakId, disciplineId, categoryId);
          //console.log("resp de submitUpdatedKeycloakUser(): ", resp);
          this.backUserService.getUpdatedInfoOfCurrentUser();
          if(resp){
            Swal.fire('Actualizado', 'Se elimino la inscripcion, ya no participa de ' + this.category.name +'.', 'success');
          }
          else {
            Swal.fire('Error', 'No se pudo eliminar, intente mas tarde.', 'error');
          }
        } catch (err) {
          console.error('Error actualizando usuario:', err);
          Swal.fire('Error', 'Hubo un problema actualizar el usuario.', 'error');
        }
      }
    
  }

}
