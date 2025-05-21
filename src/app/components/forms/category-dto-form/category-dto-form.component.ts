import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryDTO } from '../../../models/backend/CategoryDTO';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-dto-form',
  imports: [CommonModule],
  templateUrl: './category-dto-form.component.html',
  styleUrl: './category-dto-form.component.css'
})
export class CategoryDtoFormComponent {

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

}
