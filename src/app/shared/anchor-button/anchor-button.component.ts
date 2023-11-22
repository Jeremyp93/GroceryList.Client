import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-anchor-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './anchor-button.component.html',
  styleUrl: './anchor-button.component.scss'
})
export class AnchorButtonComponent {
  @Input() href: string = '';
  @Input() newWindow: boolean = false;
}
