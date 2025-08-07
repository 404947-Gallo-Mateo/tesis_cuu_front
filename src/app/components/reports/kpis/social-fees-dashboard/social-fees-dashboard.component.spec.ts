import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialFeesDashboardComponent } from './social-fees-dashboard.component';

describe('SocialFeesDashboardComponent', () => {
  let component: SocialFeesDashboardComponent;
  let fixture: ComponentFixture<SocialFeesDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialFeesDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialFeesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
