import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {
  @Input() size: string = '80px'; // Default size

  getSpinnerSize() {
    return { width: this.size, height: this.size, fontSize: this.size };
  }
}
