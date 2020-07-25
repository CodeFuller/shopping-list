export class CreateShoppingListRequest {
    templateId: string | null;

    constructor(templateId: string | null = null) {
        this.templateId = templateId;
    }
}
