import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SafeHttpClientService } from './safe-http-client.service';
import { LoginRequest } from '../contracts/login-request';

@Injectable()
export class AuthService {

    private readonly baseAddress: string = '/api/auth';

    private readonly safeHttp: SafeHttpClientService;

    constructor(safeHttp: SafeHttpClientService) {
        this.safeHttp = safeHttp;
    }

    login(userName: string, password: string, cancellation: Subject<void>): Observable<object> {
        const request = new LoginRequest(userName, password);

        return this.safeHttp.post(`${this.baseAddress}`, request, 'Login failed', cancellation);
    }
}
