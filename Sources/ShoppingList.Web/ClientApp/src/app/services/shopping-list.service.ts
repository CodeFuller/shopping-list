import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { ShoppingListModel } from '../models/shopping-list.model';

@Injectable()
export class ShoppingListService {

    private http: HttpClient;

    constructor(http: HttpClient) {
        this.http = http;
    }

    getShoppingList(): Observable<ShoppingListModel> {
        // TBD: Remove hardcoded list id
        return this.http.get<ShoppingListModel>('/api/shopping-lists/12345')
            .pipe(map(response => plainToClass(ShoppingListModel, response, { excludeExtraneousValues: true })));
    }
}
