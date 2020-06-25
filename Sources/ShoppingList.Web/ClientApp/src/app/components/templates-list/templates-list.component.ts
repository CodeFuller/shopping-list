import { Component, OnInit } from '@angular/core';
import { TemplateModel } from '../../models/template.model';
import { TemplateService } from '../../services/template.service';
import { ShoppingListService } from '../../services/shopping-list.service';

@Component({
    selector: 'app-templates-list',
    templateUrl: './templates-list.component.html',
    styleUrls: ['./templates-list.component.css']
})
export class TemplatesListComponent implements OnInit {

    private readonly templateService: TemplateService;
    private readonly shoppingListService: ShoppingListService;

    public templates: TemplateModel[] | undefined;

    public newTemplateTitle: string | null = null;

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

      const newTemplate = new TemplateModel();
      newTemplate.title = this.newTemplateTitle;

      this.templateService.createTemplate(newTemplate)
          .subscribe(() => {
              this.newTemplateTitle = null;
              this.loadTemplates();
          });
    }

    onCreateShoppingListFromTemplate(template: TemplateModel) {
        this.shoppingListService.createShoppingList(template)
            .subscribe();
    }

    onDeleteTemplate(template: TemplateModel) {
      this.templateService.deleteTemplate(template.id)
        .subscribe(() => {
          this.newTemplateTitle = null;
          this.loadTemplates();
        });
    }

    private loadTemplates() {
        this.templateService.getTemplates()
            .subscribe((data: TemplateModel[]) => this.templates = data);
    }
}
