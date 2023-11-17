import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() danger: boolean = false;
  @Input() success: boolean = false;
  @Input() type: string = 'button';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
}
