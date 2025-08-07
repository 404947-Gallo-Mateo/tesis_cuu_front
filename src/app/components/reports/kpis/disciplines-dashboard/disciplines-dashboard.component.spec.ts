import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisciplinesDashboardComponent } from './disciplines-dashboard.component';

describe('DisciplinesDashboardComponent', () => {
  let component: DisciplinesDashboardComponent;
  let fixture: ComponentFixture<DisciplinesDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisciplinesDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisciplinesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
