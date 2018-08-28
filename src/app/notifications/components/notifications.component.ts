import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pluck';

import {Component, AfterContentInit, OnInit} from '@angular/core';
import {Router, NavigationEnd, RoutesRecognized, ActivatedRoute, Params} from '@angular/router';
import {AuthService} from "../../auth/services/auth-service";
import {AppService} from "../../services/app-service";
import {NotificationSettingsComponent} from "./notification-settings.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NotificationSettingService} from "../services/notification-setting.service";
import {InappNotificationService} from "../../shared-module/services/inapp-notification.service";
import {Message} from "../models/Message";
import {FirebaseListObservable, FirebaseOperation} from "angularfire2/database/firebase_list_observable";
import {AngularFireDatabase} from "angularfire2/database/database";

@Component({

    templateUrl: './notifications.component.html',
    styles: [
        `
           
        `
    ],

})

export class NotificationsComponent implements OnInit{
    activeMessages: Message[];
    constructor(private auth: AuthService,
                private modalService: NgbModal,
                public inAppNotificationService:InappNotificationService
    ) {
        this.activeMessages = new Array();

        //this.activeMessages = inAppNotificationService.getActiveMessages(this.auth.id);
        let message = new Message();
        message.title = "hello";
        message.from = "shane loveland";
        message.body = "How are you doing ??";
        message.sentDate = new Date();
        inAppNotificationService.addMessage(this.auth.id,message);
    }

    ngOnInit(){
        this.inAppNotificationService.getActiveMessages(this.auth.id).subscribe((data) => {
            this.activeMessages = data;
        });
    }


    public openNotifSettings(){
        const notifSettings = this.modalService.open(NotificationSettingsComponent);
        notifSettings.componentInstance.name = "NotificationSettings";
    }


}
