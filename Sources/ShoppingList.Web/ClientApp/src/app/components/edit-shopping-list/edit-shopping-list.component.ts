import { Component, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
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
    private readonly titleService: Title;

    private shoppingListId: string | undefined;

    @ViewChild(EditItemsListComponent)
    private editItemsList!: EditItemsListComponent;

    private unsubscribe$ = new Subject<void>();

    constructor(shoppingListService: ShoppingListService, route: ActivatedRoute, titleService: Title) {
        this.shoppingListService = shoppingListService;
        this.route = route;

        this.titleService = titleService;
        this.setTitle();
    }

    ngAfterViewInit() {
        this.loadShoppingListFromRouteOrServer()
            // Preventing error "Expression has changed after it was checked"
            .pipe(delay(0))
            .pipe(finalize(() => this.editItemsList.finishLoadingItems()))
            .subscribe(shoppingList => {
                this.setTitle(shoppingList.title);
                this.editItemsList.items = shoppingList.items;
            });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    private setTitle(shoppingListTitle: string | undefined = undefined) {
        const listTitlePart = shoppingListTitle ? ` "${shoppingListTitle}"` : '';
        const title = `Edit Shopping List${listTitlePart}`;
        this.titleService.setTitle(title);
    }

    private loadShoppingListFromRouteOrServer(): Observable<ShoppingListModel> {
        return this.route.paramMap
            .pipe(take(1))
            .pipe(switchMap((params: ParamMap) => {
                const shoppingListFromRouting: ShoppingListModel = window.history.state;
                if (shoppingListFromRouting.id) {
                    console.debug('Got shopping list from the routing state');
                    this.shoppingListId = shoppingListFromRouting.id;
                    return from([shoppingListFromRouting]);
                }

                this.shoppingListId = params.get('id') || undefined;
                if (!this.shoppingListId) {
                    console.error('Shopping list id is unknown');
                    throw 'Shopping list id is unknown';
                }

                console.debug('Loading shopping list from the server ...');
                return this.shoppingListService.getShoppingList(this.shoppingListId, this.unsubscribe$);
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
