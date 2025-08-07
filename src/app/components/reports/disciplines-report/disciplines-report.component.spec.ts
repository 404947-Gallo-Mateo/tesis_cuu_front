import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisciplinesReportComponent } from './disciplines-report.component';

describe('DisciplinesReportComponent', () => {
  let component: DisciplinesReportComponent;
  let fixture: ComponentFixture<DisciplinesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisciplinesReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisciplinesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
