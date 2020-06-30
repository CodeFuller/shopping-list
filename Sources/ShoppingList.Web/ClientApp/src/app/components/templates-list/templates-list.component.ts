import { Component, OnInit } from '@angular/core';
import { TemplateService } from '../../services/template.service';
import { ShoppingListService } from '../../services/shopping-list.service';
import { ShoppingTemplateModel } from '../../models/shopping-template.model';
import { DialogService } from '../../services/dialog.service';

@Component({
    selector: 'app-templates-list',
    templateUrl: './templates-list.component.html',
    styleUrls: ['./templates-list.component.css']
})
export class TemplatesListComponent implements OnInit {

    private readonly templateService: TemplateService;
    private readonly shoppingListService: ShoppingListService;
    private readonly dialogService: DialogService;

    templates: ShoppingTemplateModel[] = [];

    newTemplateTitle: string | null = null;

    constructor(templateService: TemplateService, shoppingListService: ShoppingListService, dialogService: DialogService) {
        this.templateService = templateService;
        this.shoppingListService = shoppingListService;
        this.dialogService = dialogService;
    }

    ngOnInit() {
        this.loadTemplates();
    }

    onAddTemplate() {
        if (!this.newTemplateTitle) {
            return;
        }

        const newTemplate = new ShoppingTemplateModel();
        newTemplate.title = this.newTemplateTitle;

        this.templateService.createTemplate(newTemplate)
            .subscribe(
                createdTemplate => {
                    this.newTemplateTitle = null;
                    this.templates.push(createdTemplate);
                },
                error => this.dialogService.showError(error).subscribe());
    }

    onCreateShoppingListFromTemplate(template: ShoppingTemplateModel) {
        this.shoppingListService.createShoppingList(template)
            .subscribe(
                () => { },
                error => this.dialogService.showError(error).subscribe());
    }

    onDeleteTemplate(template: ShoppingTemplateModel) {
        this.templateService.deleteTemplate(template.id)
            .subscribe(
                () => {
                    this.newTemplateTitle = null;
                    this.templates = this.templates.filter(x => x.id !== template.id);
                },
                error => this.dialogService.showError(error).subscribe());
    }

    private loadTemplates() {
        this.templateService.getTemplates()
            .subscribe(
                data => this.templates = data,
                error => this.dialogService.showError(error).subscribe());
    }
}
