import {NgModule, ModuleWithProviders} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FirebaseModule } from '../firebase';

import { AppComponent } from './app-components/app.component';
import { AppHeaderComponent } from './app-components/app-header';

import {HomeModule} from "./home/home.module";
import {AccountModule} from "./account/account.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {SignInComponent} from "./shared-module/components/sign-in/sign-in";
import {FormsModule} from "@angular/forms";
import {AppService} from "./services/app-service";
import {JoinComponent} from "./shared-module/components/join/join";
import {SlimLoadingBarModule} from "ng2-slim-loading-bar/index";
import {ToastyModule} from "ng2-toasty/index";
//import {CreateModule} from "./create/create.module";
import {ManageModule} from "./manage/manage.module";
import {EventModule} from "./event/event.module";
import {ProfileModule} from "./profile/profile.module";
import {SearchModule} from "./search/search.module";
import {OCodeService} from "./services/ocode-service";
//import {MarketingModule} from "./marketing/marketing.module";
import {FreeTrialModalComponent} from "./app-components/free-trial-modal";
import {TopBarReminderComponent} from "./app-components/controls/top-bar-reminder.component";
import {FollowingModule} from "./following/following.module";
import {BookmarkModule} from "./bookmarks/bookmarks.module";
import {NotificationsModule} from "./notifications/notifications.module";
import {ForgotPasswordComponent} from "./app-components/forgot-password.component";
import {EmailActionModule} from "./email-action/email-action.module";
import {LandingModule} from "./landing/landing.module";
import {SwiperModule, SwiperConfigInterface} from "ngx-swiper-wrapper";
import {LoginModule} from "./login/login.module";
import {NeedOcodeComponent} from "./shared-module/components/need-ocode/need-ocode";
import {HttpModule} from "@angular/http";
import {SharedModule} from "./shared-module/shared.module";
import {AuthModule} from "./auth/auth.module";
import {Routes, RouterModule} from "@angular/router";
import {AuthGuard} from "./auth/guards/auth-guard";
import {RegistrationComponent} from "./event/components/registration/registration-component";
import {MyEventComponent} from "./event/components/my-event/my-event-component";
import { EventComponent } from "./event/components/event/event-component";
import {MyEventAttendeesComponent} from "./event/components/my-event/attendees-component";
import {MyEventPromotersComponent} from "./event/components/my-event/promoters-component";
import {MyEventDetailsComponent} from "./event/components/my-event/detail-component";
import {MyEventConfirmationComponent} from "./event/components/my-event/confirmation.component";
import {MyEventRegistrationFormComponent} from "./event/components/my-event/registration-form.component";
import {MyEventRegistrationTypesComponent} from "./event/components/my-event/registration-type.component";
import {MyEventRefundsComponent} from "./event/components/my-event/refunds.component";
import {MyEventInvitationsComponent} from "./event/components/my-event/invitations.component";
import {MyEventSendEmailComponent} from "./event/components/my-event/send-email.component";
import {MyEventScheduledEmailsComponent} from "./event/components/my-event/scheduled-emails.component";
import {MyEventSentEmailsComponent} from "./event/components/my-event/sent-messages.component";
import {RegistrationNewComponent} from "./event/components/registration/registration-new.component";
import {RegistrationConfirmationComponent} from "./event/components/registration/registration-confirmation.component";
import {CropModalComponent} from "./shared-module/components/crop-modal/crop-modal.component";

