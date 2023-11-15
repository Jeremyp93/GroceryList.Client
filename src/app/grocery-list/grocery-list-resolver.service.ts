import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { GroceryList, GroceryListService } from "./grocery-list.service";

export const GroceryListResolverService: ResolveFn<void> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    groceryListService = inject(GroceryListService),
): Promise<void> => {
    return groceryListService.getAllGroceryLists();
}