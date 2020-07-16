import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { ShoppingTemplateModel } from '../models/shopping-template.model';
import { ShoppingItemModel } from '../models/shopping-item.model';
import { SafeHttpClientService } from './safe-http-client.service';

@Injectable()
export class TemplateService {

    private readonly baseAddress: string = '/api/templates';

    private readonly safeHttp: SafeHttpClientService;

    constructor(safeHttp: SafeHttpClientService) {
        this.safeHttp = safeHttp;
    }

    createTemplate(newTemplate: ShoppingTemplateModel, cancellation: Subject<void>): Observable<ShoppingTemplateModel> {
        return this.safeHttp.post(`${this.baseAddress}`, newTemplate, 'Failed to create shopping template', cancellation)
            .pipe(map(response => plainToClass(ShoppingTemplateModel, response, { excludeExtraneousValues: true })));
    }

    getTemplates(cancellation: Subject<void>): Observable<ShoppingTemplateModel[]> {
        return this.safeHttp.get<Object[]>(`${this.baseAddress}`, 'Failed to load shopping templates', cancellation)
            .pipe(map(response => plainToClass(ShoppingTemplateModel, response, { excludeExtraneousValues: true })));
    }

    getTemplate(templateId: string, cancellation: Subject<void>): Observable<ShoppingTemplateModel> {
        return this.safeHttp.get(`${this.baseAddress}/${templateId}`, 'Failed to load shopping template', cancellation)
            .pipe(map(response => plainToClass(ShoppingTemplateModel, response, { excludeExtraneousValues: true })));
    }

    deleteTemplate(templateId: string, cancellation: Subject<void>): Observable<object> {
        return this.safeHttp.delete(`${this.baseAddress}/${templateId}`, 'Failed to delete shopping template', cancellation);
    }

    createTemplateItem(templateId: string, newItem: ShoppingItemModel, cancellation: Subject<void>): Observable<ShoppingItemModel> {
        return this.safeHttp.post(`${this.baseAddress}/${templateId}/items`, newItem, 'Failed to create template item', cancellation)
            .pipe(map(response => plainToClass(ShoppingItemModel, response, { excludeExtraneousValues: true })));
    }

    updateTemplateItem(templateId: string, item: ShoppingItemModel, cancellation: Subject<void>): Observable<ShoppingItemModel> {
        return this.safeHttp.put(`${this.baseAddress}/${templateId}/items/${item.id}`, item, 'Failed to update template item', cancellation)
            .pipe(map(response => plainToClass(ShoppingItemModel, response, { excludeExtraneousValues: true })));
    }

    reorderTemplateItems(templateId: string, newItemsOrder: string[], cancellation: Subject<void>): Observable<ShoppingItemModel[]> {
        return this.safeHttp.patch<Object[]>(`${this.baseAddress}/${templateId}/items`, newItemsOrder, 'Failed to change order of template items', cancellation)
            .pipe(map(response => plainToClass(ShoppingItemModel, response, { excludeExtraneousValues: true })));
    }

    deleteTemplateItem(templateId: string, itemId: string, cancellation: Subject<void>): Observable<object> {
        return this.safeHttp.delete(`${this.baseAddress}/${templateId}/items/${itemId}`, 'Failed to delete template item', cancellation);
    }
}
