import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TemplateService } from './services/template.service';
import { ShoppingListService } from './services/shopping-list.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [TemplateService, ShoppingListService]
})
export class AppComponent {
    title = 'Shopping List';

    router: Router;

    constructor(router: Router) {
        this.router = router;
    }
}
