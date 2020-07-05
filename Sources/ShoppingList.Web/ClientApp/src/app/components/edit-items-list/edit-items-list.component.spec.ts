import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditItemsListComponent } from './edit-items-list.component';

describe('EditItemsListComponent', () => {
    let component: EditItemsListComponent;
    let fixture: ComponentFixture<EditItemsListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditItemsListComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditItemsListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
