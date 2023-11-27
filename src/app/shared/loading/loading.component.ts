import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSize } from './loading-size.enum';
import { LoadingSizeDirective } from './loading-size.directive';
import { LoadingColor } from './loading-color.enum';
import { LoadingColorDirective } from './loading-color.directive';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, LoadingSizeDirective, LoadingColorDirective],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {
  @Input() size: LoadingSize = LoadingSize.medium; // Default size
  @Input() color: LoadingColor = LoadingColor.white; // Default color
  @Input() otherColorHex: string = '';
}
