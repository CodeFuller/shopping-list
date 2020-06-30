import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, from } from 'rxjs';
import { ErrorMessageBoxComponent } from '../components/error-message-box/error-message-box.component';
import { DialogResult } from '../constants/dialog-result';

@Injectable({
    providedIn: 'root'
})
export class DialogService {

    private readonly modalService: NgbModal;

    constructor(modalService: NgbModal) {
        this.modalService = modalService;
    }

    showError(errorMessage: string): Observable<DialogResult> {
        const modalRef = this.modalService.open(ErrorMessageBoxComponent, { centered: true });
        modalRef.componentInstance.errorMessage = errorMessage;

        const promise = modalRef.result.then((result: DialogResult) => {
            return result;
        }, () => {
            return DialogResult.cancel;
        });

        return from(promise);
    }
}
