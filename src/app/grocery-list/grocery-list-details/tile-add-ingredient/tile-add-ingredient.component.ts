import { Component, HostListener, OnInit, Output, EventEmitter, inject, ElementRef, Input, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { v4 as UUID } from 'uuid';

import { ButtonComponent } from '../../../shared/button/button.component';
import { Ingredient } from '../../types/ingredient.type';
import { Section } from '../../../store/types/section.type';
import { INGREDIENT_FORM } from '../../../constants';

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
    this.#initForm();
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

  #initForm = () => {
    this.addForm = new FormGroup({
      [INGREDIENT_FORM.ID]: new FormControl(UUID()),
      [INGREDIENT_FORM.AMOUNT]: new FormControl(1, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
      [INGREDIENT_FORM.NAME]: new FormControl('', Validators.required),
      [INGREDIENT_FORM.CATEGORY]: new FormControl(''),
    });
  }
}
