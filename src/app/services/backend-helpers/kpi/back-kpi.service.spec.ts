import { TestBed } from '@angular/core/testing';

import { BackKpiService } from './back-kpi.service';

describe('BackKpiService', () => {
  let service: BackKpiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackKpiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
