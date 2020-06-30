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
    loadingItems: boolean = true;
    addingNewItem: boolean = false;

    itemUnderEdit: ShoppingItemModel | undefined;
    updatingItemId: string | null = null;

    addItemFormGroup: FormGroup;
    editItemFormGroup: FormGroup | undefined;

    @Output() itemAdded = new EventEmitter<[ShoppingItemModel, (createdItem: ShoppingItemModel) => void, () => void]>();
    @Output() itemUpdated = new EventEmitter<[ShoppingItemModel, (updatedItem: ShoppingItemModel) => void, () => void]>();
    @Output() itemsOrderChanged = new EventEmitter<[ShoppingItemModel[], (orderedItems: ShoppingItemModel[]) => void, () => void]>();
    @Output() itemDeleted = new EventEmitter<[ShoppingItemModel, () => void, () => void]>();

    // https://stackoverflow.com/a/44803306/5740031
    @ViewChild('editedItemTitle') editedItemTitleRef: ElementRef | undefined;
    @ViewChild('editedItemQuantity') editedItemQuantityRef: ElementRef | undefined;
    @ViewChild('editedItemComment') editedItemCommentRef: ElementRef | undefined;

    constructor(formBuilder: FormBuilder) {
        this.formBuilder = formBuilder;
        this.addItemFormGroup = this.createItemEditForm();
    }

    finishLoadingItems() {
        this.loadingItems = false;
    }

    onAddItem() {
        const newItem = new ShoppingItemModel();
        this.fillItemData(newItem, this.addItemFormGroup);

        this.addingNewItem = true;
        this.itemAdded.emit(
            [
                newItem,
                createdItem => {
                    this.addItemFormGroup.reset();
                    this.items.push(createdItem);
                    this.addingNewItem = false;
                },
                () => this.addingNewItem = false
            ]
        );
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

        const newItem = new ShoppingItemModel();
        newItem.id = this.itemUnderEdit.id;
        this.fillItemData(newItem, this.editItemFormGroup);

        this.updatingItemId = newItem.id;
        this.itemUpdated.emit(
            [
                newItem,
                updatedItem => {
                    const index = this.items.findIndex(x => x.id === updatedItem.id);
                    if (index >= 0) {
                        this.items[index] = updatedItem;
                    }

                    this.itemUnderEdit = undefined;
                    this.updatingItemId = null;
                },
                () => {
                    this.updatingItemId = null;
                }
            ]
        );
    }

    onDeleteItem(item: ShoppingItemModel) {
        if (!item.id) {
            console.error('Can not delete item without id');
            return;
        }

        this.updatingItemId = item.id;
        this.itemDeleted.emit(
            [
                item,
                () => {
                    this.items = this.items.filter(x => x.id !== item.id);
                    this.updatingItemId = null;
                },
                () => this.updatingItemId = null
            ]);
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
        const originalItems = [...this.items];
        moveItemInArray(this.items, event.previousIndex, event.currentIndex);

        this.updatingItemId = this.items[event.currentIndex].id;
        this.itemsOrderChanged.emit(
            [
                this.items,
                orderedItems => {
                    this.items = orderedItems;
                    this.updatingItemId = null;
                },
                () => {
                    this.items = originalItems;
                    this.updatingItemId = null;
                }
            ]);
    }
}
