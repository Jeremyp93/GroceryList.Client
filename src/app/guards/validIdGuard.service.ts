import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { validate as uuidValidate } from 'uuid';

import { ROUTES_PARAM } from '../constants';

export const validIdGuard: CanActivateFn = (route, _) => {
    const router = inject(Router);

    const id = route.paramMap.get(ROUTES_PARAM.ID_PARAMETER) ?? '';

    const isValid = uuidValidate(id);

    if (!isValid) {
        return router.createUrlTree([`/${ROUTES_PARAM.GROCERY_LIST}`]);
    }

    return true;
};