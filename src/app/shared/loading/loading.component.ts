import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSize } from './loading-size.enum';
import { LoadingSizeDirective } from './loading-size.directive';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, LoadingSizeDirective],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {
  @Input() size: LoadingSize = LoadingSize.medium; // Default size
}
