import { Directive, Input, ElementRef, Renderer2, OnInit, inject } from '@angular/core';

import { LoadingColor } from './loading-color.enum';

@Directive({
    selector: '[appLoadingColor]',
    standalone: true
})
export class LoadingColorDirective implements OnInit {
    @Input('appLoadingColor') color: LoadingColor = LoadingColor.white;
    @Input() otherColorHex: string = '';
    elementRef = inject(ElementRef);
    renderer = inject(Renderer2);

    ngOnInit() {
        const color = this.#getColorHex();

        this.renderer.setStyle(this.elementRef.nativeElement, 'border-color', color);
        this.renderer.setStyle(this.elementRef.nativeElement, 'border-bottom-color', 'transparent');
    }

    #getColorHex = (): string => {
        let colorHex = '';
        switch (this.color) {
            case LoadingColor.white:
                colorHex = '#FFFFFF';
                break;
            case LoadingColor.app:
                colorHex = '#C8963E';
                break;
            case LoadingColor.other:
                colorHex = this.otherColorHex;
                break;
            default:
                break;
        }
        return colorHex;
    }
}