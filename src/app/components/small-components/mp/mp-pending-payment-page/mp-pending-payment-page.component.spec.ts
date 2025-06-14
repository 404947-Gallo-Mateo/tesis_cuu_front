import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MpPendingPaymentPageComponent } from './mp-pending-payment-page.component';

describe('MpPendingPaymentPageComponent', () => {
  let component: MpPendingPaymentPageComponent;
  let fixture: ComponentFixture<MpPendingPaymentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MpPendingPaymentPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MpPendingPaymentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
