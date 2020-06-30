import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ShoppingListService } from '../../services/shopping-list.service';
import { ShoppingItemModel } from '../../models/shopping-item.model';
import { EditItemsListComponent } from '../edit-items-list/edit-items-list.component';
import { DialogService } from '../../services/dialog.service';

@Component({
    selector: 'edit-shopping-list',
    templateUrl: './edit-shopping-list.component.html',
    styleUrls: ['./edit-shopping-list.component.css']
})
export class EditShoppingListComponent implements OnInit {

    private readonly shoppingListService: ShoppingListService;
    private readonly dialogService: DialogService;
    private readonly route: ActivatedRoute;

    private shoppingListId: string | undefined;

    @ViewChild(EditItemsListComponent)
    private editItemsList!: EditItemsListComponent;

    constructor(shoppingListService: ShoppingListService, dialogService: DialogService, route: ActivatedRoute) {
        this.shoppingListService = shoppingListService;
        this.dialogService = dialogService;
        this.route = route;
    }

    ngOnInit() {
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.shoppingListId = params.get('id') || undefined;
            this.loadTemplateItems();
        });
    }

    private loadTemplateItems() {
        if (!this.shoppingListId) {
            console.error('Shopping list id is unknown');
            return;
        }

        this.shoppingListService
            .getShoppingListItems(this.shoppingListId)
            .subscribe(
                data => this.editItemsList.items = data,
                error => this.dialogService.showError(error).subscribe());
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
                error => {
                    this.dialogService.showError(error).subscribe();
                    errorCallback();
                });
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
                error => {
                    this.dialogService.showError(error).subscribe();
                    errorCallback();
                });
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
                error => {
                    this.dialogService.showError(error).subscribe();
                    errorCallback();
                });
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
                error => {
                    this.dialogService.showError(error).subscribe();
                    errorCallback();
                });
    }
}
