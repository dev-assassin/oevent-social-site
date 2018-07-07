import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { FollowingOverviewComponent } from './components/overview.component';
import { MyFollowersComponent } from './components/my-followers.component';
import { DiscoverComponent } from './components/discover.component';
import { FollowingComponent } from './components/follows.component';
import { FollowingService } from './services/following.service';
import { FollowingPerson } from './components/_person.component';
import { AuthGuard } from '../auth/guards/auth-guard';

const routes: Routes = [
    { path: '', component: FollowingOverviewComponent, canActivate: [AuthGuard] },
    { path: 'follows', component: FollowingComponent, canActivate: [AuthGuard] },
    { path: 'followers', component: MyFollowersComponent, canActivate: [AuthGuard] },
    { path: 'discover', component: DiscoverComponent, canActivate: [AuthGuard] }
];

@NgModule({

    declarations: [
        FollowingOverviewComponent,
        MyFollowersComponent,
        DiscoverComponent,
        FollowingOverviewComponent,
        FollowingComponent,
        FollowingPerson
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes)
    ],
    providers: [
        FollowingService
    ]

})

export class FollowingModule { }

export { };
