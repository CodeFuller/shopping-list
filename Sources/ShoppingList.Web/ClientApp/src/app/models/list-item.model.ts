import { Expose } from 'class-transformer';

export class ListItem {
    @Expose() title!: string;
    @Expose() quantity!: number | null;
    @Expose() comment!: string | null;
}
