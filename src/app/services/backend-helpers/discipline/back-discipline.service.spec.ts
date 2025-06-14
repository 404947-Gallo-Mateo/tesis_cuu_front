import { TestBed } from '@angular/core/testing';

import { BackDisciplineService } from './back-discipline.service';

describe('BackDisciplineService', () => {
  let service: BackDisciplineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackDisciplineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
