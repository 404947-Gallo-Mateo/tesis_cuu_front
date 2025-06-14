import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuuNavbarComponent } from './cuu-navbar.component';

describe('CuuNavbarComponent', () => {
  let component: CuuNavbarComponent;
  let fixture: ComponentFixture<CuuNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuuNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuuNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
