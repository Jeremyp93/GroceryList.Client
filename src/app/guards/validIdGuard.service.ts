import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { validate as uuidValidate } from 'uuid';

export const validIdGuard: CanActivateFn = (route, _) => {
    const router = inject(Router);

    const id = route.paramMap.get('id') ?? '';

    const isValid = uuidValidate(id);

    if (!isValid) {
        return router.createUrlTree(['/grocery-list']);
    }

    return true;
};