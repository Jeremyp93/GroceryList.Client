import { Routes } from '@angular/router';
import { GroceryListDetailsComponent } from './grocery-list/grocery-list-details/grocery-list-details.component';
import { GroceryListItemsComponent } from './grocery-list/grocery-list-items/grocery-list-items.component';
import { GroceryListComponent } from './grocery-list/grocery-list.component';
import { GroceryListResolverService } from './grocery-list/grocery-list-resolver.service';

export const routes: Routes = [
    { path: '', redirectTo: 'grocery-list', pathMatch: 'full' },
    {
        path: 'grocery-list', component: GroceryListComponent, children: [
            { path: '', component: GroceryListItemsComponent, pathMatch: 'full' },
            { path: ':id', component: GroceryListDetailsComponent },
        ]
    },
];
