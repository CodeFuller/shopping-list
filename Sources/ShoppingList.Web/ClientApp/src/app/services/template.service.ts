import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { ShoppingTemplateModel } from '../models/shopping-template.model';
import { ShoppingItemModel } from '../models/shopping-item.model';
import { ErrorHandlingService } from './error-handling.service';

@Injectable()
export class TemplateService {

    private readonly baseAddress: string = '/api/templates';

    private readonly http: HttpClient;
    private readonly errorHandlingService: ErrorHandlingService;

    constructor(http: HttpClient, errorHandlingService: ErrorHandlingService) {
        this.http = http;
        this.errorHandlingService = errorHandlingService;
    }

    createTemplate(newTemplate: ShoppingTemplateModel): Observable<ShoppingTemplateModel> {
        return this.http.post(`${this.baseAddress}`, newTemplate)
            .pipe(this.errorHandlingService.handleHttpError('Failed to create shopping template'))
            .pipe(map(response => plainToClass(ShoppingTemplateModel, response, { excludeExtraneousValues: true })));
    }

    getTemplates(): Observable<ShoppingTemplateModel[]> {
        return this.http.get<Object[]>(`${this.baseAddress}`)
            .pipe(this.errorHandlingService.handleHttpError('Failed to load shopping templates'))
            .pipe(map(response => plainToClass(ShoppingTemplateModel, response, { excludeExtraneousValues: true })));
    }

    deleteTemplate(templateId: string): Observable<object> {
        return this.http.delete(`${this.baseAddress}/${templateId}`)
            .pipe(this.errorHandlingService.handleHttpError('Failed to delete shopping template'));
    }

    createTemplateItem(templateId: string, newItem: ShoppingItemModel): Observable<ShoppingItemModel> {
        return this.http.post(`${this.baseAddress}/${templateId}/items`, newItem)
            .pipe(this.errorHandlingService.handleHttpError('Failed to create template item'))
            .pipe(map(response => plainToClass(ShoppingItemModel, response, { excludeExtraneousValues: true })));
    }

    getTemplateItems(templateId: string): Observable<ShoppingItemModel[]> {
        return this.http.get<Object[]>(`${this.baseAddress}/${templateId}/items`)
            .pipe(this.errorHandlingService.handleHttpError('Failed to load template items'))
            .pipe(map(response => plainToClass(ShoppingItemModel, response, { excludeExtraneousValues: true })));
    }

    updateTemplateItem(templateId: string, item: ShoppingItemModel): Observable<ShoppingItemModel> {
        return this.http.put(`${this.baseAddress}/${templateId}/items/${item.id}`, item)
            .pipe(this.errorHandlingService.handleHttpError('Failed to update template item'))
            .pipe(map(response => plainToClass(ShoppingItemModel, response, { excludeExtraneousValues: true })));
    }

    reorderTemplateItems(templateId: string, newItemsOrder: string[]): Observable<ShoppingItemModel[]> {
        return this.http.patch<Object[]>(`${this.baseAddress}/${templateId}/items`, newItemsOrder)
            .pipe(this.errorHandlingService.handleHttpError('Failed to change order of template items'))
            .pipe(map(response => plainToClass(ShoppingItemModel, response, { excludeExtraneousValues: true })));
    }

    deleteTemplateItem(templateId: string, itemId: string): Observable<object> {
        return this.http.delete(`${this.baseAddress}/${templateId}/items/${itemId}`)
            .pipe(this.errorHandlingService.handleHttpError('Failed to delete template item'));
    }
}
