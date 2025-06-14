import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalStudentFeesComponent } from './modal-student-fees.component';

describe('ModalStudentFeesComponent', () => {
  let component: ModalStudentFeesComponent;
  let fixture: ComponentFixture<ModalStudentFeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalStudentFeesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalStudentFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
