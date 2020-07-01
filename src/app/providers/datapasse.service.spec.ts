import { TestBed } from '@angular/core/testing';

import { DatapasseService } from './datapasse.service';

describe('DatapasseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatapasseService = TestBed.get(DatapasseService);
    expect(service).toBeTruthy();
  });
});
