import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DisciplineDto } from '../../../models/backend/DisciplineDTO';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpandedUserDTO } from '../../../models/backend/ExpandedUserDTO';
import { CommonModule } from '@angular/common';
import { DayOfWeek } from '../../../models/backend/embeddables/DayOfWeek';
import { Genre } from '../../../models/backend/embeddables/Genre';
import { BackUserService } from '../../../services/backend-helpers/user/back-user.service';
import { BackDisciplineService } from '../../../services/backend-helpers/discipline/back-discipline.service';
import { Role } from '../../../models/backend/embeddables/Role';
import { PostCategoryDTO, PutCategoryDTO } from '../../../models/backend/CategoryDTO';
import { Schedule } from '../../../models/backend/embeddables/Schedule';
import { PostDisciplineDTO } from '../../../models/backend/PostDisciplineDTO';
import Swal from 'sweetalert2';
import { AgeRange } from '../../../models/backend/embeddables/AgeRange';

@Component({
  selector: 'app-post-discipline-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './post-discipline-form.component.html',
  styleUrl: './post-discipline-form.component.css'
})
export class PostDisciplineFormComponent {

  //@Input() discipline!: DisciplineDto;
  @Input() show: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() updateSuccess = new EventEmitter<DisciplineDto>();

  onClose(): void {
    this.close.emit();
  }

  disciplineForm: FormGroup;  
  teachers: ExpandedUserDTO[] = [];
  daysOfWeek = [
    {value: DayOfWeek.MONDAY, label: "Lunes"},
    {value: DayOfWeek.THURSDAY, label: "Martes"},
    {value: DayOfWeek.WEDNESDAY, label: "Miércoles"},
    {value: DayOfWeek.TUESDAY, label: "Jueves"},
    {value: DayOfWeek.FRIDAY, label: "Viernes"},
    {value: DayOfWeek.SATURDAY, label: "Sábado"},
    {value: DayOfWeek.SUNDAY, label: "Domingo"}
  ];
  genres = [
    { value: Genre.MALE, label: 'Masculino' },
    { value: Genre.FEMALE, label: 'Femenino' },
    { value: Genre.MIXED, label: 'Ambos' }
  ];

//metodos para toggle en category
  expandedCategories: boolean[] = [];
  toggleCategory(index: number) {
    this.expandedCategories[index] = !this.expandedCategories[index];
  }

  isCategoryExpanded(index: number): boolean {
    return this.expandedCategories[index];
  }

  // metodos para toggle en horarios (schedules)
  expandedSchedules: boolean[][] = [];
  toggleSchedules(categoryIndex: number) {
    if (!this.expandedSchedules[categoryIndex]) {
      this.expandedSchedules[categoryIndex] = [];
    }
    this.expandedSchedules[categoryIndex][0] = !this.expandedSchedules[categoryIndex][0];
  }

  areSchedulesExpanded(categoryIndex: number): boolean {
    return this.expandedSchedules[categoryIndex] && this.expandedSchedules[categoryIndex][0];
  }

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
    this.expandedCategories = new Array(this.categories.length).fill(false);
  }

  private loadTeachers(): void {
    this.userService.getAllUsersByRole(Role.TEACHER).subscribe(teachers => {
      this.teachers = teachers;
      //this.initializeTeachers();
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
private createCategoryFormGroup(category?: PostCategoryDTO): FormGroup {
  return this.fb.group({
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
    this.expandedCategories.push(false); 
    this.expandedSchedules.push([false]);
  }

  removeCategory(index: number): void {
    this.categories.removeAt(index);
    this.expandedCategories.splice(index, 1);
    this.expandedSchedules.splice(index, 1);
  }

  // Métodos para schedules
getSchedules(categoryIndex: number): FormArray {
  return this.categories.at(categoryIndex).get('schedules') as FormArray;
}

  addSchedule(categoryIndex: number): void {
    this.getSchedules(categoryIndex).push(this.fb.group({
      dayOfWeek: [DayOfWeek.MONDAY, Validators.required],
      startHour: ['09:00:00', Validators.required],
      endHour: ['10:00:00', Validators.required]
    }));
  }

  removeSchedule(categoryIndex: number, scheduleIndex: number): void {
    this.getSchedules(categoryIndex).removeAt(scheduleIndex);
  }

// En PutDisciplineFormComponent
onSubmit(): void {
  if (this.disciplineForm.valid) {
    const formValue = this.disciplineForm.value;
    const postDiscipline: PostDisciplineDTO = {
      name: formValue.name,
      description: formValue.description,
      teacherIds: formValue.teacherIds,
      categories: formValue.categories.map((category: PutCategoryDTO) => ({
        id: category.id,
        name: category.name,
        description: category.description,  
        monthlyFee: category.monthlyFee,  
        disciplineId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        disciplineName: "newDisciplineName",
        availableSpaces: category.availableSpaces,
        ageRange: category.ageRange,
        schedules: category.schedules,
        allowedGenre: category.allowedGenre
      }))
    };

    //console.log("postDiscipline: ", postDiscipline);

    this.disciplineService.postDiscipline(postDiscipline).subscribe({
      next: (createdDisicpline) => {
        Swal.fire('Éxito', 'Disciplina creada correctamente', 'success');
        this.updateSuccess.emit(createdDisicpline);
        this.userService.getUpdatedInfoOfCurrentUser();
        this.onClose();
      },
      error: (err: {message: string, status?: number}) => {
                          Swal.hideLoading();
                          //error('Error completo en componente:', err);
                          
                          Swal.fire({
                              title: `Error`,
                              text: err.message,
                              icon: 'error',
                              confirmButtonText: 'Entendido'
                          });
                      }
    });
  }
}

}
