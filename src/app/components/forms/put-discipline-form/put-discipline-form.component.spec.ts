import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PutDisciplineFormComponent } from './put-discipline-form.component';

describe('PutDisciplineFormComponent', () => {
  let component: PutDisciplineFormComponent;
  let fixture: ComponentFixture<PutDisciplineFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PutDisciplineFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PutDisciplineFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
