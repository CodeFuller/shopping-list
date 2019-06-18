import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { TemplateModel } from '../models/template.model';
import { TemplateItemModel } from '../models/template-item.model';

@Injectable()
export class TemplateService {

    private http: HttpClient;

    constructor(http: HttpClient) {
        this.http = http;
    }

    createTemplate(newTemplate: TemplateModel): Observable<object> {
        return this.http.post(`/api/templates`, newTemplate);
    }

    getTemplates(): Observable<TemplateModel[]> {
        return this.http.get<TemplateModel[]>('/api/templates')
            .pipe(map(response => plainToClass(TemplateModel, response, { excludeExtraneousValues: true })));
    }

    getTemplate(id: string): Observable<TemplateModel> {
        return this.http.get<TemplateModel>(`/api/templates/${id}`)
            .pipe(map(response => plainToClass(TemplateModel, response, { excludeExtraneousValues: true })));
    }

    createTemplateItem(templateId: string, newItem: TemplateItemModel): Observable<string> {
        return this.http.post(`/api/templates/${templateId}/items`, newItem, {observe: 'response'})
            .pipe(map(response => {
                const location = response.headers.get('Location');
                if (!location) {
                    throw Error('Response for template item creation does not contain location header')
                }

                const re = new RegExp('/([^/]+)$');
                const matches = location.match(re);
                if (!matches) {
                    throw Error(`Failed to parse new item id from location header '${location}'`);
                }

                return matches[1];
            }));
    }

    getTemplateItems(templateId: string): Observable<TemplateItemModel[]> {
        return this.http.get<TemplateItemModel[]>(`/api/templates/${templateId}/items`)
            .pipe(map(response => plainToClass(TemplateItemModel, response, { excludeExtraneousValues: true })));
    }

    updateTemplateItem(templateId: string, item: TemplateItemModel): Observable<object> {
        return this.http.put(`/api/templates/${templateId}/items/${item.id}`, item);
    }

    reorderTemplateItems(templateId: string, newItemsOrder: string[]): Observable<object> {
        return this.http.patch(`/api/templates/${templateId}/items`, newItemsOrder);
    }

    deleteTemplateItem(templateId: string, itemId: string): Observable<object> {
        return this.http.delete(`/api/templates/${templateId}/items/${itemId}`);
    }
}
