import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { UserModel } from '../models/user.model';
import { SafeHttpClientService } from './safe-http-client.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private readonly baseAddress: string = '/api/users';

    private readonly safeHttp: SafeHttpClientService;

    constructor(safeHttp: SafeHttpClientService) {
        this.safeHttp = safeHttp;
    }

    getUsers(cancellation: Subject<void>): Observable<UserModel[]> {
        return this.safeHttp.get<Object[]>(`${this.baseAddress}`, 'Failed to load list of users', cancellation)
            .pipe(map(response => plainToClass(UserModel, response, { excludeExtraneousValues: true })));
    }
}
