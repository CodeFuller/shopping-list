import { Component, OnInit } from '@angular/core';
import { ShoppingListService } from 'src/app/services/shopping-list.service';
import { ShoppingListModel } from 'src/app/models/shopping-list.model';

@Component({
    selector: 'app-shopping-list',
    templateUrl: './shopping-list.component.html',
    styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {

    public listData: ShoppingListModel | undefined;
    shoppingListService: ShoppingListService;

    constructor(shoppingListService: ShoppingListService) {
        this.shoppingListService = shoppingListService;
    }

    ngOnInit() {
        this.shoppingListService.getShoppingList()
          .subscribe((data: ShoppingListModel) => this.listData = data);
    }
}
