import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TileIngredientComponent } from './tile-ingredient.component';

describe('TileIngredientComponent', () => {
  let component: TileIngredientComponent;
  let fixture: ComponentFixture<TileIngredientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TileIngredientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TileIngredientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
