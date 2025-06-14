import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrateUsersPageComponent } from './administrate-users-page.component';

describe('AdministrateUsersPageComponent', () => {
  let component: AdministrateUsersPageComponent;
  let fixture: ComponentFixture<AdministrateUsersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrateUsersPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrateUsersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
