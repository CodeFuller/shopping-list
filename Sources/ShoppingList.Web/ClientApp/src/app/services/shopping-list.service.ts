import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { ShoppingListModel } from '../models/shopping-list.model';
import { TemplateModel } from '../models/template.model';
import { CreateShoppingListRequest } from '../contracts/create-shopping-list.request';

@Injectable()
export class ShoppingListService {
    private readonly http: HttpClient;

    constructor(http: HttpClient) {
        this.http = http;
    }

    getShoppingLists(): Observable<ShoppingListModel[]> {
        return this.http.get<Object[]>('/api/shopping-lists')
            .pipe(map(response => plainToClass(ShoppingListModel, response, { excludeExtraneousValues: true })));
    }

    getShoppingList(): Observable<ShoppingListModel> {
        // TBD: Remove hardcoded list id
        return this.http.get<ShoppingListModel>('/api/shopping-lists/12345')
            .pipe(map(response => plainToClass(ShoppingListModel, response, { excludeExtraneousValues: true })));
    }

    createShoppingList(template: TemplateModel): Observable<ShoppingListModel> {
        const request = new CreateShoppingListRequest(template.id);

        return this.http.post(`/api/shopping-lists`, request)
            .pipe(map(response => plainToClass(ShoppingListModel, response, { excludeExtraneousValues: true })));
    }
}
