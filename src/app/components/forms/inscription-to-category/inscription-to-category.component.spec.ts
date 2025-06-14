import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscriptionToCategoryComponent } from './inscription-to-category.component';

describe('InscriptionToCategoryComponent', () => {
  let component: InscriptionToCategoryComponent;
  let fixture: ComponentFixture<InscriptionToCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InscriptionToCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InscriptionToCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
