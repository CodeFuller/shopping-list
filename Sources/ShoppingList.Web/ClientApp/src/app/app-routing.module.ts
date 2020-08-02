import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TemplatesListComponent } from './components/templates-list/templates-list.component';
import { EditTemplateComponent } from './components/edit-template/edit-template.component';
import { ShoppingListsComponent } from './components/shopping-lists/shopping-lists.component';
import { EditShoppingListComponent } from './components/edit-shopping-list/edit-shopping-list.component';
import { PrintShoppingListComponent } from './components/print-shopping-list/print-shopping-list.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { UsersComponent } from './components/users/users.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { AuthGuard } from './auth/auth-guard';

const routes: Routes = [
    { path: '', redirectTo: 'templates', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard] },
    { path: 'templates', component: TemplatesListComponent, canActivate: [AuthGuard] },
    { path: 'templates/:id', component: EditTemplateComponent, canActivate: [AuthGuard] },
    { path: 'shopping-lists', component: ShoppingListsComponent, canActivate: [AuthGuard] },
    { path: 'shopping-lists/:id/edit', component: EditShoppingListComponent, canActivate: [AuthGuard] },
    { path: 'shopping-lists/:id/print', component: PrintShoppingListComponent, canActivate: [AuthGuard] },
    { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
    { path: 'add-user', component: AddUserComponent, canActivate: [AuthGuard] }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
