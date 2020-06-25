import { Expose } from 'class-transformer';

export class ShoppingItem {
    @Expose() title!: string;
    @Expose() quantity!: string | null;
    @Expose() comment!: string | null;
}
