import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuuStudentDisciplinesComponent } from './cuu-student-disciplines.component';

describe('CuuStudentDisciplinesComponent', () => {
  let component: CuuStudentDisciplinesComponent;
  let fixture: ComponentFixture<CuuStudentDisciplinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuuStudentDisciplinesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuuStudentDisciplinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
