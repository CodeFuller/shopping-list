import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TemplateService } from '../../services/template.service';
import { ShoppingItemModel } from '../../models/shopping-item.model';
import { EditItemsListComponent } from '../edit-items-list/edit-items-list.component';
import { DialogService } from '../../services/dialog.service';

@Component({
    selector: 'edit-template',
    templateUrl: './edit-template.component.html',
    styleUrls: ['./edit-template.component.css']
})
export class EditTemplateComponent implements OnInit {

    private readonly templateService: TemplateService;
    private readonly dialogService: DialogService;
    private readonly route: ActivatedRoute;

    private templateId: string | undefined;

    @ViewChild(EditItemsListComponent)
    private editItemsList!: EditItemsListComponent;

    constructor(templateService: TemplateService, dialogService: DialogService, route: ActivatedRoute) {
        this.templateService = templateService;
        this.dialogService = dialogService;
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
            .subscribe(
                data => this.editItemsList.items = data,
                error => this.dialogService.showError(error).subscribe());
    }

    onItemAdded([itemToCreate, callback]: [ShoppingItemModel, (createdItem: ShoppingItemModel) => void]) {
        if (!this.templateId) {
            console.error('Template id is undefined');
            return;
        }

        this.templateService
            .createTemplateItem(this.templateId, itemToCreate)
            .subscribe(
                createdItem => callback(createdItem),
                error => this.dialogService.showError(error).subscribe());
    }

    onItemUpdated([itemToUpdate, callback]: [ShoppingItemModel, (updatedItem: ShoppingItemModel) => void]) {
        if (!this.templateId) {
            console.error('Template id is undefined');
            return;
        }

        this.templateService
            .updateTemplateItem(this.templateId, itemToUpdate)
            .subscribe(
                updatedItem => callback(updatedItem),
                error => this.dialogService.showError(error).subscribe());
    }

    onItemsOrderChanged([orderToSet, callback]: [ShoppingItemModel[], (orderedItems: ShoppingItemModel[]) => void]) {
        if (!this.templateId) {
            console.error('Template id is undefined');
            return;
        }

        const itemsOrder = orderToSet.map(item => item.id!);
        this.templateService
            .reorderTemplateItems(this.templateId, itemsOrder)
            .subscribe(
                orderedItems => callback(orderedItems),
                error => this.dialogService.showError(error).subscribe());
    }

    onItemDeleted([itemToDelete, callback]: [ShoppingItemModel, () => void]) {
        if (!this.templateId) {
            console.error('Template id is undefined');
            return;
        }

        this.templateService
            .deleteTemplateItem(this.templateId, itemToDelete.id!)
            .subscribe(
                () => callback(),
                error => this.dialogService.showError(error).subscribe());
    }
}
