import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
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
    loadingTemplates: boolean = false;
    addingTemplate: boolean = false;
    deletingTemplateId: string | null = null;

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

        this.addingTemplate = true;
        this.templateService.createTemplate(newTemplate)
            .pipe(finalize(() => this.addingTemplate = false))
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
        this.deletingTemplateId = template.id;
        this.templateService.deleteTemplate(template.id)
            .pipe(finalize(() => this.deletingTemplateId = null))
            .subscribe(
                () => {
                    this.newTemplateTitle = null;
                    this.templates = this.templates.filter(x => x.id !== template.id);
                },
                error => this.dialogService.showError(error).subscribe());
    }

    private loadTemplates() {
        this.loadingTemplates = true;
        this.templateService.getTemplates()
            .pipe(finalize(() => this.loadingTemplates = false))
            .subscribe(
                data => this.templates = data,
                error => this.dialogService.showError(error).subscribe());
    }
}
