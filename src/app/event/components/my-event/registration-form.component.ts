import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pluck';

import { Component, AfterContentInit, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../../../auth/services/auth-service';
import { EventService } from '../../services/event-service';
import { IoEvent, oEvent } from '../../../shared-models/oevent';
import { PromoteModalComponent } from '../event/modals/promote-modal-component';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';
import { AttendModalComponent } from '../event/modals/attend-modal-component';
declare var Quill: any;

@Component({
    selector: 'app-my-event-registration-form',
    template: `
        <h3 class="line" style="margin-bottom:0px;">
            {{ eventService.event.title }} - Registration Form
        </h3>

        <manage-fields></manage-fields>
    `,
    styles: [
        `
                .c-cart-table-title{
                    border-bottom: 1px solid;
                    border-color: rgba(135, 151, 174, 0.15);
                }
        `
    ]

})

export class MyEventRegistrationFormComponent implements OnInit {

    constructor(private af: AngularFireDatabase, public eventService: EventService) {

    }

    ngOnInit() {

    }
}
