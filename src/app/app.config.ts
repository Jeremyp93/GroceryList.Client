import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsModule } from '@ngxs/store';

import { routes } from './app.routes';
import { GroceryListState } from './grocery-list/ngxs-store/grocery-list.state';
import { IngredientState } from './grocery-list/ngxs-store/ingredient.state';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimations(), provideHttpClient(), importProvidersFrom(NgxsModule.forRoot([GroceryListState, IngredientState]), NgxsReduxDevtoolsPluginModule.forRoot())]
};

