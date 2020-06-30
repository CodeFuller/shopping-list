import { Component, OnInit } from '@angular/core';
import { ShoppingListService } from '../../services/shopping-list.service';
import { ShoppingListModel } from '../../models/shopping-list.model';
import { DialogService } from '../../services/dialog.service';

@Component({
    selector: 'app-shopping-lists',
    templateUrl: './shopping-lists.component.html',
    styleUrls: ['./shopping-lists.component.css']
})
export class ShoppingListsComponent implements OnInit {

    private readonly shoppingListService: ShoppingListService;
    private readonly dialogService: DialogService;

    shoppingLists: ShoppingListModel[] | undefined;

    constructor(shoppingListService: ShoppingListService, dialogService: DialogService) {
        this.shoppingListService = shoppingListService;
        this.dialogService = dialogService;
    }

    ngOnInit() {
        this.loadShoppingLists();
    }

    private loadShoppingLists() {
        this.shoppingListService.getShoppingLists()
            .subscribe(
                data => this.shoppingLists = data,
                error => this.dialogService.showError(error).subscribe());
    }
}
