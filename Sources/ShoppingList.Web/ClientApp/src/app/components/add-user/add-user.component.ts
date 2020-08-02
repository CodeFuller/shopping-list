import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'add-user',
    templateUrl: './add-user.component.html',
    styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {

    private readonly userService: UserService;
    private readonly router: Router;
    private readonly unsubscribe$ = new Subject<void>();

    userName: string = '';
    password: string = '';
    confirmPassword: string = '';
    loading: boolean = false;

    constructor(userService: UserService, router: Router, titleService: Title) {
        this.userService = userService;
        this.router = router;

        titleService.setTitle('Create User');
    }

    createUser() {
        this.loading = true;
        this.userService.createUser(this.userName, this.password, this.unsubscribe$)
            .pipe(finalize(() => this.loading = false))
            .subscribe(() => this.router.navigate(['/users']));
    }
}
