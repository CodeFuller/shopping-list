import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

    userName: string = '';
    password: string = '';

    loading: boolean = false;
    loginFailed: boolean = false;

    private returnUrl: string = '/';

    private readonly authService: AuthService;
    private readonly route: ActivatedRoute;
    private readonly router: Router;

    private unsubscribe$ = new Subject<void>();

    constructor(authService: AuthService, route: ActivatedRoute, router: Router, titleService: Title) {
        this.authService = authService;
        this.route = route;
        this.router = router;

        titleService.setTitle('Login');
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
        this.loginFailed = false;
        this.authService
            .login(this.userName, this.password, this.unsubscribe$)
            .pipe(finalize(() => this.loading = false))
            .subscribe(loginSucceeded => {
                this.loginFailed = !loginSucceeded;
                if (loginSucceeded) {
                    this.router.navigateByUrl(this.returnUrl);
                }
            });
    }
}
