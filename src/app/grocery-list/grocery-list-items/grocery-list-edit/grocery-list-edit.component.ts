import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-grocery-list-edit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grocery-list-edit.component.html',
  styleUrl: './grocery-list-edit.component.scss'
})
export class GroceryListEditComponent implements OnInit {
  route = inject(ActivatedRoute);
  id: string = '';

  ngOnInit(): void {
    this.route.params.subscribe(async (params: Params) => {
      this.id = params['id'];

    });
  }

}
