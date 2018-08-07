import { Component, AfterContentInit } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized } from '@angular/router';
import { AuthService } from '../../../auth/services/auth-service';
import { ManagePromotionsService } from '../../../shared-module/services/manage-promotions.service';

@Component({
    template: `
        SENT MESSAGES
    `,
    styles: [

    ]
})

export class PromotedSentMessagesComponent {

    constructor(private auth: AuthService,
        private router: Router,
        public promotionsService: ManagePromotionsService) {

    }

}
