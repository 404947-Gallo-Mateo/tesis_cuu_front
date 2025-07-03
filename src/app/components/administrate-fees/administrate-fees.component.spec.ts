import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrateFeesComponent } from './administrate-fees.component';

describe('AdministrateFeesComponent', () => {
  let component: AdministrateFeesComponent;
  let fixture: ComponentFixture<AdministrateFeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrateFeesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrateFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
