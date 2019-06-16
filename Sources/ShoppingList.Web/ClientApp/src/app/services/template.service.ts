import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { TemplateModel } from '../models/template.model';

@Injectable()
export class TemplateService {

    private http: HttpClient;

    constructor(http: HttpClient) {
        this.http = http;
    }

    getTemplates(): Observable<TemplateModel[]> {
        return this.http.get<TemplateModel[]>('/api/templates')
            .pipe(map(response => plainToClass(TemplateModel, response, { excludeExtraneousValues: true })));
    }

    getTemplate(id: string): Observable<TemplateModel> {
      return this.http.get<TemplateModel>(`/api/templates/${id}`)
          .pipe(map(response => plainToClass(TemplateModel, response, { excludeExtraneousValues: true })));
  }
}
