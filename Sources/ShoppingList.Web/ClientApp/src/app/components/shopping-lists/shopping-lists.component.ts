import { Component, OnInit } from '@angular/core';
import { ShoppingListService } from '../../services/shopping-list.service';
import { ShoppingListModel } from '../../models/shopping-list.model';

@Component({
    selector: 'app-shopping-lists',
    templateUrl: './shopping-lists.component.html',
    styleUrls: ['./shopping-lists.component.css']
})
export class ShoppingListsComponent implements OnInit {

    private readonly shoppingListService: ShoppingListService;

    shoppingLists: ShoppingListModel[] | undefined;

    constructor(shoppingListService: ShoppingListService) {
        this.shoppingListService = shoppingListService;
    }

    ngOnInit() {
        this.loadShoppingLists();
    }

    private loadShoppingLists() {
        this.shoppingListService.getShoppingLists()
            .subscribe((data: ShoppingListModel[]) => this.shoppingLists = data);
    }
}
