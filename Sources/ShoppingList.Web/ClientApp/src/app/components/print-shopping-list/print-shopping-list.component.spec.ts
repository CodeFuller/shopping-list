import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintShoppingListComponent } from './print-shopping-list.component';

describe('PrintShoppingListComponent', () => {
    let component: PrintShoppingListComponent;
    let fixture: ComponentFixture<PrintShoppingListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PrintShoppingListComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PrintShoppingListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
