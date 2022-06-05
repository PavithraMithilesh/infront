import { TestBed } from '@angular/core/testing';

import { StockService } from './stock-service.service';

describe('ProductServiceService', () => {
  let service: StockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
