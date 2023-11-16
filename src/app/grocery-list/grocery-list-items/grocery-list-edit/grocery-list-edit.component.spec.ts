import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroceryListEditComponent } from './grocery-list-edit.component';

describe('GroceryListEditComponent', () => {
  let component: GroceryListEditComponent;
  let fixture: ComponentFixture<GroceryListEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroceryListEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroceryListEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
