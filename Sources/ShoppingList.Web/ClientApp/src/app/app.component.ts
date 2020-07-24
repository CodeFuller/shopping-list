import { Component } from '@angular/core';
import { TemplateService } from './services/template.service';
import { ShoppingListService } from './services/shopping-list.service';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [TemplateService, ShoppingListService, AuthService]
})
export class AppComponent {
    title = 'Shopping List';
}
