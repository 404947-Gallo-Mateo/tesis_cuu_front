import { TestBed } from '@angular/core/testing';

import { BackCategoryService } from './back-category.service';

describe('BackCategoryService', () => {
  let service: BackCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
