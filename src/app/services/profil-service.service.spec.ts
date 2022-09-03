import { TestBed } from '@angular/core/testing';

import { ProfilServiceService } from './profil-service.service';

describe('ProfilServiceService', () => {
  let service: ProfilServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfilServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
