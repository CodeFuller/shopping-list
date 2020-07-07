import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ErrorHandlingService } from './error-handling.service';

@Injectable({
    providedIn: 'root'
})
export class SafeHttpClientService {

    private readonly http: HttpClient;
    private readonly errorHandlingService: ErrorHandlingService;

    constructor(http: HttpClient, errorHandlingService: ErrorHandlingService) {
        this.http = http;
        this.errorHandlingService = errorHandlingService;
    }

    get<T>(url: string, errorMessage: string): Observable<T> {
        return this.http.get<T>(url)
            .pipe(this.errorHandlingService.handleHttpError(errorMessage));
    }

    post<T>(url: string, body: any, errorMessage: string): Observable<T> {
        return this.http.post<T>(url, body)
            .pipe(this.errorHandlingService.handleHttpError(errorMessage));
    }

    put<T>(url: string, body: any, errorMessage: string): Observable<T> {
        return this.http.put<T>(url, body)
            .pipe(this.errorHandlingService.handleHttpError(errorMessage));
    }

    patch<T>(url: string, body: any, errorMessage: string): Observable<T> {
        return this.http.patch<T>(url, body)
            .pipe(this.errorHandlingService.handleHttpError(errorMessage));
    }

    delete<T>(url: string, errorMessage: string): Observable<T> {
        return this.http.delete<T>(url)
            .pipe(this.errorHandlingService.handleHttpError(errorMessage));
    }
}
