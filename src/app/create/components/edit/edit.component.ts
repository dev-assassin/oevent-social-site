import { Component, AfterContentInit, OnInit } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized, ActivatedRoute, Params } from '@angular/router';
import { AppService } from '../../../services/app-service';
import { AuthService } from '../../../auth/services/auth-service';
import { CreateEventService } from '../../services/create-event.service';
import { CreateEventDateService } from '../../services/create-date.service';

@Component({
    templateUrl: './edit.component.html',
    styles: [
        ``
    ],

})

export class EditComponent implements OnInit {

    date: string;

    constructor(private auth: AuthService,
        private appService: AppService,
        private router: Router,
        private route: ActivatedRoute,
        private createService: CreateEventService,
        private dateService: CreateEventDateService) {

    }

    ngOnInit() {
        this.createService.setEventId(this.createService.eventId);
    }


}
