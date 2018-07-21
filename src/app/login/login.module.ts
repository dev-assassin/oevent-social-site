import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { UnauthGuard } from '../auth/guards/unauth-guard';
import { LoginComponent } from './components/login';
import { AppModule } from '../app.module';
import { SharedModule } from '../shared-module/shared.module';

const routes: Routes = [
    { path: '', component: LoginComponent, canActivate: [UnauthGuard] }
];


@NgModule({
    declarations: [
        LoginComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        RouterModule.forChild(routes)
    ],
    providers: [

    ]
})

export class LoginModule { }

// SERVICE WILL GO HERE IF NEEDED
export { };
