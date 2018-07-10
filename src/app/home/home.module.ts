import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home';
import { HomeService } from './services/home-service';
import {SwiperConfigInterface, SwiperModule} from 'ngx-swiper-wrapper';
import {FlexLayoutModule} from '@angular/flex-layout';
import {SharedModule} from '../shared-module/shared.module';
import {AuthGuard} from '../auth/guards/auth-guard';


const routes: Routes = [
    {path: '', component: HomeComponent, canActivate: [AuthGuard]}
];

// CAROUSEL ON HOME PAGE
const SWIPER_CONFIG: SwiperConfigInterface = {
    direction: 'horizontal',
    slidesPerView: 'auto',
    keyboardControl: true
};

@NgModule({
    declarations: [
        HomeComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
        SwiperModule.forChild(),
        FlexLayoutModule,
        SharedModule,
    ],
    providers: [
        HomeService
    ]
})

export class HomeModule {}

export { HomeService };
