import { Component, Input, inject, Signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {
  @Input() visible: boolean = false;
  @Input() message: string = '';
}
