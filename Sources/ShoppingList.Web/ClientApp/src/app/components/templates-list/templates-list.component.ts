import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private readonly router: Router;

    templates: ShoppingTemplateModel[] = [];
    loadingTemplates: boolean = false;
    addingTemplate: boolean = false;
    inProgressTemplateId: string | null = null;

    newTemplateTitle: string | null = null;

    constructor(templateService: TemplateService, shoppingListService: ShoppingListService, router: Router) {
        this.templateService = templateService;
        this.shoppingListService = shoppingListService;
        this.router = router;
    }

    ngOnInit() {
        this.loadTemplates();
    }

    addTemplate() {
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

    createShoppingListFromTemplate(template: ShoppingTemplateModel) {
        this.inProgressTemplateId = template.id;
        this.shoppingListService.createShoppingList(template)
            .pipe(finalize(() => this.inProgressTemplateId = null))
            .subscribe(shoppingList => {
                console.log(`Navigating to ${shoppingList.id}`);
                this.router.navigate(['/shopping-lists', shoppingList.id]);
                console.log(`Navigated to ${shoppingList.id}`);
            });
    }

    deleteTemplate(template: ShoppingTemplateModel) {
        this.inProgressTemplateId = template.id;
        this.templateService.deleteTemplate(template.id)
            .pipe(finalize(() => this.inProgressTemplateId = null))
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
