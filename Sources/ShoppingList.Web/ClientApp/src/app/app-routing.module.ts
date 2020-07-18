import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TemplatesListComponent } from './components/templates-list/templates-list.component';
import { EditTemplateComponent } from './components/edit-template/edit-template.component';
import { ShoppingListsComponent } from './components/shopping-lists/shopping-lists.component';
import { EditShoppingListComponent } from './components/edit-shopping-list/edit-shopping-list.component';
import { PrintShoppingListComponent } from './components/print-shopping-list/print-shopping-list.component';

const routes: Routes = [
    { path: '', redirectTo: 'templates', pathMatch: 'full' },
    { path: 'templates', component: TemplatesListComponent },
    { path: 'templates/:id', component: EditTemplateComponent },
    { path: 'shopping-lists', component: ShoppingListsComponent },
    { path: 'shopping-lists/:id/edit', component: EditShoppingListComponent },
    { path: 'shopping-lists/:id/print', component: PrintShoppingListComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
