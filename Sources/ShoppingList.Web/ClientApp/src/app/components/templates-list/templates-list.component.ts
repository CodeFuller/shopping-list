import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { TemplateService } from '../../services/template.service';
import { ShoppingListService } from '../../services/shopping-list.service';
import { ShoppingTemplateModel } from '../../models/shopping-template.model';

@Component({
    selector: 'app-templates-list',
    templateUrl: './templates-list.component.html',
    styleUrls: ['./templates-list.component.css']
})
export class TemplatesListComponent implements OnInit {

    private readonly templateService: TemplateService;
    private readonly shoppingListService: ShoppingListService;

    templates: ShoppingTemplateModel[] = [];
    loadingTemplates: boolean = false;
    addingTemplate: boolean = false;
    deletingTemplateId: string | null = null;

    newTemplateTitle: string | null = null;

    constructor(templateService: TemplateService, shoppingListService: ShoppingListService) {
        this.templateService = templateService;
        this.shoppingListService = shoppingListService;
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
                });
    }

    onCreateShoppingListFromTemplate(template: ShoppingTemplateModel) {
        this.shoppingListService.createShoppingList(template)
            .subscribe();
    }

    onDeleteTemplate(template: ShoppingTemplateModel) {
        this.deletingTemplateId = template.id;
        this.templateService.deleteTemplate(template.id)
            .pipe(finalize(() => this.deletingTemplateId = null))
            .subscribe(
                () => {
                    this.newTemplateTitle = null;
                    this.templates = this.templates.filter(x => x.id !== template.id);
                });
    }

    private loadTemplates() {
        this.loadingTemplates = true;
        this.templateService.getTemplates()
            .pipe(finalize(() => this.loadingTemplates = false))
            .subscribe(data => this.templates = data);
    }
}
