import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { TemplateModel } from '../models/template.model';
import { TemplateItemModel } from '../models/template-item.model';

@Injectable()
export class TemplateService {

    private readonly http: HttpClient;

    constructor(http: HttpClient) {
        this.http = http;
    }

    createTemplate(newTemplate: TemplateModel): Observable<TemplateModel> {
        return this.http.post(`/api/templates`, newTemplate)
            .pipe(map(response => plainToClass(TemplateModel, response, { excludeExtraneousValues: true })));
    }

    getTemplates(): Observable<TemplateModel[]> {
        return this.http.get<Object[]>('/api/templates')
            .pipe(map(response => plainToClass(TemplateModel, response, { excludeExtraneousValues: true })));
    }

    deleteTemplate(templateId: string): Observable<object> {
      return this.http.delete(`/api/templates/${templateId}`);
    }

    createTemplateItem(templateId: string, newItem: TemplateItemModel): Observable<TemplateItemModel> {
        return this.http.post(`/api/templates/${templateId}/items`, newItem)
            .pipe(map(response => plainToClass(TemplateItemModel, response, { excludeExtraneousValues: true })));
    }

    getTemplateItems(templateId: string): Observable<TemplateItemModel[]> {
        return this.http.get<Object[]>(`/api/templates/${templateId}/items`)
            .pipe(map(response => plainToClass(TemplateItemModel, response, { excludeExtraneousValues: true })));
    }

    updateTemplateItem(templateId: string, item: TemplateItemModel): Observable<TemplateItemModel> {
        return this.http.put(`/api/templates/${templateId}/items/${item.id}`, item)
            .pipe(map(response => plainToClass(TemplateItemModel, response, { excludeExtraneousValues: true })));
    }

    reorderTemplateItems(templateId: string, newItemsOrder: string[]): Observable<TemplateItemModel[]> {
        return this.http.patch<Object[]>(`/api/templates/${templateId}/items`, newItemsOrder)
            .pipe(map(response => plainToClass(TemplateItemModel, response, { excludeExtraneousValues: true })));
    }

    deleteTemplateItem(templateId: string, itemId: string): Observable<object> {
        return this.http.delete(`/api/templates/${templateId}/items/${itemId}`);
    }
}
