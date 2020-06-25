import { Expose } from 'class-transformer';

export class ListItem {
    @Expose() title!: string;
    @Expose() quantity!: string | null;
    @Expose() comment!: string | null;
}
