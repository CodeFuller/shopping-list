import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {

    userName: string = '';
    password: string = '';

    loading: boolean = false;

    private returnUrl: string = '/';

    private readonly authService: AuthService;
    private readonly route: ActivatedRoute;
    private readonly router: Router;

    private unsubscribe$ = new Subject<void>();

    constructor(authService: AuthService, route: ActivatedRoute, router: Router) {
        this.authService = authService;
        this.route = route;
        this.router = router;
    }

    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    doLogin(): void {
        this.loading = true;
        this.authService
            .login(this.userName, this.password, this.unsubscribe$)
            .pipe(finalize(() => this.loading = false))
            .subscribe(() => {
                this.router.navigateByUrl(this.returnUrl);
            });
    }
}
