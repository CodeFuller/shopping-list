import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { SafeHttpClientService } from './safe-http-client.service';
import { LoginRequest } from '../contracts/login-request';
import { IsLoggedInResponse } from '../contracts/is-logged-in-response';
import { LoginResponse } from '../contracts/login-response';

@Injectable()
export class AuthService {

    private readonly baseAddress: string = '/api/auth';

    private readonly safeHttp: SafeHttpClientService;
    private loggedIn: boolean | undefined;

    constructor(safeHttp: SafeHttpClientService) {
        this.safeHttp = safeHttp;
    }

    isLoggedIn(cancellation: Subject<void>): Observable<boolean> {

        if (this.loggedIn !== undefined) {
            return of(this.loggedIn);
        }

        return this.safeHttp
            .get(`${this.baseAddress}`, 'Failed to check sing-in status', cancellation)
            .pipe(map(response => plainToClass(IsLoggedInResponse, response, { excludeExtraneousValues: true })))
            .pipe(map(response => {
                console.debug(`Result of isLoggedIn request: ${response.isLoggedIn}`);
                this.loggedIn = response.isLoggedIn;
                return response.isLoggedIn;
            }));
    }

    login(userName: string, password: string, cancellation: Subject<void>): Observable<boolean> {
        const request = new LoginRequest(userName, password);

        return this.safeHttp
            .post<LoginResponse>(`${this.baseAddress}/login`, request, 'Login failed', cancellation)
            .pipe(map(response => {
                console.debug(`Result of login request: ${response.succeeded}`);
                this.loggedIn = response.succeeded;
                return response.succeeded;
            }));
    }

    logout(cancellation: Subject<void>): Observable<void> {
        return this.safeHttp
            .post(`${this.baseAddress}/logout`, {}, 'Logout failed', cancellation)
            .pipe(map(() => {
                this.loggedIn = false;
            }));
    }
}
