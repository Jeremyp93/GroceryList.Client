import { Component, EventEmitter, Input, Output, HostListener, inject, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent implements OnDestroy {
  @Input() isOpen: boolean = false;
  @Output() closeModalEvent = new EventEmitter<void>();
  renderer = inject(Renderer2);

  @HostListener('document:click', ['$event.target'])
  onClick(target: EventTarget | null): void {
    if (target && !(target as HTMLElement).closest('.modal-content')) {
      this.closeModal();
    }
  }

  ngOnChanges(): void {
    if (this.isOpen) {
      this.renderer.addClass(document.body, 'modal-open');
    } else {
      this.renderer.removeClass(document.body, 'modal-open');
    }
  }

  closeModal = (): void => {
    this.isOpen = false;
    this.renderer.removeClass(document.body, 'modal-open');
    this.closeModalEvent.emit();
  }

  ngOnDestroy(): void {
    console.log('test');
    this.renderer.removeClass(document.body, 'modal-open');
  }
}
