import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherDisciplinesComponent } from './teacher-disciplines.component';

describe('TeacherDisciplinesComponent', () => {
  let component: TeacherDisciplinesComponent;
  let fixture: ComponentFixture<TeacherDisciplinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherDisciplinesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherDisciplinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
