import { Component } from '@angular/core';
import { ShoppingListService } from './services/shopping-list.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ ShoppingListService ]
})
export class AppComponent {
  title = 'Shopping List';
}
