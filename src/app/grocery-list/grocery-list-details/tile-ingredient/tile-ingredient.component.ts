import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tile-ingredient',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tile-ingredient.component.html',
  styleUrl: './tile-ingredient.component.scss'
})
export class TileIngredientComponent {
  @Input() number: number = 0;
  @Input() text: string = '';
  @Input() done: boolean = false;
}
