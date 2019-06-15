import { Expose, Type } from 'class-transformer';
import { ListItem } from './list-item.model';

export class ShoppingListModel {
    @Expose() title: string;

    @Expose()
    @Type(() => ListItem)
    items: ListItem[];
}
