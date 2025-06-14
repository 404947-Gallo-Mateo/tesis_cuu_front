import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MpCancelledPaymentPageComponent } from './mp-cancelled-payment-page.component';

describe('MpCancelledPaymentPageComponent', () => {
  let component: MpCancelledPaymentPageComponent;
  let fixture: ComponentFixture<MpCancelledPaymentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MpCancelledPaymentPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MpCancelledPaymentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
