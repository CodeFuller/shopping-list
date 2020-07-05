import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DialogService } from './dialog.service';

@Injectable({
    providedIn: 'root'
})
export class ErrorHandlingService {

    private readonly dialogService: DialogService;

    constructor(dialogService: DialogService) {
        this.dialogService = dialogService;
    }

    handleHttpError<T>(operationError: string): (source: Observable<T>) => Observable<T> {
        return (source: Observable<T>) => {
            return source.pipe(catchError(error => this.handleHttpErrorResponse(operationError, error)));
        };
    }

    private handleHttpErrorResponse(operationMessage: string, error: HttpErrorResponse): Observable<never> {
        const errorMessage = this.buildErrorMessage(operationMessage, error);

        return this.dialogService.showError(errorMessage)
            .pipe(map(() => {
                throw new Error(errorMessage);
            }));
    };

    private buildErrorMessage(operationMessage: string, error: HttpErrorResponse): string {
        let errorDetails: string;
        if (error.error instanceof ErrorEvent) {
            errorDetails = 'Client-side error has occurred.';
        } else {
            errorDetails = 'Server-side error has occurred.';
        }

        return `${operationMessage}. ${errorDetails}`;
    }
}
