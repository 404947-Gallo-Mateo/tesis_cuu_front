import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryDtoFormComponent } from './category-dto-form.component';

describe('CategoryDtoFormComponent', () => {
  let component: CategoryDtoFormComponent;
  let fixture: ComponentFixture<CategoryDtoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryDtoFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryDtoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
