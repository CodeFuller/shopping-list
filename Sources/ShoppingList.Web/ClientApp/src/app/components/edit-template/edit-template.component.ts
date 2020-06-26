import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TemplateService } from '../../services/template.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ShoppingItemModel } from '../../models/shopping-item.model';

interface IKeyboardHandlers {
    [key: string]: () => void;
}

@Component({
    selector: 'app-edit-template',
    templateUrl: './edit-template.component.html',
    styleUrls: ['./edit-template.component.css']
})
export class EditTemplateComponent implements OnInit {

    templateId: string | undefined;
    items: ShoppingItemModel[] = [];

    itemUnderEdit: ShoppingItemModel | undefined;

    addItemFormGroup: FormGroup;
    editItemFormGroup: FormGroup | undefined;

    // https://stackoverflow.com/a/44803306/5740031
    @ViewChild('editedItemTitle') editedItemTitleRef: ElementRef | undefined;
    @ViewChild('editedItemQuantity') editedItemQuantityRef: ElementRef | undefined;
    @ViewChild('editedItemComment') editedItemCommentRef: ElementRef | undefined;

    constructor(private templateService: TemplateService, private route: ActivatedRoute, private formBuilder: FormBuilder) {
        this.addItemFormGroup = this.createItemEditForm();
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

        const newItem = new ShoppingItemModel();
        this.fillItemData(newItem, this.addItemFormGroup);

        this.templateService.createTemplateItem(this.templateId, newItem).subscribe(createdItem => {
            this.addItemFormGroup.reset();
            this.items.push(createdItem);
        });
    }

    private fillItemData(item: ShoppingItemModel, form: FormGroup) {
        const title = this.getFormValue(form, 'title');
        if (!title) {
            console.error('Item title is not set');
            return;
        }

        item.title = title;
        item.quantity = this.getFormValue(form, 'quantity');
        item.comment = this.getFormValue(form, 'comment');
    }

    onEditItem(item: ShoppingItemModel, clickedElement: string) {
        this.itemUnderEdit = item;
        this.editItemFormGroup = this.createItemEditForm(item);

        // Setting the focus on clicked edit.
        // https://stackoverflow.com/a/50014475/5740031
        // Element has not been rendered yet at this point of time.
        setTimeout(() => {
            const element = this.getElement(clickedElement);
            if (!element) {
                console.error(`Element ${clickedElement} does not exist`);
                return;
            }
            element.nativeElement.focus();
        }, 0);
    }

    private getElement(clickedElement: string): ElementRef | undefined {
        switch (clickedElement) {
            case 'title':
                return this.editedItemTitleRef;
            case 'quantity':
                return this.editedItemQuantityRef;
            case 'comment':
                return this.editedItemCommentRef;
            default:
                console.error(`Unknown element clicked: ${clickedElement}`);
                return undefined;
        }
    }

    onDeleteItem(item: ShoppingItemModel) {
        if (!this.templateId || !item.id) {
            console.error('Can not delete item without id');
            return;
        }

        this.templateService.deleteTemplateItem(this.templateId, item.id).subscribe(() => {
            this.items = this.items.filter(x => x.id !== item.id);
        });
    }

    onSaveItemChanges() {
        if (!this.templateId || !this.itemUnderEdit || !this.editItemFormGroup) {
            console.error('Can not save changes because no item is under edit');
            return;
        }

        const itemId = this.itemUnderEdit.id;
        this.fillItemData(this.itemUnderEdit, this.editItemFormGroup);

        this.templateService.updateTemplateItem(this.templateId, this.itemUnderEdit).subscribe(updatedItem => {
            const index = this.items.findIndex(x => x.id === itemId);
            if (index >= 0) {
                this.items[index] = updatedItem;
            }

            this.itemUnderEdit = undefined;
        });
    }

    private updateItemsOrder() {
        const itemsOrder = this.items.map(item => item.id!);
        this.templateService.reorderTemplateItems(this.templateId!, itemsOrder)
            .subscribe(newItems => this.items = newItems);
    }

    onCancelItemEdit() {
        if (!this.itemUnderEdit) {
            console.error('Can not cancel changes because no item is under edit');
            return;
        }

        this.itemUnderEdit = undefined;
    }

    onCancelItemAdd() {
        this.addItemFormGroup.reset();
    }

    onEditKeyDown(event: KeyboardEvent) {
        const handlers: IKeyboardHandlers = {
            Enter: () => this.onSaveItemChanges(),
            Escape: () => this.onCancelItemEdit()
        }
        this.executeKeyboardHandler(event, handlers);
    }

    onAddKeyDown(event: KeyboardEvent) {
        const handlers = {
            Enter: () => this.onAddItem(),
            Escape: () => this.onCancelItemAdd()
        }
        this.executeKeyboardHandler(event, handlers);
    }

    private executeKeyboardHandler(event: KeyboardEvent, handlers: IKeyboardHandlers) {
        const handler = handlers[event.key];
        if (handler) {
            handler();
        }
    }

    private loadTemplateItems() {
        if (!this.templateId) {
            console.error('Template id is unknown');
            return;
        }

        // TBD: Avoid nested subscriptions
        this.templateService.getTemplateItems(this.templateId)
            .subscribe((data: ShoppingItemModel[]) => this.items = data);
    }

    private createItemEditForm(item?: ShoppingItemModel): FormGroup {
        return this.formBuilder.group({
            title: [item ? item.title : null, Validators.required],
            quantity: [item ? item.quantity : null],
            comment: [item ? item.comment : null],
        });
    }

    private getFormValue(form: FormGroup, name: string): string | null {
        const control = form.get(name);
        return control ? control.value : null;
    }

    isItemUnderEdit(item: ShoppingItemModel): boolean {
        return this.itemUnderEdit !== undefined && item.id === this.itemUnderEdit.id;
    }

    drop(event: CdkDragDrop<ShoppingItemModel[]>) {
        moveItemInArray(this.items, event.previousIndex, event.currentIndex);
        this.updateItemsOrder();
    }
}
