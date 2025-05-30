import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Genre } from '../../../models/backend/embeddables/Genre';
import { ExpandedUserDTO } from '../../../models/backend/ExpandedUserDTO';
import { BackUserService } from '../../../services/backend-helpers/user/back-user.service';
import { BackDisciplineService } from '../../../services/backend-helpers/discipline/back-discipline.service';
import { DisciplineDto } from '../../../models/backend/DisciplineDTO';
import { Role } from '../../../models/backend/embeddables/Role';
import { Schedule } from '../../../models/backend/embeddables/Schedule';
import { CommonModule } from '@angular/common';
import { DayOfWeek } from '../../../models/backend/embeddables/DayOfWeek';
import { PutCategoryDTO } from '../../../models/backend/CategoryDTO';
import { PutDisciplineDTO } from '../../../models/backend/PostDisciplineDTO';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-put-discipline-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './put-discipline-form.component.html',
  styleUrl: './put-discipline-form.component.css'
})
export class PutDisciplineFormComponent {
@Input() discipline!: DisciplineDto;
  @Input() show: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() updateSuccess = new EventEmitter<DisciplineDto>();

  disciplineForm: FormGroup;
  genres = Object.values(Genre);
  daysOfWeek = Object.values(DayOfWeek);
  teachers: ExpandedUserDTO[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: BackUserService,
    private disciplineService: BackDisciplineService
  ) {
    this.disciplineForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      teacherIds: this.fb.array([]),
      categories: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadTeachers();
  }

  ngOnChanges(): void {
    if (this.discipline) {
      this.initializeForm();
    }
  }

  private loadTeachers(): void {
    this.userService.getAllUsersByRole(Role.TEACHER).subscribe(teachers => {
      this.teachers = teachers;
      this.initializeTeachers();
    });
  }

  private initializeForm(): void {
    this.disciplineForm.patchValue({
      name: this.discipline.name,
      description: this.discipline.description
    });

    // Limpiar arrays existentes
    while (this.teacherIds.length) this.teacherIds.removeAt(0);
    while (this.categories.length) this.categories.removeAt(0);

    // Inicializar teachers
    this.initializeTeachers();

    // Inicializar categorías
    this.discipline.categories?.forEach(category => {
      this.categories.push(this.createCategoryFormGroup(category));
    });
  }

  private initializeTeachers(): void {
    if (!this.teachers.length || !this.discipline) return;
    
    const teacherIds = this.discipline.teachers?.map(t => t.keycloakId) || [];
    teacherIds.forEach(teacherId => {
      const teacher = this.teachers.find(t => t.keycloakId === teacherId);
      if (teacher) this.addTeacher(teacher.keycloakId);
    });
  }

  // Getters para los FormArrays
  get teacherIds(): FormArray {
    return this.disciplineForm.get('teacherIds') as FormArray;
  }

  get categories(): FormArray {
    return this.disciplineForm.get('categories') as FormArray;
  }

  // Métodos para teachers
  addTeacher(teacherId?: string): void {
    this.teacherIds.push(this.fb.control(teacherId || ''));
  }

  removeTeacher(index: number): void {
    this.teacherIds.removeAt(index);
  }

  // Métodos para categories
private createCategoryFormGroup(category?: PutCategoryDTO): FormGroup {
  return this.fb.group({
    id: [category?.id],
    name: [category?.name || '', Validators.required],
    description: [category?.description || ''],
    monthlyFee: [category?.monthlyFee || 0, [Validators.required, Validators.min(0)]],
    availableSpaces: [category?.availableSpaces || 0, [Validators.required, Validators.min(0)]],
    ageRange: this.fb.group({
      minAge: [category?.ageRange?.minAge || 0, [Validators.required, Validators.min(0)]],
      maxAge: [category?.ageRange?.maxAge || 0, [Validators.required, Validators.min(0)]]
    }),
    schedules: this.createSchedulesArray(category?.schedules),
    allowedGenre: [category?.allowedGenre || Genre.MIXED, Validators.required]
  });
}

private createSchedulesArray(schedules?: Schedule[]): FormArray {
  const formGroups = schedules?.map(schedule => 
    this.fb.group({
      dayOfWeek: [schedule.dayOfWeek, Validators.required],
      startHour: [schedule.startHour, Validators.required],
      endHour: [schedule.endHour, Validators.required]
    })
  ) || [];
  
  return this.fb.array(formGroups);
}

  addCategory(): void {
    this.categories.push(this.createCategoryFormGroup());
  }

  removeCategory(index: number): void {
    this.categories.removeAt(index);
  }

  // Métodos para schedules
getSchedules(categoryIndex: number): FormArray {
  return this.categories.at(categoryIndex).get('schedules') as FormArray;
}

  addSchedule(categoryIndex: number): void {
    this.getSchedules(categoryIndex).push(this.fb.group({
      dayOfWeek: [DayOfWeek.MONDAY, Validators.required],
      startHour: ['09:00', Validators.required],
      endHour: ['10:00', Validators.required]
    }));
  }

  removeSchedule(categoryIndex: number, scheduleIndex: number): void {
    this.getSchedules(categoryIndex).removeAt(scheduleIndex);
  }

// En PutDisciplineFormComponent
onSubmit(): void {
  if (this.disciplineForm.valid) {
    const formValue = this.disciplineForm.value;
    const putDiscipline: PutDisciplineDTO = {
      id: this.discipline.id,
      name: formValue.name,
      description: formValue.description,
      teacherIds: formValue.teacherIds,
      categories: formValue.categories.map((category: PutCategoryDTO) => ({
        id: category.id,
        name: category.name,
        description: category.description,  
        monthlyFee: category.monthlyFee,  
        disciplineId: this.discipline.id,
        disciplineName: this.discipline.name,
        availableSpaces: category.availableSpaces,
        ageRange: category.ageRange,
        schedules: category.schedules,
        allowedGenre: category.allowedGenre
      }))
    };

    this.disciplineService.putDiscipline(putDiscipline).subscribe({
      next: (updatedDiscipline) => {
        Swal.fire('Éxito', 'Disciplina actualizada correctamente', 'success');
        this.updateSuccess.emit(updatedDiscipline);
        this.userService.getUpdatedInfoOfCurrentUser();
        this.onClose();
      },
      error: (err) => {
        console.error('Error updating discipline:', err);
        Swal.fire('Error', 'No se pudo actualizar la disciplina', 'error');
      }
    });
  }
}

  onClose(): void {
    this.close.emit();
  }

}
