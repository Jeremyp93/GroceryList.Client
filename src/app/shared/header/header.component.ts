import { Component, Input, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() title: string = '';
  @Input() backButton: boolean = false;

  router = inject(Router);
  route = inject(ActivatedRoute);

  back = () => {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
