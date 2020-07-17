import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
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

    shoppingLists: ShoppingListModel[] = [];
    loadingShoppingLists: boolean = false;
    inProgressShoppingListId: string | null = null;

    private unsubscribe$ = new Subject<void>();

    constructor(shoppingListService: ShoppingListService, titleService: Title) {
        this.shoppingListService = shoppingListService;

        titleService.setTitle('All Shopping Lists');
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

    deleteShoppingList(shoppingList: ShoppingListModel) {
        this.inProgressShoppingListId = shoppingList.id;
        this.shoppingListService.deleteShoppingList(shoppingList.id, this.unsubscribe$)
            .pipe(finalize(() => this.inProgressShoppingListId = null))
            .subscribe(
                () => {
                    this.shoppingLists = this.shoppingLists.filter(x => x.id !== shoppingList.id);
                });
    }
}
