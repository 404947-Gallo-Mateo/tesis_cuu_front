import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqModalComponent } from './faq-modal.component';

describe('FaqModalComponent', () => {
  let component: FaqModalComponent;
  let fixture: ComponentFixture<FaqModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaqModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaqModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
