import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pluck';

import {Component, AfterContentInit, OnInit, Input} from '@angular/core';
import {Router, NavigationEnd, RoutesRecognized, ActivatedRoute, Params} from '@angular/router';
import {FirebaseOperation} from "angularfire2/database/firebase_list_observable";
import {Message} from "../models/Message";
import {AuthService} from "../../auth/services/auth-service";
import {InappNotificationService} from "../../shared-module/services/inapp-notification.service";


@Component({
    selector:'notif-item',
    templateUrl: './notification-item.component.html',
    styles: [
        `           
        `
    ],
})

export class NotificationItemComponent implements OnInit{
    @Input() message: Message;
    @Input() mini:boolean;

    constructor(private auth: AuthService,private inAppNotificationService:InappNotificationService) {

    }

    ngOnInit(){

    }

    public archiveMessage(key:FirebaseOperation){
        this.inAppNotificationService.removeMessage(key,this.auth.id);
    }

}
