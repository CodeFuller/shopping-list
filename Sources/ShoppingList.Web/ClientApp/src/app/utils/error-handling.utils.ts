import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export function handleError<T>(operationError: string): (source: Observable<T>) => Observable<T> {
    return (source: Observable<T>) => source.pipe(catchError(error => handleHttpError(operationError, error)));
}

function handleHttpError(operationMessage: string, error: HttpErrorResponse): Observable<never> {
    let errorDetails: string;
    if (error.error instanceof ErrorEvent) {
        errorDetails = 'Client-side error has occurred.';
    } else {
        errorDetails = 'Server-side error has occurred.';
    }

    return throwError(`${operationMessage}. ${errorDetails}`);
};
