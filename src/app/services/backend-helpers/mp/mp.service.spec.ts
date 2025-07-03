import { TestBed } from '@angular/core/testing';

import { MpService } from './mp.service';

describe('MpService', () => {
  let service: MpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
