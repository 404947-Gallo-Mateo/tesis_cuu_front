import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisciplineFeesDashboardComponent } from './discipline-fees-dashboard.component';

describe('DisciplineFeesDashboardComponent', () => {
  let component: DisciplineFeesDashboardComponent;
  let fixture: ComponentFixture<DisciplineFeesDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisciplineFeesDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisciplineFeesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
