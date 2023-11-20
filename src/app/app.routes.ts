import { Routes } from '@angular/router';
import { GroceryListDetailsComponent } from './grocery-list/grocery-list-details/grocery-list-details.component';
import { GroceryListItemsComponent } from './grocery-list/grocery-list-items/grocery-list-items.component';
import { GroceryListComponent } from './grocery-list/grocery-list.component';
import { GroceryListNewComponent } from './grocery-list/grocery-list-items/grocery-list-new/grocery-list-new.component';
import { validIdGuard } from './guards/validIdGuard.service';
import { StoreComponent } from './store/store.component';
import { StoreListComponent } from './store/store-list/store-list.component';

export const routes: Routes = [
    { path: '', redirectTo: 'grocery-lists', pathMatch: 'full' },
    {
        path: 'grocery-lists', component: GroceryListComponent, children: [
            { path: '', component: GroceryListItemsComponent, pathMatch: 'full' },
            { path: 'new', component: GroceryListNewComponent },
            { path: ':id', component: GroceryListDetailsComponent, canActivate: [validIdGuard] },
            { path: ':id/edit', component: GroceryListNewComponent, canActivate: [validIdGuard] },
        ]
    },
    {
        path: 'stores', component: StoreComponent, children: [
            { path: '', component: StoreListComponent, pathMatch: 'full' },
        ]
    },
];
