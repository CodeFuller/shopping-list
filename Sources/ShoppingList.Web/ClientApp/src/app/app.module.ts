import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TemplatesListComponent } from './components/templates-list/templates-list.component';
import { EditTemplateComponent } from './components/edit-template/edit-template.component';
import { ShoppingListComponent } from './components/shopping-list/shopping-list.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
      declarations: [
            AppComponent,
            TemplatesListComponent,
            EditTemplateComponent,
            ShoppingListComponent,
            ItemListComponent
      ],
      imports: [
            BrowserModule,
            AppRoutingModule,
            HttpClientModule,
            FormsModule,
            ReactiveFormsModule,
            DragDropModule
      ],
      providers: [],
      bootstrap: [
            AppComponent
      ]
})
export class AppModule { }
