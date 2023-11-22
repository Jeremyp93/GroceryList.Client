import { Component, Input, inject, Signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertService } from './alert.service';
import { AlertMessage } from './alert.type';


@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent implements OnInit {
  @Input() visible: boolean = false;
  alertService = inject(AlertService);
  messages!: Signal<AlertMessage[]>;

  ngOnInit(): void {
    this.messages = this.alertService.alertMessages;
  }
}
