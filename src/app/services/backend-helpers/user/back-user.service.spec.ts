import { TestBed } from '@angular/core/testing';

import { BackUserService } from './back-user.service';

describe('BackUserService', () => {
  let service: BackUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
