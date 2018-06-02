import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppHeaderComponent } from './app-components/app-header';

const lazyRoutes: Routes = [
  { path: 'create', component: AppHeaderComponent }
];

export const lazyRouting: ModuleWithProviders = RouterModule.forRoot(lazyRoutes);
