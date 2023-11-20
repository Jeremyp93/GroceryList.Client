import { Component, HostListener, OnInit, Output, EventEmitter, inject, ElementRef, Input, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/button/button.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventManagerPlugin } from '@angular/platform-browser';
import { Ingredient } from '../../grocery-list.service';
import { Section } from '../../../stores/store.service';

@Component({
  selector: 'app-tile-add-ingredient',
  standalone: true,
  imports: [CommonModule, ButtonComponent, ReactiveFormsModule],
  templateUrl: './tile-add-ingredient.component.html',
  styleUrl: './tile-add-ingredient.component.scss'
})
export class TileAddIngredientComponent implements OnInit, AfterViewInit {
  @Output() itemAdded: EventEmitter<Ingredient> = new EventEmitter<Ingredient>();
  @Output() onClickOutside: EventEmitter<void> = new EventEmitter<void>();
  @Input() sections: Section[] = [];
  @ViewChild('inputField') inputField!: ElementRef;
  elementRef = inject(ElementRef)
  categories: string[] = [];
  addForm!: FormGroup;
  formSubmitted: boolean = false;

  @HostListener('document:click', ['$event.target'])
  onClick(target: EventTarget | null): void {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) {
      this.onClickOutside.emit();
    }
  }

  ngOnInit(): void {
    this.categories = this.sections.map(s => s.name) ?? [];
    this.initForm();
  }

  ngAfterViewInit(): void {
    this.inputField.nativeElement.focus();
  }

  addItem = () => {
    this.formSubmitted = true;
    if (this.addForm.invalid) return;
    this.itemAdded.emit(this.addForm.value);
    this.formSubmitted = false;
  }

  onEnterPressed = () => {
    this.addItem();
  }

  private initForm = () => {
    this.addForm = new FormGroup({
      amount: new FormControl(1, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
      name: new FormControl('', Validators.required),
      category: new FormControl(''),
    });
  }
}
