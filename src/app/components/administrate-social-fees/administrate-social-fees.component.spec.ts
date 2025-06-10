import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrateSocialFeesComponent } from './administrate-social-fees.component';

describe('AdministrateSocialFeesComponent', () => {
  let component: AdministrateSocialFeesComponent;
  let fixture: ComponentFixture<AdministrateSocialFeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrateSocialFeesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrateSocialFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
