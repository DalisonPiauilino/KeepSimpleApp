import { TestBed } from '@angular/core/testing';

import { FileXmlUploadService } from './file-xml-upload.service';

describe('FileXmlUploadService', () => {
  let service: FileXmlUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileXmlUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
