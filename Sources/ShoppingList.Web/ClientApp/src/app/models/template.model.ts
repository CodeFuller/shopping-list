import { Expose } from 'class-transformer';

export class TemplateModel {
    @Expose() id!: string;
    @Expose() title!: string;
}
