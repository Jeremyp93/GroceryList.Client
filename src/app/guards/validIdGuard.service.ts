import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const validIdGuard: CanActivateFn = (route, _) => {
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const router = inject(Router);

    const id = route.paramMap.get('id') ?? '';

    const isValid = guidRegex.test(id);

    if (!isValid) {
        return router.createUrlTree(['/grocery-list']);
    }

    return true;
};