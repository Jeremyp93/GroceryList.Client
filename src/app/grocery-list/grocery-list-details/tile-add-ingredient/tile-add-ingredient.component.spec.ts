import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TileAddIngredientComponent } from './tile-add-ingredient.component';

describe('TileAddIngredientComponent', () => {
  let component: TileAddIngredientComponent;
  let fixture: ComponentFixture<TileAddIngredientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TileAddIngredientComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TileAddIngredientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
