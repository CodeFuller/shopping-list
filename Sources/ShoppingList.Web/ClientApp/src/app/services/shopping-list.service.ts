import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { ShoppingTemplateModel } from '../models/shopping-template.model';
import { ShoppingListModel } from '../models/shopping-list.model';
import { CreateShoppingListRequest } from '../contracts/create-shopping-list.request';
import { ShoppingItemModel } from '../models/shopping-item.model';
import { handleError } from '../utils/error-handling.utils';

@Injectable()
export class ShoppingListService {

    private readonly baseAddress: string = '/api/shopping-lists';

    private readonly http: HttpClient;

    constructor(http: HttpClient) {
        this.http = http;
    }

    createShoppingList(template: ShoppingTemplateModel): Observable<ShoppingListModel> {
        const request = new CreateShoppingListRequest(template.id);

        return this.http.post(`${this.baseAddress}`, request)
            .pipe(handleError('Failed to create shopping list'))
            .pipe(map(response => plainToClass(ShoppingListModel, response, { excludeExtraneousValues: true })));
    }

    getShoppingLists(): Observable<ShoppingListModel[]> {
        return this.http.get<Object[]>(`${this.baseAddress}`)
            .pipe(handleError('Failed to load shopping lists'))
            .pipe(map(response => plainToClass(ShoppingListModel, response, { excludeExtraneousValues: true })));
    }

    createShoppingListItem(shoppingListId: string, newItem: ShoppingItemModel): Observable<ShoppingItemModel> {
        return this.http.post(`${this.baseAddress}/${shoppingListId}/items`, newItem)
            .pipe(handleError('Failed to create list item'))
            .pipe(map(response => plainToClass(ShoppingItemModel, response, { excludeExtraneousValues: true })));
    }

    getShoppingListItems(shoppingListId: string): Observable<ShoppingItemModel[]> {
        return this.http.get<Object[]>(`${this.baseAddress}/${shoppingListId}/items`)
            .pipe(handleError('Failed to load list items'))
            .pipe(map(response => plainToClass(ShoppingItemModel, response, { excludeExtraneousValues: true })));
    }

    updateShoppingListItem(shoppingListId: string, item: ShoppingItemModel): Observable<ShoppingItemModel> {
        return this.http.put(`${this.baseAddress}/${shoppingListId}/items/${item.id}`, item)
            .pipe(handleError('Failed to update list item'))
            .pipe(map(response => plainToClass(ShoppingItemModel, response, { excludeExtraneousValues: true })));
    }

    reorderShoppingListItems(shoppingListId: string, newItemsOrder: string[]): Observable<ShoppingItemModel[]> {
        return this.http.patch<Object[]>(`${this.baseAddress}/${shoppingListId}/items`, newItemsOrder)
            .pipe(handleError('Failed to change order of list items'))
            .pipe(map(response => plainToClass(ShoppingItemModel, response, { excludeExtraneousValues: true })));
    }

    deleteShoppingListItem(shoppingListId: string, itemId: string): Observable<object> {
        return this.http.delete(`${this.baseAddress}/${shoppingListId}/items/${itemId}`)
            .pipe(handleError('Failed to delete list item'));
    }
}
