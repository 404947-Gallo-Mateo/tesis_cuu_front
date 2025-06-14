import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostDisciplineFormComponent } from './post-discipline-form.component';

describe('PostDisciplineFormComponent', () => {
  let component: PostDisciplineFormComponent;
  let fixture: ComponentFixture<PostDisciplineFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostDisciplineFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostDisciplineFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
