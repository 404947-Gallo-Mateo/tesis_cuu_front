import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrateStudentInscriptionsComponent } from './administrate-student-inscriptions.component';

describe('AdministrateStudentInscriptionsComponent', () => {
  let component: AdministrateStudentInscriptionsComponent;
  let fixture: ComponentFixture<AdministrateStudentInscriptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrateStudentInscriptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrateStudentInscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
