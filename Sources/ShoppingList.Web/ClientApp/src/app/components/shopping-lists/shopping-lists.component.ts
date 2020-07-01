import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
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
    loadingShoppingLists: boolean = false;

    constructor(shoppingListService: ShoppingListService) {
        this.shoppingListService = shoppingListService;
    }

    ngOnInit() {
        this.loadShoppingLists();
    }

    private loadShoppingLists() {
        this.loadingShoppingLists = true;
        this.shoppingListService.getShoppingLists()
            .pipe(finalize(() => this.loadingShoppingLists = false))
            .subscribe(data => this.shoppingLists = data);
    }
}
