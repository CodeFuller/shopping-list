import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'logout',
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit, OnDestroy {

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

    doLogout(): void {
        this.loading = true;
        this.authService
            .logout(this.unsubscribe$)
            .pipe(finalize(() => this.loading = false))
            .subscribe(() => {
                this.router.navigate(['login']);
            });
    }

    cancelLogout(): void {
        this.router.navigateByUrl(this.returnUrl);
    }
}
