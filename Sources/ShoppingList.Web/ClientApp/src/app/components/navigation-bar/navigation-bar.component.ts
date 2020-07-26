import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'navigation-bar',
    templateUrl: './navigation-bar.component.html',
    styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent {

    private readonly authService: AuthService;
    private readonly router: Router;

    private unsubscribe$ = new Subject<void>();

    get isLoggedIn(): Observable<boolean> {
        return this.authService.isLoggedIn(this.unsubscribe$);
    }

    get currentUrl(): string {
        return this.router.url;
    }

    constructor(authService: AuthService, router: Router) {
        this.authService = authService;
        this.router = router;
    }
}
