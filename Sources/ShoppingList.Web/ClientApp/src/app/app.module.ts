import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TemplatesListComponent } from './components/templates-list/templates-list.component';
import { EditTemplateComponent } from './components/edit-template/edit-template.component';
import { ShoppingListsComponent } from './components/shopping-lists/shopping-lists.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { EditItemsListComponent } from './components/edit-items-list/edit-items-list.component';
import { EditShoppingListComponent } from './components/edit-shopping-list/edit-shopping-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoadingIndicatorComponent } from './components/loading-indicator/loading-indicator.component';
import { PrintShoppingListComponent } from './components/print-shopping-list/print-shopping-list.component';
import { LoginComponent } from './components/login/login.component';

@NgModule({
    declarations: [
        AppComponent,
        TemplatesListComponent,
        EditTemplateComponent,
        ShoppingListsComponent,
        EditItemsListComponent,
        EditShoppingListComponent,
        LoadingIndicatorComponent,
        PrintShoppingListComponent,
        LoginComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        DragDropModule,
        NgbModule
    ],
    providers: [],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
