import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TemplateService } from 'src/app/services/template.service';
import { TemplateItemModel } from 'src/app/models/template-item.model';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-edit-template',
    templateUrl: './edit-template.component.html',
    styleUrls: ['./edit-template.component.css']
})
export class EditTemplateComponent implements OnInit {

    public templateId: string | undefined;
    public items: TemplateItemModel[] = [];

    public newItemTitle = '';
    public itemUnderEdit: TemplateItemModel | undefined;

    public editItemFormGroup: FormGroup | undefined;

    constructor(private templateService: TemplateService, private route: ActivatedRoute, private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.templateId = params.get('id') || undefined;
            this.loadTemplateItems();
        });
    }

    onAddItem() {
        if (!this.templateId) {
            console.error('Template id is undefined');
            return;
        }

        const newItem = new TemplateItemModel();
        newItem.title = this.newItemTitle;

        this.templateService.createTemplateItem(this.templateId, newItem).subscribe(() => {
            this.newItemTitle = '';
            this.loadTemplateItems();
        });
    }

    onEditItem(item: TemplateItemModel) {
        this.itemUnderEdit = item;
        this.createItemEditForm(item);
    }

    onInsertItem(itemWithChosenPosition: TemplateItemModel) {
        const newItemIndex = this.items.findIndex(x => x === itemWithChosenPosition);
        if (newItemIndex === -1) {
            console.error('Failed to find item position');
            return;
        }

        this.itemUnderEdit = new TemplateItemModel();
        this.items.splice(newItemIndex, 0, this.itemUnderEdit);

        this.createItemEditForm();
    }

    onDeleteItem(item: TemplateItemModel) {
        if (!this.templateId || !item.id) {
            console.error('Can not delete item without id');
            return;
        }

        this.templateService.deleteTemplateItem(this.templateId, item.id).subscribe(() => {
            this.loadTemplateItems();
        });
    }

    onSaveItemChanges() {
        this.saveItemChanges();
    }

    private saveItemChanges() {
        if (!this.templateId || !this.itemUnderEdit) {
            console.error('Can not save changes because no item is under edit');
            return;
        }

        const title = this.getFormValue('title');
        if (!title) {
            console.error('Item title is not set');
            return;
        }

        this.itemUnderEdit.title = title;
        this.itemUnderEdit.quantity = this.getNumberFormValue('quantity');
        this.itemUnderEdit.comment = this.getFormValue('comment');

        if (this.itemUnderEdit.id) {
            this.templateService.updateTemplateItem(this.templateId, this.itemUnderEdit).subscribe(() => {
                this.itemUnderEdit = undefined;
                this.loadTemplateItems();
            });
        } else {
            this.templateService.createTemplateItem(this.templateId, this.itemUnderEdit).subscribe((newItemId: string) => {
                // Setting id of item in items array for correct re-ordering.
                this.itemUnderEdit!.id = newItemId;
                this.itemUnderEdit = undefined;
                this.updateItemsOrder();
            });
        }
    }

    private updateItemsOrder() {
        const itemsOrder: string[] = this.items.map(item => item.id!);
        this.templateService.reorderTemplateItems(this.templateId!, itemsOrder)
            .subscribe(() => this.loadTemplateItems());
    }

    onCancelItemChanges() {
        if (!this.itemUnderEdit) {
            console.error('Can not cancel changes because no item is under edit');
            return;
        }

        // If it was new item, we should remove it from the list.
        if (!this.itemUnderEdit.id) {
            const newItemIndex = this.items.findIndex(x => x === this.itemUnderEdit);
            if (newItemIndex !== -1) {
                this.items.splice(newItemIndex, 1);
            } else {
                console.error('Failed to find item position');
            }
        }

        this.itemUnderEdit = undefined;
    }

    onEditKeyDown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            this.saveItemChanges();
        }
    }

    private loadTemplateItems() {
        if (!this.templateId) {
            console.error('Template id is unknown');
            return;
        }

        // TBD: Avoid nested subscriptions
        this.templateService.getTemplateItems(this.templateId)
            .subscribe((data: TemplateItemModel[]) => this.items = data);
    }

    private createItemEditForm(item?: TemplateItemModel) {
        this.editItemFormGroup = this.formBuilder.group({
            title: [item ? item.title : null, Validators.required],
            quantity: [item ? item.quantity : null, Validators.pattern(/^\d*$/)],
            comment: [item ? item.comment : null],
        });
    }

    private getFormValue(name: string): string | null {
        if (!this.editItemFormGroup) {
            console.error('Item edit form is not set');
            return null;
        }

        const control = this.editItemFormGroup.get(name);
        return control ? control.value : null;
    }

    private getNumberFormValue(name: string): number | null {
        const value = this.getFormValue(name);
        if (!value) {
            return null;
        }

        return parseInt(value, 10);
    }

    isItemUnderEdit(item: TemplateItemModel): boolean {
        return this.itemUnderEdit !== undefined && item.id === this.itemUnderEdit.id;
    }

    public drop(event: CdkDragDrop<TemplateItemModel[]>) {
        moveItemInArray(this.items, event.previousIndex, event.currentIndex);
        this.updateItemsOrder();
    }
}
