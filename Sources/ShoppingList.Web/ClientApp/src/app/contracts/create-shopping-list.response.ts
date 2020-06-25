import { Expose, Type } from 'class-transformer';
import { ShoppingListModel } from '../models/shopping-list.model';
import { ListItem } from '../models/list-item.model';

export class CreateShoppingListResponse {
    @Expose() id!: string;
    @Expose() title!: string;

    @Expose()
    @Type(() => ListItem)
    items!: ListItem[];

    public toModel(): ShoppingListModel {
        return new ShoppingListModel(this.id, this.title, this.items);
    }
}
