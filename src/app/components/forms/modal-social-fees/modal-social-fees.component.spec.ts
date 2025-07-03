import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSocialFeesComponent } from './modal-social-fees.component';

describe('ModalSocialFeesComponent', () => {
  let component: ModalSocialFeesComponent;
  let fixture: ComponentFixture<ModalSocialFeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalSocialFeesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalSocialFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
