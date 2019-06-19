import { Component, OnInit } from '@angular/core';
import { TemplateModel } from 'src/app/models/template.model';
import { TemplateService } from 'src/app/services/template.service';

@Component({
    selector: 'app-templates-list',
    templateUrl: './templates-list.component.html',
    styleUrls: ['./templates-list.component.css']
})
export class TemplatesListComponent implements OnInit {

    public templates: TemplateModel[] | undefined;
    templateService: TemplateService;

    public newTemplateTitle: string | null = null;

    constructor(templateService: TemplateService) {
        this.templateService = templateService;
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

    private loadTemplates() {
        this.templateService.getTemplates()
            .subscribe((data: TemplateModel[]) => this.templates = data);
    }
}
