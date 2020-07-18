import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { TemplateService } from '../../services/template.service';
import { ShoppingListService } from '../../services/shopping-list.service';
import { ShoppingTemplateModel } from '../../models/shopping-template.model';

@Component({
    selector: 'app-templates-list',
    templateUrl: './templates-list.component.html',
    styleUrls: ['./templates-list.component.css']
})
export class TemplatesListComponent implements OnInit, OnDestroy {

    private readonly templateService: TemplateService;
    private readonly shoppingListService: ShoppingListService;
    private readonly router: Router;

    templates: ShoppingTemplateModel[] = [];
    loadingTemplates: boolean = false;
    addingTemplate: boolean = false;
    inProgressTemplateId: string | null = null;

    newTemplateTitle: string | null = null;

    private unsubscribe$ = new Subject<void>();

    constructor(templateService: TemplateService, shoppingListService: ShoppingListService, router: Router, titleService: Title) {
        this.templateService = templateService;
        this.shoppingListService = shoppingListService;
        this.router = router;

        titleService.setTitle('All Shopping Templates');
    }

    ngOnInit() {
        this.loadTemplates();
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    addTemplate() {
        if (!this.newTemplateTitle) {
            return;
        }

        const newTemplate = new ShoppingTemplateModel();
        newTemplate.title = this.newTemplateTitle;

        this.addingTemplate = true;
        this.templateService.createTemplate(newTemplate, this.unsubscribe$)
            .pipe(finalize(() => this.addingTemplate = false))
            .subscribe(
                createdTemplate => {
                    this.newTemplateTitle = null;
                    this.templates.push(createdTemplate);
                });
    }

    createShoppingListFromTemplate(template: ShoppingTemplateModel) {
        this.inProgressTemplateId = template.id;
        this.shoppingListService.createShoppingList(template, this.unsubscribe$)
            .pipe(finalize(() => this.inProgressTemplateId = null))
            .subscribe(shoppingList => {
                this.router.navigate(['/shopping-lists', shoppingList.id, 'edit'], { state: shoppingList });
            });
    }

    deleteTemplate(template: ShoppingTemplateModel) {
        this.inProgressTemplateId = template.id;
        this.templateService.deleteTemplate(template.id, this.unsubscribe$)
            .pipe(finalize(() => this.inProgressTemplateId = null))
            .subscribe(
                () => {
                    this.templates = this.templates.filter(x => x.id !== template.id);
                });
    }

    private loadTemplates() {
        this.loadingTemplates = true;
        this.templateService.getTemplates(this.unsubscribe$)
            .pipe(finalize(() => this.loadingTemplates = false))
            .subscribe(data => this.templates = data);
    }
}
