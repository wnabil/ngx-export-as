import { TestBed } from '@angular/core/testing';

import { ExportAsService } from './export-as.service';

describe('NgxExportAsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExportAsService = TestBed.inject(ExportAsService);
    expect(service).toBeTruthy();
  });
});
