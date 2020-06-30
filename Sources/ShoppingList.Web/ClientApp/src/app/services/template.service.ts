import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { ShoppingTemplateModel } from '../models/shopping-template.model';
import { ShoppingItemModel } from '../models/shopping-item.model';
import { handleError } from '../utils/error-handling.utils';

@Injectable()
export class TemplateService {

    private readonly baseAddress: string = '/api/templates';

    private readonly http: HttpClient;

    constructor(http: HttpClient) {
        this.http = http;
    }

    createTemplate(newTemplate: ShoppingTemplateModel): Observable<ShoppingTemplateModel> {
        return this.http.post(`${this.baseAddress}`, newTemplate)
            .pipe(handleError('Failed to create shopping template'))
            .pipe(map(response => plainToClass(ShoppingTemplateModel, response, { excludeExtraneousValues: true })));
    }

    getTemplates(): Observable<ShoppingTemplateModel[]> {
        return this.http.get<Object[]>(`${this.baseAddress}`)
            .pipe(handleError('Failed to load shopping templates'))
            .pipe(map(response => plainToClass(ShoppingTemplateModel, response, { excludeExtraneousValues: true })));
    }

    deleteTemplate(templateId: string): Observable<object> {
        return this.http.delete(`${this.baseAddress}/${templateId}`)
            .pipe(handleError('Failed to delete shopping template'));
    }

    createTemplateItem(templateId: string, newItem: ShoppingItemModel): Observable<ShoppingItemModel> {
        return this.http.post(`${this.baseAddress}/${templateId}/items`, newItem)
            .pipe(handleError('Failed to create template item'))
            .pipe(map(response => plainToClass(ShoppingItemModel, response, { excludeExtraneousValues: true })));
    }

    getTemplateItems(templateId: string): Observable<ShoppingItemModel[]> {
        return this.http.get<Object[]>(`${this.baseAddress}/${templateId}/items`)
            .pipe(handleError('Failed to load template items'))
            .pipe(map(response => plainToClass(ShoppingItemModel, response, { excludeExtraneousValues: true })));
    }

    updateTemplateItem(templateId: string, item: ShoppingItemModel): Observable<ShoppingItemModel> {
        return this.http.put(`${this.baseAddress}/${templateId}/items/${item.id}`, item)
            .pipe(handleError('Failed to update template item'))
            .pipe(map(response => plainToClass(ShoppingItemModel, response, { excludeExtraneousValues: true })));
    }

    reorderTemplateItems(templateId: string, newItemsOrder: string[]): Observable<ShoppingItemModel[]> {
        return this.http.patch<Object[]>(`${this.baseAddress}/${templateId}/items`, newItemsOrder)
            .pipe(handleError('Failed to change order of template items'))
            .pipe(map(response => plainToClass(ShoppingItemModel, response, { excludeExtraneousValues: true })));
    }

    deleteTemplateItem(templateId: string, itemId: string): Observable<object> {
        return this.http.delete(`${this.baseAddress}/${templateId}/items/${itemId}`)
            .pipe(handleError('Failed to delete template item'));
    }
}
