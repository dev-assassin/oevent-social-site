import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import {LandingComponent} from './components/landing';
import {UnauthGuard} from '../auth/guards/unauth-guard';

const routes: Routes = [
    {path: '', component: LandingComponent, canActivate: [UnauthGuard]}
];


@NgModule({
    declarations: [
        LandingComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes)
    ],
    providers: [

    ]
})

export class LandingModule {}

// SERVICE WILL GO HERE IF NEEDED
export { };
