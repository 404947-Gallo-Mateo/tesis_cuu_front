import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialFeesReportComponent } from './social-fees-report.component';

describe('SocialFeesReportComponent', () => {
  let component: SocialFeesReportComponent;
  let fixture: ComponentFixture<SocialFeesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialFeesReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialFeesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
