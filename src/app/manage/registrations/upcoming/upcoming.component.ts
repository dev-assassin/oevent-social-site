import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pluck';

import {Component, AfterContentInit} from '@angular/core';
import {Router, NavigationEnd, RoutesRecognized} from '@angular/router';
import {AuthService} from "../../../auth/services/auth-service";
import {ManageRegistrationsService} from "../manage-registrations.service";

@Component({
    template: `
        <div class="row">
            <div 
            manage-card 
            class="col-sm-6" 
            *ngFor="let event of promotionsService.myRegistrations$ | async" 
            [eventId]="event.$key" 
            [eventType]="'attendingLive'"></div>
        </div>
    `,
    styles: [

    ]
})

export class RegistrationsUpcomingComponent{

    constructor(private auth: AuthService,
                private router: Router,
                public promotionsService: ManageRegistrationsService) {

    }

}

