import { Directive, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges, inject } from '@angular/core';
import { ButtonStyle } from './button-style.enum';

@Directive({
  selector: '[appButtonStyle]',
  standalone: true
})
export class ButtonStyleDirective implements OnChanges {
  elementRef = inject(ElementRef);
  renderer = inject(Renderer2);
  @Input('appButtonStyle') style: ButtonStyle = ButtonStyle.normal;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['style']) {
      this.#applyButtonStyle(changes['style'].currentValue);
    }
  }

  #applyButtonStyle(style: ButtonStyle) {
    switch (style) {
      case ButtonStyle.danger:
        this.renderer.addClass(this.elementRef.nativeElement, 'danger');
        break;
      case ButtonStyle.success:
        this.renderer.addClass(this.elementRef.nativeElement, 'success');
        break;
      case ButtonStyle.normal:
        this.renderer.removeClass(this.elementRef.nativeElement, 'danger');
        this.renderer.removeClass(this.elementRef.nativeElement, 'success');
        break;
      default:
        break;
    }
  }
}
