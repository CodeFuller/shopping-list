import { Component, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, Subject, from } from 'rxjs';
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
export class EditShoppingListComponent implements AfterViewInit, OnDestroy {

    private readonly shoppingListService: ShoppingListService;
    private readonly route: ActivatedRoute;

    private shoppingListId: string | undefined;

    @ViewChild(EditItemsListComponent)
    private editItemsList!: EditItemsListComponent;

    private unsubscribe$ = new Subject<void>();

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

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    private loadItemsFromRouteOrServer(): Observable<ShoppingItemModel[]> {
        return this.route.paramMap
            .pipe(take(1))
            .pipe(switchMap((params: ParamMap) => {
                const shoppingListFromRouting: ShoppingListModel = window.history.state;
                if (shoppingListFromRouting.items) {
                    console.debug('Got list items from the routing state');
                    this.shoppingListId = shoppingListFromRouting.id;
                    return from([shoppingListFromRouting.items]);
                }

                this.shoppingListId = params.get('id') || undefined;
                if (!this.shoppingListId) {
                    console.error('Shopping list id is unknown');
                    throw 'Shopping list id is unknown';
                }

                console.debug('Getting list items from the server ...');
                return this.shoppingListService.getShoppingListItems(this.shoppingListId, this.unsubscribe$);
            }));
    }

    onItemAdded([itemToCreate, callback, errorCallback]: [ShoppingItemModel, (createdItem: ShoppingItemModel) => void, () => void]) {
        if (!this.shoppingListId) {
            console.error('Shopping list id is undefined');
            return;
        }

        this.shoppingListService
            .createShoppingListItem(this.shoppingListId, itemToCreate, this.unsubscribe$)
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
            .updateShoppingListItem(this.shoppingListId, itemToUpdate, this.unsubscribe$)
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
            .reorderShoppingListItems(this.shoppingListId, itemsOrder, this.unsubscribe$)
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
            .deleteShoppingListItem(this.shoppingListId, itemToDelete.id!, this.unsubscribe$)
            .subscribe(
                () => callback(),
                () => errorCallback());
    }
}
