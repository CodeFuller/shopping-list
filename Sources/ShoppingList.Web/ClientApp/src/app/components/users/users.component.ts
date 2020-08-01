import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { UserModel } from '../../models/user.model';

@Component({
    selector: 'users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

    private readonly userService: UserService;

    users: UserModel[] = [];
    loadingUsers: boolean = false;
    inProgressUserId: string | null = null;

    private unsubscribe$ = new Subject<void>();

    constructor(userService: UserService, titleService: Title) {
        this.userService = userService;

        titleService.setTitle('Manager Users');
    }

    ngOnInit() {
        this.loadUsers();
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    private loadUsers() {
        this.loadingUsers = true;
        this.userService.getUsers(this.unsubscribe$)
            .pipe(finalize(() => this.loadingUsers = false))
            .subscribe(data => this.users = data);
    }
}
