import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroceryListItemsComponent } from './grocery-list-items.component';

describe('GroceryListItemsComponent', () => {
  let component: GroceryListItemsComponent;
  let fixture: ComponentFixture<GroceryListItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroceryListItemsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroceryListItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
