import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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

    public itemUnderEdit: TemplateItemModel | undefined;

    public addItemFormGroup: FormGroup;
    public editItemFormGroup: FormGroup | undefined;

    // https://stackoverflow.com/a/44803306/5740031
    @ViewChild('newItemTitle') newItemTitleRef: ElementRef | undefined;
    @ViewChild('newItemQuantity') newItemQuantityRef: ElementRef | undefined;
    @ViewChild('newItemComment') newItemCommentRef: ElementRef | undefined;

    constructor(private templateService: TemplateService, private route: ActivatedRoute, private formBuilder: FormBuilder) {
        this.addItemFormGroup = this.createItemEditForm();
    }

    public ngOnInit() {
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.templateId = params.get('id') || undefined;
            this.loadTemplateItems();
        });
    }

    public onAddItem() {
        if (!this.templateId) {
            console.error('Template id is undefined');
            return;
        }

        const newItem = new TemplateItemModel();
        this.fillItemData(newItem, this.addItemFormGroup);

        this.templateService.createTemplateItem(this.templateId, newItem).subscribe(() => {
            this.addItemFormGroup = this.createItemEditForm();
            this.loadTemplateItems();
        });
    }

    private fillItemData(item: TemplateItemModel, form: FormGroup) {
        const title = this.getFormValue(form, 'title');
        if (!title) {
            console.error('Item title is not set');
            return;
        }

        item.title = title;
        item.quantity = this.getNumberFormValue(form, 'quantity');
        item.comment = this.getFormValue(form, 'comment');
    }

    public onEditItem(item: TemplateItemModel, clickedElement: string) {
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
                return this.newItemTitleRef;
            case 'quantity':
                return this.newItemQuantityRef;
            case 'comment':
                return this.newItemCommentRef;
            default:
                console.error(`Unknown element clicked: ${clickedElement}`);
                return undefined;
        }
    }

    public onDeleteItem(item: TemplateItemModel) {
        if (!this.templateId || !item.id) {
            console.error('Can not delete item without id');
            return;
        }

        this.templateService.deleteTemplateItem(this.templateId, item.id).subscribe(() => {
            this.loadTemplateItems();
        });
    }

    public onSaveItemChanges() {
        if (!this.templateId || !this.itemUnderEdit || !this.editItemFormGroup) {
            console.error('Can not save changes because no item is under edit');
            return;
        }

        this.fillItemData(this.itemUnderEdit, this.editItemFormGroup);

        this.templateService.updateTemplateItem(this.templateId, this.itemUnderEdit).subscribe(() => {
            this.itemUnderEdit = undefined;
            this.loadTemplateItems();
        });
    }

    private updateItemsOrder() {
        const itemsOrder: string[] = this.items.map(item => item.id!);
        this.templateService.reorderTemplateItems(this.templateId!, itemsOrder)
            .subscribe(() => this.loadTemplateItems());
    }

    public onCancelItemEdit() {
        if (!this.itemUnderEdit) {
            console.error('Can not cancel changes because no item is under edit');
            return;
        }

        this.itemUnderEdit = undefined;
    }

    public onCancelItemAdd() {
        this.addItemFormGroup = this.createItemEditForm();
    }

    public onEditKeyDown(event: KeyboardEvent) {
        const handlers = {
            Enter: () => this.onSaveItemChanges(),
            Escape: () => this.onCancelItemEdit()
        }
        this.executeKeyboardHandler(event, handlers);
    }

    public onAddKeyDown(event: KeyboardEvent) {
        const handlers = {
            Enter: () => () => this.onAddItem(),
            Escape: () => this.onCancelItemAdd()
        }
        this.executeKeyboardHandler(event, handlers);
    }

    private executeKeyboardHandler(event: KeyboardEvent, handlers) {
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
            .subscribe((data: TemplateItemModel[]) => this.items = data);
    }

    private createItemEditForm(item?: TemplateItemModel): FormGroup {
        return this.formBuilder.group({
            title: [item ? item.title : null, Validators.required],
            quantity: [item ? item.quantity : null, Validators.pattern(/^\d*$/)],
            comment: [item ? item.comment : null],
        });
    }

    private getFormValue(form: FormGroup, name: string): string | null {
        const control = form.get(name);
        return control ? control.value : null;
    }

    private getNumberFormValue(form: FormGroup, name: string): number | null {
        const value = this.getFormValue(form, name);
        if (!value) {
            return null;
        }

        return parseInt(value, 10);
    }

    public isItemUnderEdit(item: TemplateItemModel): boolean {
        return this.itemUnderEdit !== undefined && item.id === this.itemUnderEdit.id;
    }

    public drop(event: CdkDragDrop<TemplateItemModel[]>) {
        moveItemInArray(this.items, event.previousIndex, event.currentIndex);
        this.updateItemsOrder();
    }
}
