import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { take, finalize, switchMap } from 'rxjs/operators';
import { ShoppingListService } from '../../services/shopping-list.service';
import { ShoppingItemModel } from '../../models/shopping-item.model';

@Component({
    selector: 'print-shopping-list',
    templateUrl: './print-shopping-list.component.html',
    styleUrls: ['./print-shopping-list.component.css']
})
export class PrintShoppingListComponent implements OnInit {

    private readonly shoppingListService: ShoppingListService;
    private readonly route: ActivatedRoute;
    private readonly titleService: Title;

    items: ShoppingItemModel[] = [];

    get items1(): ShoppingItemModel[] {
        return this.items.slice(0, this.firstIndexOfSecondList());
    }

    get items2(): ShoppingItemModel[] {
        return this.items.slice(this.firstIndexOfSecondList());
    }

    loading: boolean = false;

    private unsubscribe$ = new Subject<void>();

    constructor(shoppingListService: ShoppingListService, route: ActivatedRoute, titleService: Title) {
        this.shoppingListService = shoppingListService;
        this.route = route;

        this.titleService = titleService;
        this.setTitle();
    }

    ngOnInit() {
        this.loading = true;
        this.route.paramMap
            .pipe(take(1))
            .pipe(switchMap((params: ParamMap) => {
                const shoppingListId = params.get('id') || undefined;
                if (!shoppingListId) {
                    console.error('Shopping list id is unknown');
                    throw 'Shopping list id is unknown';
                }
                return this.shoppingListService.getShoppingList(shoppingListId, this.unsubscribe$);
            }))
            .pipe(finalize(() => this.loading = false))
            .subscribe(shoppingList => {
                this.setTitle(shoppingList.title);
                this.items = shoppingList.items;
            });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    private firstIndexOfSecondList(): number {
        return Math.ceil(this.items.length / 2);
    }

    private setTitle(shoppingListTitle: string | undefined = undefined) {
        const listTitlePart = shoppingListTitle ? ` "${shoppingListTitle}"` : '';
        const title = `Print Shopping List${listTitlePart}`;
        this.titleService.setTitle(title);
    }

    getItemTitle(item: ShoppingItemModel): string {
        let title = item.title;

        if (item.quantity) {
            title = title.concat(` (${item.quantity})`);
        }

        if (item.comment) {
            title = title.concat(` /* ${item.comment} */`);
        }

        return title;
    }

    print() {
        window.print();
    }
}
