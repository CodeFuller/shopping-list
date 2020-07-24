import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {

    userName: string = '';
    password: string = '';

    authService: AuthService;

    private unsubscribe$ = new Subject<void>();

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    doLogin(): void {
        this.authService
            .login(this.userName, this.password, this.unsubscribe$)
            .subscribe();
    }
}
