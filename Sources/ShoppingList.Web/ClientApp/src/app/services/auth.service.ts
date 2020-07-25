import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { SafeHttpClientService } from './safe-http-client.service';
import { LoginRequest } from '../contracts/login-request';
import { IsSignedInResponse } from '../contracts/is-signed-in-response';
import { LoginResponse } from '../contracts/login-response';

@Injectable()
export class AuthService {

    private readonly baseAddress: string = '/api/auth';

    private readonly safeHttp: SafeHttpClientService;
    private authenticated: boolean | undefined;

    constructor(safeHttp: SafeHttpClientService) {
        this.safeHttp = safeHttp;
    }

    isAuthenticated(cancellation: Subject<void>): Observable<boolean> {

        if (this.authenticated) {
            return of(this.authenticated);
        }

        return this.safeHttp
            .get(`${this.baseAddress}`, 'Failed to check sing-in status', cancellation)
            .pipe(map(response => plainToClass(IsSignedInResponse, response, { excludeExtraneousValues: true })))
            .pipe(map(response => {
                console.debug(`Result of isSignedIn request: ${response.isSignedIn}`);
                return response.isSignedIn;
            }));
    }

    login(userName: string, password: string, cancellation: Subject<void>): Observable<boolean> {
        const request = new LoginRequest(userName, password);

        return this.safeHttp
            .post<LoginResponse>(`${this.baseAddress}/login`, request, 'Login failed', cancellation)
            .pipe(map(response => {
                console.debug(`Result of login request: ${response.succeeded}`);
                this.authenticated = response.succeeded;
                return response.succeeded;
            }));
    }

    logout(cancellation: Subject<void>): Observable<void> {
        return this.safeHttp
            .post(`${this.baseAddress}/logout`, {}, 'Logout failed', cancellation)
            .pipe(map(() => {
                this.authenticated = false;
            }));
    }
}
