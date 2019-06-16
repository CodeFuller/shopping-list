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

    constructor(templateService: TemplateService) {
      this.templateService = templateService;
    }

    ngOnInit() {
      this.templateService.getTemplates()
        .subscribe((data: TemplateModel[]) => this.templates = data);
    }
}
