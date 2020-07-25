import { Expose } from 'class-transformer';

export class IsLoggedInResponse {
    @Expose() isLoggedIn!: boolean;
}
