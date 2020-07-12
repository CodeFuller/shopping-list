import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ShoppingListService } from '../../services/shopping-list.service';
import { ShoppingListModel } from '../../models/shopping-list.model';

@Component({
    selector: 'app-shopping-lists',
    templateUrl: './shopping-lists.component.html',
    styleUrls: ['./shopping-lists.component.css']
})
export class ShoppingListsComponent implements OnInit, OnDestroy {

    private readonly shoppingListService: ShoppingListService;

    shoppingLists: ShoppingListModel[] | undefined;
    loadingShoppingLists: boolean = false;

    private unsubscribe$ = new Subject<void>();

    constructor(shoppingListService: ShoppingListService) {
        this.shoppingListService = shoppingListService;
    }

    ngOnInit() {
        this.loadShoppingLists();
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    private loadShoppingLists() {
        this.loadingShoppingLists = true;
        this.shoppingListService.getShoppingLists(this.unsubscribe$)
            .pipe(finalize(() => this.loadingShoppingLists = false))
            .subscribe(data => this.shoppingLists = data);
    }
}
