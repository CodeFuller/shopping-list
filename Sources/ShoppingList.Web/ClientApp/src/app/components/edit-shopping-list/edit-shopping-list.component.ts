import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, from } from 'rxjs';
import { take, finalize, delay, switchMap } from 'rxjs/operators';
import { ShoppingListService } from '../../services/shopping-list.service';
import { ShoppingItemModel } from '../../models/shopping-item.model';
import { EditItemsListComponent } from '../edit-items-list/edit-items-list.component';
import { ShoppingListModel } from '../../models/shopping-list.model';

@Component({
    selector: 'edit-shopping-list',
    templateUrl: './edit-shopping-list.component.html',
    styleUrls: ['./edit-shopping-list.component.css']
})
export class EditShoppingListComponent implements AfterViewInit {

    private readonly shoppingListService: ShoppingListService;
    private readonly route: ActivatedRoute;

    private shoppingListId: string | undefined;

    @ViewChild(EditItemsListComponent)
    private editItemsList!: EditItemsListComponent;

    constructor(shoppingListService: ShoppingListService, route: ActivatedRoute) {
        this.shoppingListService = shoppingListService;
        this.route = route;
    }

    ngAfterViewInit() {
        this.loadItemsFromRouteOrServer()
            // Preventing error "Expression has changed after it was checked"
            .pipe(delay(0))
            .pipe(finalize(() => this.editItemsList.finishLoadingItems()))
            .subscribe(items => this.editItemsList.items = items);
    }

    private loadItemsFromRouteOrServer(): Observable<ShoppingItemModel[]> {
        return this.route.paramMap
            .pipe(take(1))
            .pipe(switchMap((params: ParamMap) => {
                const shoppingListFromRouting: ShoppingListModel = window.history.state;
                if (shoppingListFromRouting.items) {
                    console.debug('Got list items from the routing state');
                    return from([shoppingListFromRouting.items]);
                }

                const listId = params.get('id');
                if (!listId) {
                    console.error('Shopping list id is unknown');
                    throw 'Shopping list id is unknown';
                }

                console.debug('Getting list items from the server ...');
                return this.shoppingListService.getShoppingListItems(listId);
            }));
    }

    onItemAdded([itemToCreate, callback, errorCallback]: [ShoppingItemModel, (createdItem: ShoppingItemModel) => void, () => void]) {
        if (!this.shoppingListId) {
            console.error('Shopping list id is undefined');
            return;
        }

        this.shoppingListService
            .createShoppingListItem(this.shoppingListId, itemToCreate)
            .subscribe(
                createdItem => callback(createdItem),
                () => errorCallback());
    }

    onItemUpdated([itemToUpdate, callback, errorCallback]: [ShoppingItemModel, (updatedItem: ShoppingItemModel) => void, () => void]) {
        if (!this.shoppingListId) {
            console.error('Shopping list id is undefined');
            return;
        }

        this.shoppingListService
            .updateShoppingListItem(this.shoppingListId, itemToUpdate)
            .subscribe(
                updatedItem => callback(updatedItem),
                () => errorCallback());
    }

    onItemsOrderChanged([orderToSet, callback, errorCallback]: [ShoppingItemModel[], (orderedItems: ShoppingItemModel[]) => void, () => void]) {
        if (!this.shoppingListId) {
            console.error('Shopping list id is undefined');
            return;
        }

        const itemsOrder = orderToSet.map(item => item.id!);
        this.shoppingListService
            .reorderShoppingListItems(this.shoppingListId, itemsOrder)
            .subscribe(
                orderedItems => callback(orderedItems),
                () => errorCallback());
    }

    onItemDeleted([itemToDelete, callback, errorCallback]: [ShoppingItemModel, () => void, () => void]) {
        if (!this.shoppingListId) {
            console.error('Shopping list id is undefined');
            return;
        }

        this.shoppingListService
            .deleteShoppingListItem(this.shoppingListId, itemToDelete.id!)
            .subscribe(
                () => callback(),
                () => errorCallback());
    }
}
