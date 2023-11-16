import { Routes } from '@angular/router';
import { GroceryListDetailsComponent } from './grocery-list/grocery-list-details/grocery-list-details.component';
import { GroceryListItemsComponent } from './grocery-list/grocery-list-items/grocery-list-items.component';
import { GroceryListComponent } from './grocery-list/grocery-list.component';
import { GroceryListResolverService } from './grocery-list/grocery-list-resolver.service';
import { GroceryListEditComponent } from './grocery-list/grocery-list-items/grocery-list-edit/grocery-list-edit.component';
import { GroceryListNewComponent } from './grocery-list/grocery-list-items/grocery-list-new/grocery-list-new.component';
import { validIdGuard } from './guards/validIdGuard.service';

export const routes: Routes = [
    { path: '', redirectTo: 'grocery-list', pathMatch: 'full' },
    {
        path: 'grocery-list', component: GroceryListComponent, children: [
            { path: '', component: GroceryListItemsComponent, pathMatch: 'full' },
            { path: 'new', component: GroceryListNewComponent },
            { path: ':id', component: GroceryListDetailsComponent, canActivate: [validIdGuard] },
            { path: ':id/edit', component: GroceryListEditComponent, canActivate: [validIdGuard] },
        ]
    },
];
