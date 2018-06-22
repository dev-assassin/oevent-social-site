import { Component, AfterContentInit, OnInit } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized, ActivatedRoute, Params } from '@angular/router';
import { AppService } from '../../../../services/app-service';
import { AuthService } from '../../../../auth/services/auth-service';
import { CreateAdvancedService } from '../services/advanced.service';
import { EventConfirmationSettings } from '../models/advanced-settings';
import { ToastyService } from 'ng2-toasty';

// ADD QUILL FOR TYPING
declare var Quill: any;

@Component({
    templateUrl: './confirmation.component.html',
    styles: [
        `
           .fa-gear, .fa-info-circle{
            font-size:24px;
            position:relative;
            top:2px;
           }

           .fa-info-circle{
                color:#999;
                cursor:help;
           }

           .col-sm-10{
            margin-top:-4px;
           }
        `
    ],

})

export class AdvancedConfirmationComponent {

    quill: any;
    eventConfirmation: EventConfirmationSettings = new EventConfirmationSettings();

    constructor(private auth: AuthService,
        private appService: AppService,
        private router: Router,
        private route: ActivatedRoute,
        private advancedService: CreateAdvancedService,
        private toasty: ToastyService) {

        // GIVE TIME TO ASSURE QUILL CONTAINER IS FULLY INITIALIZED
        if (this.advancedService.eventSet) {
            setTimeout(() => {
                this.initComponent();
            }, 300);
        } else {
            this.advancedService.waitForSet.first().subscribe(() => {
                console.log(this.advancedService.eventSettings);
                setTimeout(() => {
                    this.initComponent();
                }, 300);
            });
        }

    }

    initComponent() {
        this.setQuill();
        this.eventConfirmation = this.advancedService.eventSettings.Confirmation;
    }

    setQuill() {
        const toolbarOptions = [
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],
            ['link']
        ];

        // INSTANTIATE BASED ON ID
        this.quill = new Quill('#editor', {
            modules: {
                toolbar: toolbarOptions
            },
            theme: 'snow'
        });

        // ALLOW ATTACHMENT OF EDITOR FIRST
        setTimeout(() => { this.initContent(); }, 500);

    }

    initContent() {

        console.log(this.eventConfirmation.message);
        this.quill.setContents(this.eventConfirmation.message);

    }

    save() {

        this.appService.startLoadingBar();

        const message = this.quill.getContents();
        this.eventConfirmation.message = message;

        this.advancedService.eventSettings$.update({

            Confirmation: this.eventConfirmation

        }).then(() => {
            this.toasty.success('Event Confirmation Message Updated!');
            this.appService.stopLoadingBar();
        });

    }



}
