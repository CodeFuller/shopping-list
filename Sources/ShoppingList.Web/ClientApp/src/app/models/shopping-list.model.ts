import { ListItem } from './list-item.model';

export class ShoppingListModel {

    readonly id: string;
    readonly title: string;
    readonly items: ListItem[];

    public constructor(id: string, title: string, items: ListItem[]) {
        this.id = id;
        this.title = title;
        this.items = items;
    }
}
