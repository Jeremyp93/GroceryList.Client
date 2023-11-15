import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { GroceryListService } from './grocery-list/grocery-list.service';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)]
};
