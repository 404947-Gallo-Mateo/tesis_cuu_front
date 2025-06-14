import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDTOFormComponent } from './user-dto-form.component';

describe('UserDTOFormComponent', () => {
  let component: UserDTOFormComponent;
  let fixture: ComponentFixture<UserDTOFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDTOFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDTOFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
