import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogResult } from '../../constants/dialog-result';

@Component({
    selector: 'error-message-box',
    templateUrl: './error-message-box.component.html',
    styleUrls: ['./error-message-box.component.css']
})
export class ErrorMessageBoxComponent {

    private readonly activeModal: NgbActiveModal;

    @Input() errorMessage!: string;

    constructor(activeModal: NgbActiveModal) {
        this.activeModal = activeModal;
    }

    close() {
        this.activeModal.close(DialogResult.ok);
    }
}
