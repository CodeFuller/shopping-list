import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { TemplateService } from '../../services/template.service';
import { ShoppingItemModel } from '../../models/shopping-item.model';
import { EditItemsListComponent } from '../edit-items-list/edit-items-list.component';

@Component({
    selector: 'edit-template',
    templateUrl: './edit-template.component.html',
    styleUrls: ['./edit-template.component.css']
})
export class EditTemplateComponent implements OnInit {

    private readonly templateService: TemplateService;
    private readonly route: ActivatedRoute;

    private templateId: string | undefined;

    @ViewChild(EditItemsListComponent)
    private editItemsList!: EditItemsListComponent;

    constructor(templateService: TemplateService, route: ActivatedRoute) {
        this.templateService = templateService;
        this.route = route;
    }

    ngOnInit() {
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.templateId = params.get('id') || undefined;
            this.loadTemplateItems();
        });
    }

    private loadTemplateItems() {
        if (!this.templateId) {
            console.error('Template id is unknown');
            return;
        }

        this.templateService
            .getTemplateItems(this.templateId)
            .pipe(finalize(() => this.editItemsList.finishLoadingItems()))
            .subscribe(data => this.editItemsList.items = data);
    }

    onItemAdded([itemToCreate, callback, errorCallback]: [ShoppingItemModel, (createdItem: ShoppingItemModel) => void, () => void]) {
        if (!this.templateId) {
            console.error('Template id is undefined');
            return;
        }

        this.templateService
            .createTemplateItem(this.templateId, itemToCreate)
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
            .updateTemplateItem(this.templateId, itemToUpdate)
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
            .reorderTemplateItems(this.templateId, itemsOrder)
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
            .deleteTemplateItem(this.templateId, itemToDelete.id!)
            .subscribe(
                () => callback(),
                () => errorCallback());
    }
}
