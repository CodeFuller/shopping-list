import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { ShoppingTemplateModel } from '../models/shopping-template.model';
import { ShoppingListModel } from '../models/shopping-list.model';
import { CreateShoppingListRequest } from '../contracts/create-shopping-list.request';
import { ShoppingItemModel } from '../models/shopping-item.model';
import { SafeHttpClientService } from './safe-http-client.service';

@Injectable()
export class ShoppingListService {

    private readonly baseAddress: string = '/api/shopping-lists';

    private readonly safeHttp: SafeHttpClientService;

    constructor(safeHttp: SafeHttpClientService) {
        this.safeHttp = safeHttp;
    }

    createShoppingList(template: ShoppingTemplateModel, cancellation: Subject<void>): Observable<ShoppingListModel> {
        const request = new CreateShoppingListRequest(template.id);

        return this.safeHttp.post(`${this.baseAddress}`, request, 'Failed to create shopping list', cancellation)
            .pipe(map(response => plainToClass(ShoppingListModel, response, { excludeExtraneousValues: true })));
    }

    getShoppingLists(cancellation: Subject<void>): Observable<ShoppingListModel[]> {
        return this.safeHttp.get<Object[]>(`${this.baseAddress}`, 'Failed to load shopping lists', cancellation)
            .pipe(map(response => plainToClass(ShoppingListModel, response, { excludeExtraneousValues: true })));
    }

    createShoppingListItem(shoppingListId: string, newItem: ShoppingItemModel, cancellation: Subject<void>): Observable<ShoppingItemModel> {
        return this.safeHttp.post(`${this.baseAddress}/${shoppingListId}/items`, newItem, 'Failed to create list item', cancellation)
            .pipe(map(response => plainToClass(ShoppingItemModel, response, { excludeExtraneousValues: true })));
    }

    getShoppingListItems(shoppingListId: string, cancellation: Subject<void>): Observable<ShoppingItemModel[]> {
        return this.safeHttp.get<Object[]>(`${this.baseAddress}/${shoppingListId}/items`, 'Failed to load list items', cancellation)
            .pipe(map(response => plainToClass(ShoppingItemModel, response, { excludeExtraneousValues: true })));
    }

    updateShoppingListItem(shoppingListId: string, item: ShoppingItemModel, cancellation: Subject<void>): Observable<ShoppingItemModel> {
        return this.safeHttp.put(`${this.baseAddress}/${shoppingListId}/items/${item.id}`, item, 'Failed to update list item', cancellation)
            .pipe(map(response => plainToClass(ShoppingItemModel, response, { excludeExtraneousValues: true })));
    }

    reorderShoppingListItems(shoppingListId: string, newItemsOrder: string[], cancellation: Subject<void>): Observable<ShoppingItemModel[]> {
        return this.safeHttp.patch<Object[]>(`${this.baseAddress}/${shoppingListId}/items`, newItemsOrder, 'Failed to change order of list items', cancellation)
            .pipe(map(response => plainToClass(ShoppingItemModel, response, { excludeExtraneousValues: true })));
    }

    deleteShoppingListItem(shoppingListId: string, itemId: string, cancellation: Subject<void>): Observable<object> {
        return this.safeHttp.delete(`${this.baseAddress}/${shoppingListId}/items/${itemId}`, 'Failed to delete list item', cancellation);
    }
}
