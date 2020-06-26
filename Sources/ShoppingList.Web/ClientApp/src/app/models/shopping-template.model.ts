import { Expose } from 'class-transformer';

export class ShoppingTemplateModel {
    @Expose() id!: string;
    @Expose() title!: string;
}
