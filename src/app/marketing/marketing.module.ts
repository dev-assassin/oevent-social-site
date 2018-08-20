import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared-module/shared.module';
import { LowerCaseDirective } from './directives/lowercase';
import { MembershipOptionsComponent } from './components/membership-options.component';
import { MembershipService } from './services/membership.service';
import { AuthGuard } from '../auth/guards/auth-guard';

const routes: Routes = [
    { path: '', component: MembershipOptionsComponent, canActivate: [AuthGuard] }
];

@NgModule({
    declarations: [
        LowerCaseDirective,
        MembershipOptionsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    providers: [
        MembershipService
    ]
})

export class MarketingModule { }

export { MembershipService };
