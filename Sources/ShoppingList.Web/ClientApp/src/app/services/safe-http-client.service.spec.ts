import { TestBed } from '@angular/core/testing';

import { SafeHttpClientService } from './safe-http-client.service';

describe('SafeHttpClientService', () => {
    let service: SafeHttpClientService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SafeHttpClientService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
