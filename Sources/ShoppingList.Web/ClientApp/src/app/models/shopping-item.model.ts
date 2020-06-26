import { Expose } from 'class-transformer';

export class ShoppingItemModel {
    @Expose() id: string | null = null;
    @Expose() title!: string;
    @Expose() quantity: string | null = null;
    @Expose() comment: string | null = null;
}
