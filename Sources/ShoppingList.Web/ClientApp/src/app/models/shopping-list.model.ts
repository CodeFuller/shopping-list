import { Expose, Type } from 'class-transformer';
import { ShoppingItemModel } from './shopping-item.model';

export class ShoppingListModel {
    @Expose() id!: string;
    @Expose() title!: string;

    @Expose()
    @Type(() => ShoppingItemModel)
    items!: ShoppingItemModel[];
}
