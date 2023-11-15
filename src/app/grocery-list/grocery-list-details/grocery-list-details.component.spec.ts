import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroceryListDetailsComponent } from './grocery-list-details.component';

describe('GroceryListDetailsComponent', () => {
  let component: GroceryListDetailsComponent;
  let fixture: ComponentFixture<GroceryListDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroceryListDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroceryListDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
