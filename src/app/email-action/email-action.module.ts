import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {EmailActionComponent} from "./components/email-action.component";
import {EmailActionService} from "./services/email-action.service";
import {PasswordResetComponent} from "./components/password-reset.component";
import {AuthGuard} from "../auth/guards/auth-guard";

const routes: Routes = [
    {path: '', component: EmailActionComponent, canActivate: [AuthGuard]}
];


@NgModule({
    declarations: [
        EmailActionComponent,
        PasswordResetComponent
    ],
    entryComponents: [

    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes)
    ],
    providers: [
        EmailActionService
    ]
})

export class EmailActionModule {}
