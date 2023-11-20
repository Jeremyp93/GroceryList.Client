import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isKeyboardOpen = false;
  previousHeight: number = 0;

  @HostListener('window:resize')
  onResize() {
    const currentHeight = window.innerHeight;
    const heightDifference = Math.abs(currentHeight - this.previousHeight);

    const threshold = 100;

    if (heightDifference > threshold) {
      if (currentHeight < this.previousHeight) {
        this.isKeyboardOpen = true;
      } else {
        this.isKeyboardOpen = false;
      }
      this.previousHeight = currentHeight;
    }
  }
}
