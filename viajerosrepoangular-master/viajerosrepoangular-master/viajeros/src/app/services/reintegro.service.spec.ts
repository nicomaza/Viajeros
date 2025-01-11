import { TestBed } from '@angular/core/testing';

import { ReintegroService } from './reintegro.service';

describe('ReintegroService', () => {
  let service: ReintegroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReintegroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
