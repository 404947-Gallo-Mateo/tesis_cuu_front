import { TestBed } from '@angular/core/testing';

import { BackStudentInscriptionService } from './back-student-inscription.service';

describe('BackStudentInscriptionService', () => {
  let service: BackStudentInscriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackStudentInscriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
