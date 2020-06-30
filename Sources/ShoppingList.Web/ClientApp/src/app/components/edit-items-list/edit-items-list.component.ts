import { Component, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ShoppingItemModel } from '../../models/shopping-item.model';

interface IKeyboardHandlers {
    [key: string]: () => void;
}

@Component({
  selector: 'edit-items-list',
  templateUrl: './edit-items-list.component.html',
  styleUrls: ['./edit-items-list.component.css']
})
export class EditItemsListComponent {
    private readonly formBuilder: FormBuilder;

    items: ShoppingItemModel[] = [];
    itemUnderEdit: ShoppingItemModel | undefined;

    addItemFormGroup: FormGroup;
    editItemFormGroup: FormGroup | undefined;

    @Output() itemAdded = new EventEmitter<[ShoppingItemModel, (createdItem: ShoppingItemModel) => void]>();
    @Output() itemUpdated = new EventEmitter<[ShoppingItemModel, (updatedItem: ShoppingItemModel) => void]>();
    @Output() itemsOrderChanged = new EventEmitter<[ShoppingItemModel[], (orderedItems: ShoppingItemModel[]) => void]>();
    @Output() itemDeleted = new EventEmitter<[ShoppingItemModel, () => void]>();

    // https://stackoverflow.com/a/44803306/5740031
    @ViewChild('editedItemTitle') editedItemTitleRef: ElementRef | undefined;
    @ViewChild('editedItemQuantity') editedItemQuantityRef: ElementRef | undefined;
    @ViewChild('editedItemComment') editedItemCommentRef: ElementRef | undefined;

    constructor(formBuilder: FormBuilder) {
        this.formBuilder = formBuilder;
        this.addItemFormGroup = this.createItemEditForm();
    }

    onAddItem() {
        const newItem = new ShoppingItemModel();
        this.fillItemData(newItem, this.addItemFormGroup);

        this.itemAdded.emit([newItem, (createdItem: ShoppingItemModel) => {
            this.addItemFormGroup.reset();
            this.items.push(createdItem);
        }]);
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

    onSaveItemChanges() {
        if (!this.itemUnderEdit || !this.editItemFormGroup) {
            console.error('Can not save changes because no item is under edit');
            return;
        }

        this.fillItemData(this.itemUnderEdit, this.editItemFormGroup);

        this.itemUpdated.emit([this.itemUnderEdit, (updatedItem: ShoppingItemModel) => {
            const index = this.items.findIndex(x => x.id === updatedItem.id);
            if (index >= 0) {
                this.items[index] = updatedItem;
            }

            this.itemUnderEdit = undefined;
        }]);
    }

    onDeleteItem(item: ShoppingItemModel) {
        if (!item.id) {
            console.error('Can not delete item without id');
            return;
        }

        this.itemDeleted.emit([item, () => {
            this.items = this.items.filter(x => x.id !== item.id);
        }]);
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
        // TODO: We should not move items in source array, till the request to server is completed.
        moveItemInArray(this.items, event.previousIndex, event.currentIndex);
        this.itemsOrderChanged.emit([this.items, (orderedItems: ShoppingItemModel[]) => {
            this.items.splice(0, this.items.length, ...orderedItems);
        }]);
    }
}
