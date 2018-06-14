import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CreateComponent} from './components/create.component';
import {AuthGuard} from '../auth/guards/auth-guard';
import {EditComponent} from './components/edit/edit.component';
import {PreviewComponent} from './components/preview/preview.component';
import {AdvancedComponent} from './components/advanced/advanced.component';
import {AdvancedCompletionComponent} from './components/advanced/views/completion.component';
import {AdvancedConfirmationComponent} from './components/advanced/views/confirmation.component';
import {AdvancedEmailComponent} from './components/advanced/views/email.component';
import {AdvancedFieldsComponent} from './components/advanced/views/fields.component';
import {AdvancedPromoterComponent} from './components/advanced/views/promoter.component';
import {AdvancedRegistrantComponent} from './components/advanced/views/registrant.component';
import {AdvancedReminderComponent} from './components/advanced/views/reminder.component';

const routes: Routes = [
  {path: '', component: CreateComponent},
  {
    path: ':id',
    component: CreateComponent,
    canActivate: [AuthGuard],
    children: [
      {path: '', component: EditComponent, canActivate: [AuthGuard]},
      {path: 'edit', component: EditComponent, canActivate: [AuthGuard]},
      {path: 'preview', component: PreviewComponent, canActivate: [AuthGuard]},
      {
        path: 'advanced', component: AdvancedComponent, canActivate: [AuthGuard], children: [
        {path: '', component: AdvancedEmailComponent, canActivate: [AuthGuard]},
        {path: 'completion', component: AdvancedCompletionComponent, canActivate: [AuthGuard]},
        {path: 'confirmation', component: AdvancedConfirmationComponent, canActivate: [AuthGuard]},
        {path: 'email', component: AdvancedEmailComponent, canActivate: [AuthGuard]},
        {path: 'fields', component: AdvancedFieldsComponent, canActivate: [AuthGuard]},
        {path: 'promoter', component: AdvancedPromoterComponent, canActivate: [AuthGuard]},
        {path: 'registrant', component: AdvancedRegistrantComponent, canActivate: [AuthGuard]},
        {path: 'reminder', component: AdvancedReminderComponent, canActivate: [AuthGuard]}
      ]
      },
    ]
  }
];

export const createRouting: ModuleWithProviders = RouterModule.forChild(routes);
