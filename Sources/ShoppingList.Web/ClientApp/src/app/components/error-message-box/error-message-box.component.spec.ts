import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorMessageBoxComponent } from './error-message-box.component';

describe('ErrorMessageBoxComponent', () => {
  let component: ErrorMessageBoxComponent;
  let fixture: ComponentFixture<ErrorMessageBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorMessageBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorMessageBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
