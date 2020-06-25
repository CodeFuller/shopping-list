import { Expose, Type } from 'class-transformer';
import { ShoppingItem } from './shopping-item.model';

export class ShoppingListModel {
    @Expose() id!: string;
    @Expose() title!: string;

    @Expose()
    @Type(() => ShoppingItem)
    items!: ShoppingItem[];
}
