import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { TemplateService } from '../../services/template.service';
import { ShoppingItemModel } from '../../models/shopping-item.model';
import { EditItemsListComponent } from '../edit-items-list/edit-items-list.component';

@Component({
    selector: 'edit-template',
    templateUrl: './edit-template.component.html',
    styleUrls: ['./edit-template.component.css']
})
export class EditTemplateComponent implements OnInit, OnDestroy {

    private readonly templateService: TemplateService;
    private readonly route: ActivatedRoute;
    private readonly titleService: Title;

    private templateId: string | undefined;

    private unsubscribe$ = new Subject<void>();

    @ViewChild(EditItemsListComponent)
    private editItemsList!: EditItemsListComponent;

    constructor(templateService: TemplateService, route: ActivatedRoute, titleService: Title) {
        this.templateService = templateService;
        this.route = route;

        this.titleService = titleService;
        this.setTitle();
    }

    ngOnInit() {
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.templateId = params.get('id') || undefined;
            this.loadTemplate();
        });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    private setTitle(templateTitle: string | undefined = undefined) {
        const templateTitlePart = templateTitle ? ` "${templateTitle}"` : '';
        const title = `Edit Shopping Template${templateTitlePart}`;
        this.titleService.setTitle(title);
    }

    private loadTemplate() {
        if (!this.templateId) {
            console.error('Template id is unknown');
            return;
        }

        this.templateService
            .getTemplate(this.templateId, this.unsubscribe$)
            .pipe(finalize(() => this.editItemsList.finishLoadingItems()))
            .subscribe(shoppingTemplate => {
                this.setTitle(shoppingTemplate.title);
                this.editItemsList.items = shoppingTemplate.items;
            });
    }

    onItemAdded([itemToCreate, callback, errorCallback]: [ShoppingItemModel, (createdItem: ShoppingItemModel) => void, () => void]) {
        if (!this.templateId) {
            console.error('Template id is undefined');
            return;
        }

        this.templateService
            .createTemplateItem(this.templateId, itemToCreate, this.unsubscribe$)
            .subscribe(
                createdItem => callback(createdItem),
                () => errorCallback());
    }

    onItemUpdated([itemToUpdate, callback, errorCallback]: [ShoppingItemModel, (updatedItem: ShoppingItemModel) => void, () => void]) {
        if (!this.templateId) {
            console.error('Template id is undefined');
            return;
        }

        this.templateService
            .updateTemplateItem(this.templateId, itemToUpdate, this.unsubscribe$)
            .subscribe(
                updatedItem => callback(updatedItem),
                () => errorCallback());
    }

    onItemsOrderChanged([orderToSet, callback, errorCallback]: [ShoppingItemModel[], (orderedItems: ShoppingItemModel[]) => void, () => void]) {
        if (!this.templateId) {
            console.error('Template id is undefined');
            return;
        }

        const itemsOrder = orderToSet.map(item => item.id!);
        this.templateService
            .reorderTemplateItems(this.templateId, itemsOrder, this.unsubscribe$)
            .subscribe(
                orderedItems => callback(orderedItems),
                () => errorCallback());
    }

    onItemDeleted([itemToDelete, callback, errorCallback]: [ShoppingItemModel, () => void, () => void]) {
        if (!this.templateId) {
            console.error('Template id is undefined');
            return;
        }

        this.templateService
            .deleteTemplateItem(this.templateId, itemToDelete.id!, this.unsubscribe$)
            .subscribe(
                () => callback(),
                () => errorCallback());
    }
}
