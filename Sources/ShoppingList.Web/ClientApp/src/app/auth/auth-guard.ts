import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

    private readonly authService: AuthService;
    private readonly router: Router;

    private unsubscribe$ = new Subject<void>();

    constructor(authService: AuthService, router: Router) {
        this.authService = authService;
        this.router = router;
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.authService.isAuthenticated(this.unsubscribe$)
            .pipe(map(result => {
                if (!result) {
                    this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
                }
                return result;
            }));
    }
}
