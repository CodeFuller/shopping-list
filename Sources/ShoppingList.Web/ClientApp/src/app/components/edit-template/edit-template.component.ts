import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TemplateModel } from 'src/app/models/template.model';
import { TemplateService } from 'src/app/services/template.service';

@Component({
    selector: 'app-edit-template',
    templateUrl: './edit-template.component.html',
    styleUrls: ['./edit-template.component.css']
})
export class EditTemplateComponent implements OnInit {

    public templateData: TemplateModel | undefined;

    constructor(private templateService: TemplateService, private route: ActivatedRoute)
    {
    }

    ngOnInit() {
      this.route.paramMap.subscribe((params: ParamMap) => {
        const templateId = params.get('id');
        if (!templateId) {
          throw Error('Template routing is broken');
        }

        // TBD: Avoid nested subscriptions
        this.templateService.getTemplate(templateId)
          .subscribe((data: TemplateModel) => this.templateData = data);
      });
    }

}
