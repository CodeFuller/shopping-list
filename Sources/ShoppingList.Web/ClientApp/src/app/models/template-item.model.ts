import { Expose } from 'class-transformer';

export class TemplateItemModel {
    @Expose() id: string | null = null;
    @Expose() title!: string;
    @Expose() quantity: number | null = null;
    @Expose() comment: string | null = null;

    clone(): TemplateItemModel {
        const copy = new TemplateItemModel();
        copy.id = this.id;
        copy.title = this.title;
        copy.quantity = this.quantity;
        copy.comment = this.comment;

        return copy;
    }
}
