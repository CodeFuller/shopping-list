import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditShoppingListComponent } from './edit-shopping-list.component';

describe('EditShoppingListComponent', () => {
  let component: EditShoppingListComponent;
  let fixture: ComponentFixture<EditShoppingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditShoppingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditShoppingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
