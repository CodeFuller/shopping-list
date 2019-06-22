import { Expose } from 'class-transformer';

export class TemplateItemModel {
    @Expose() id: string | null = null;
    @Expose() title!: string;
    @Expose() quantity: number | null = null;
    @Expose() comment: string | null = null;
}
