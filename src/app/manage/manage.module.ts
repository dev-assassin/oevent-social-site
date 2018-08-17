import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ManageComponent } from './manage-component';
import { PromotedComponent } from './promoted/promoted.component';
import { OrganizedDetailComponent } from './organized/event-detail/detail-component';

import { SharedModule } from '../shared-module/shared.module';
import { OrganizedComponent } from './organized/organized.component';
import { OrganizedLiveComponent } from './organized/live/live.component';
import { OrganizedHistoryComponent } from './organized/history/history.component';
import { OrganizedDraftComponent } from './organized/drafts/draft-component';
import { PromotedLiveComponent } from './promoted/live/live.component';
import { PromotedHistoryComponent } from './promoted/history/history.component';
import { RegistrationsBookmarksComponent } from './registrations/bookmarks/bookmarks.component';
import { RegistrationsHistoryComponent } from './registrations/history/history.component';
import { RegistrationsUpcomingComponent } from './registrations/upcoming/upcoming.component';
import { RegistrationsComponent } from './registrations/registrations.component';
import { ManageRegistrationsService } from './registrations/manage-registrations.service';
import { ManageCardComponent } from './manage-card/manage-card.component';
import { RegistrationsManageComponent } from './registrations/manage-registrations.component';
import { PromotedEventDetailsComponent } from './promoted/manage-promoted/event-details.component';
import { PromotedInviteComponent } from './promoted/manage-promoted/invite.component';
import { PromotedManageMenuComponent } from './promoted/manage-promoted/manage-menu.component';
import { PromotedMyRegistrationsComponent } from './promoted/manage-promoted/my-registrations.component';
import { PromotedRegistrationTypesComponent } from './promoted/manage-promoted/registration-types.component';
import { PromotedSendEmailComponent } from './promoted/manage-promoted/send-email.component';
import { PromotedSentMessagesComponent } from './promoted/manage-promoted/sent-messages.component';
import { ManagePromotedComponent } from './promoted/manage-promoted/manage.component';
import { PromoterRegistrant } from './promoted/manage-promoted/_promoter-registrant.component';
import { PromoterRegistrationTypeDetailComponent } from './promoted/manage-promoted/_promoter-registration-type.component';
import { AuthGuard } from '../auth/guards/auth-guard';

const routes: Routes = [
    { path: '', component: ManageComponent, canActivate: [AuthGuard] },
    {
        path: 'organized', component: OrganizedComponent, canActivate: [AuthGuard], children: [
            { path: '', component: OrganizedLiveComponent },
            { path: 'live', component: OrganizedLiveComponent },
            { path: 'drafts', component: OrganizedDraftComponent },
            { path: 'history', component: OrganizedHistoryComponent },
        ]
    },

    {
        path: 'promoted', component: PromotedComponent, canActivate: [AuthGuard], children: [
            { path: '', component: PromotedLiveComponent },
            { path: 'live', component: PromotedLiveComponent },
            { path: 'history', component: PromotedHistoryComponent }
        ]
    },

    {
        path: 'promoted/:id', component: ManagePromotedComponent, canActivate: [AuthGuard], children: [
            { path: 'event-details', component: PromotedEventDetailsComponent },
            { path: 'invite', component: PromotedInviteComponent },
            { path: 'my-registrations', component: PromotedMyRegistrationsComponent },
            { path: 'registration-types', component: PromotedRegistrationTypesComponent },
            { path: 'send-email', component: PromotedSendEmailComponent },
            { path: 'sent-messages', component: PromotedSentMessagesComponent },
        ]
    },

    {
        path: 'attending', component: RegistrationsComponent, canActivate: [AuthGuard], children: [
            { path: '', component: RegistrationsUpcomingComponent },
            { path: 'upcoming', component: RegistrationsUpcomingComponent },
            { path: 'history', component: RegistrationsHistoryComponent },
            { path: 'bookmarks', component: RegistrationsBookmarksComponent }
        ]
    },
    { path: 'attending/:id', component: RegistrationsManageComponent }
];

@NgModule({
    declarations: [
        ManageComponent,
        OrganizedDetailComponent,
        PromotedComponent,
        PromotedLiveComponent,
        PromotedHistoryComponent,
        OrganizedComponent,
        OrganizedLiveComponent,
        OrganizedHistoryComponent,
        OrganizedDraftComponent,
        RegistrationsComponent,
        RegistrationsBookmarksComponent,
        RegistrationsHistoryComponent,
        RegistrationsUpcomingComponent,
        ManageCardComponent,
        RegistrationsManageComponent,
        ManagePromotedComponent,
        PromotedEventDetailsComponent,
        PromotedInviteComponent,
        PromotedManageMenuComponent,
        PromotedMyRegistrationsComponent,
        PromotedRegistrationTypesComponent,
        PromotedSendEmailComponent,
        PromotedSentMessagesComponent,
        PromoterRegistrant,
        PromoterRegistrationTypeDetailComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    providers: [
        ManageRegistrationsService
    ]
})

export class ManageModule { }
