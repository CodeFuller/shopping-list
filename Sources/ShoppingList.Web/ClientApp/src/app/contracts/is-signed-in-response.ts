import { Expose } from 'class-transformer';

export class IsSignedInResponse {
    @Expose() isSignedIn!: boolean;
}
