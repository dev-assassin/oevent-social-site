import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { AccountComponent } from './components/account';
import { AccountService } from './services/account-service';
import {AccountMeComponent} from "./components/about/account-me-component";
import {AccountContactComponent} from "./components/contact/account-contact-component";
import {AccountPasswordComponent} from "./components/password/account-password-component";
import {AccountPaymentComponent} from "./components/payment/account-payment-component";
import {AccountPreferencesComponent} from "./components/preferences/account-preferences-component";
import {AccountSocialComponent} from "./components/social/account-social-component";
import {AccountSubscriptionComponent} from "./components/subscription/account-subscription-component";
import {AccountPasswordService} from "./components/password/account-password-service";
import {AccountPaymentService} from "./components/payment/account-payment-service";
import {AccountPreferencesService} from "./components/preferences/account-preferences-service";
import {AccountSocialService} from "./components/social/account-social-service";
import {AccountSubscriptionService} from "./components/subscription/account-subscription-service";
import { CountrySelectComponent } from '../app-components/controls/country-select.component';
import { UsCaStateProvinceSelectComponent } from '../app-components/controls/us_ca-state-province-select.component';
import {AccountSubscriptionInvoicesComponent} from "./components/subscription/_invoices.component";
import {AccountSubscriptionMembershipComponent} from "./components/subscription/_membership.component";
import {AccountSubscriptionMethodComponent} from "./components/subscription/_method.component";
import {ImageCropperModule} from "ng2-img-cropper";
import {EmailPopupComponent} from "../shared-module/components/email/email-popup.component";
import {CropModalComponent} from "../shared-module/components/crop-modal/crop-modal.component";

import {SharedModule} from "../shared-module/shared.module";
import {AuthGuard} from "../auth/guards/auth-guard";
import { UiSwitchModule } from 'ngx-ui-switch/src';

const routes: Routes = [
    {
        path: '',
        component: AccountComponent,
        canActivate: [AuthGuard],
        children:[
            {path: '', component: AccountContactComponent, canActivate: [AuthGuard]},
            {path: 'contact', component: AccountContactComponent, canActivate: [AuthGuard]},
            {path: 'password', component: AccountPasswordComponent, canActivate: [AuthGuard]},
            {path: 'about',component: AccountMeComponent, canActivate: [AuthGuard]},
            {path: 'social', component: AccountSocialComponent, canActivate: [AuthGuard]},
            {path: 'subscription', component: AccountSubscriptionComponent, canActivate: [AuthGuard], children:[
                {path: '', component: AccountSubscriptionMembershipComponent, canActivate: [AuthGuard]},
                {path: 'membership', component: AccountSubscriptionMembershipComponent, canActivate: [AuthGuard]},
                {path: 'invoices', component: AccountSubscriptionInvoicesComponent, canActivate: [AuthGuard]},
                {path: 'method', component: AccountSubscriptionMethodComponent, canActivate: [AuthGuard]}
            ]},
            {path: 'payment', component: AccountPaymentComponent, canActivate: [AuthGuard]},
            {path: 'preferences', component: AccountPreferencesComponent, canActivate: [AuthGuard]},
        ]
    },
];

@NgModule({
    declarations: [
        AccountComponent,
        AccountMeComponent,
        AccountContactComponent,
        AccountPasswordComponent,
        AccountPaymentComponent,
        AccountPreferencesComponent,
        AccountSocialComponent,
        AccountSubscriptionComponent,
        AccountSubscriptionInvoicesComponent,
        AccountSubscriptionMembershipComponent,
        AccountSubscriptionMethodComponent,
        CountrySelectComponent,
        UsCaStateProvinceSelectComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        RouterModule.forChild(routes),
        ImageCropperModule,
        UiSwitchModule,
    ],
    entryComponents: [

    ],
    providers: [
        AccountService,
        AccountPasswordService,
        AccountPaymentService,
        AccountPreferencesService,
        AccountSocialService,
        AccountSubscriptionService
    ]
})

export class AccountModule {}

export { AccountService };