const ROUTES: Routes = [
  { path: '', loadChildren: './landing/landing.module#LandingModule' },
  { path: 'create', loadChildren: './create/create.module#CreateModule' },
  { path: 'search', loadChildren: './search/search.module#SearchModule' },
  { path: 'notifications', loadChildren: './notifications/notifications.module#NotificationsModule' },
  { path: 'marketing', loadChildren: './marketing/marketing.module#MarketingModule' },
  { path: 'manage', loadChildren: './manage/manage.module#ManageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginModule' },
  { path: 'home', loadChildren: './home/home.module#HomeModule' },
  { path: 'following', loadChildren: './following/following.module#FollowingModule' },
  { path: 'email-action', loadChildren: './email-action/email-action.module#EmailActionModule' },
  { path: 'account', loadChildren: './account/account.module#AccountModule' },
  { path: 'bookmarks', loadChildren: './bookmarks/bookmarks.module#BookmarkModule' },
  {path: 'event/:id', component: EventComponent, canActivate: [AuthGuard]},
  {path: 'register/:id', component: RegistrationComponent, canActivate: [AuthGuard]},
  {path: 'registernew/:id', component: RegistrationNewComponent, canActivate: [AuthGuard]},
  {path: 'registerconfirm/:id', component: RegistrationConfirmationComponent, canActivate: [AuthGuard]},

  //EVENT LOADS EAGERLY FOR NOW
  {
    path: 'my-event/:id',
    component: MyEventComponent,
    canActivate: [AuthGuard],
    children:[
      {path: '', component: MyEventDetailsComponent, canActivate: [AuthGuard]},
      {path: 'details', component: MyEventDetailsComponent, canActivate: [AuthGuard]},
      {path: 'promoters', component: MyEventPromotersComponent, canActivate: [AuthGuard]},
      {path: 'attendees',component: MyEventAttendeesComponent, canActivate: [AuthGuard]},
      {path: 'form',component: MyEventRegistrationFormComponent, canActivate: [AuthGuard]},
      {path: 'confirmation',component: MyEventConfirmationComponent, canActivate: [AuthGuard]},
      {path: 'registration',component: MyEventRegistrationTypesComponent, canActivate: [AuthGuard]},
      {path: 'refunds',component: MyEventRefundsComponent, canActivate: [AuthGuard]},
      {path: 'invitations',component: MyEventInvitationsComponent, canActivate: [AuthGuard]},
      {path: 'send-email',component: MyEventSendEmailComponent, canActivate: [AuthGuard]},
      {path: 'emails',component: MyEventScheduledEmailsComponent, canActivate: [AuthGuard]},
      {path: 'sent',component: MyEventSentEmailsComponent, canActivate: [AuthGuard]},
    ]
  },

  { path: 'profile', loadChildren: './profile/profile.module#ProfileModule' },
  { path: '**', loadChildren: './profile/profile.module#ProfileModule' },

];

//CAROUSEL ON HOME PAGE
const SWIPER_CONFIG: SwiperConfigInterface = {
    direction: 'horizontal',
    slidesPerView: 'auto',
    keyboardControl: true
};

@NgModule({
    bootstrap: [
        AppComponent
    ],
    providers: [
        AppService,
        OCodeService,
    ],
    declarations: [
        AppComponent,
        AppHeaderComponent,
        FreeTrialModalComponent,
        TopBarReminderComponent,
        ForgotPasswordComponent

    ],
    imports: [
        FirebaseModule,
        BrowserModule,
        RouterModule.forRoot(ROUTES, {enableTracing: true}),
        SharedModule,
        AuthModule,
        FormsModule,
        NgbModule.forRoot(),
        SlimLoadingBarModule.forRoot(),
        ToastyModule.forRoot(),
        SwiperModule.forRoot(SWIPER_CONFIG),
        HttpModule,

        //VIEWS
        //AccountModule,
        //NotificationsModule,
        //LandingModule,
        //HomeModule,
        //CreateModule,
        //ManageModule,
        EventModule,
        //SearchModule,
        //MarketingModule,
        //FollowingModule,
        //BookmarkModule,

        //EmailActionModule,
        //LoginModule,

        //IMPORTANT THAT THIS IS LAST SINCE IT HAS THE CATCH ALL ROUTE TO SHOW USER BY OEVENT CODE
        //ProfileModule
    ],
    entryComponents: [
        SignInComponent,
        JoinComponent,
        FreeTrialModalComponent,
        ForgotPasswordComponent,
        SignInComponent,
        JoinComponent,
        NeedOcodeComponent,
        CropModalComponent,
    ]
})

export class AppModule {}
