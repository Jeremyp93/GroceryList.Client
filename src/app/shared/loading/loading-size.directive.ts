import { Directive, Input, ElementRef, Renderer2, OnInit, inject } from '@angular/core';
import { LoadingSize } from './loading-size.enum';

@Directive({
    selector: '[appLoadingSize]',
    standalone: true
})
export class LoadingSizeDirective implements OnInit {
    @Input('appLoadingSize') size: LoadingSize = LoadingSize.medium;
    elementRef = inject(ElementRef);
    renderer = inject(Renderer2);

    ngOnInit() {
        const width = this.getWidth();
        const height = this.getHeight();

        this.renderer.setStyle(this.elementRef.nativeElement, 'width', `${width}px`);
        this.renderer.setStyle(this.elementRef.nativeElement, 'height', `${height}px`);
    }

    private getWidth(): number {
        switch (this.size) {
            case LoadingSize.small:
                return 15;
            case LoadingSize.medium:
                return 30;
            case LoadingSize.large:
                return 45;
            default:
                return 30;
        }
    }

    private getHeight(): number {
        switch (this.size) {
            case LoadingSize.small:
                return 15;
            case LoadingSize.medium:
                return 30;
            case LoadingSize.large:
                return 45;
            default:
                return 30;
        }
    }
}