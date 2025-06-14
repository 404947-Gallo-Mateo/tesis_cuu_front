import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserDtoFormComponent } from './admin-user-dto-form.component';

describe('AdminUserDtoFormComponent', () => {
  let component: AdminUserDtoFormComponent;
  let fixture: ComponentFixture<AdminUserDtoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUserDtoFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUserDtoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
