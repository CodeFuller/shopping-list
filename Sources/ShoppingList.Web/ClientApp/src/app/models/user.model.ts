import { Expose } from 'class-transformer';

export class UserModel {
    @Expose() id!: string;
    @Expose() name!: string;
}
