import { Component, AfterContentInit, OnInit } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized, ActivatedRoute, Params } from '@angular/router';
import { AppService } from '../../../../services/app-service';
import { AuthService } from '../../../../auth/services/auth-service';
import { CreateAdvancedService } from '../../../../create/components/advanced/services/advanced.service';
import { EventFormFields } from '../../../../create/components/advanced/models/advanced-settings';

@Component({
    selector: 'app-manage-fields',
    templateUrl: './fields.component.html',
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

export class ManageAdvancedFieldsComponent implements OnInit {

    eventFields: EventFormFields = new EventFormFields();
    loaded = false;

    constructor(private auth: AuthService,
        private appService: AppService,
        private router: Router,
        private route: ActivatedRoute,
        private advancedService: CreateAdvancedService) {

        if (this.advancedService.eventSet) {
            this.eventFields = this.advancedService.eventSettings.RegistrationFields;
            this.loaded = true;
        } else {
            this.advancedService.waitForSet.first().subscribe(() => {
                this.eventFields = this.advancedService.eventSettings.RegistrationFields;
                this.loaded = true;
            });
        }

    }

    ngOnInit() {

    }

    save() {
        this.appService.startLoadingBar();
        // GIVE TIME FOR THE UI-SWITCH VALUE TO CYCLE
        setTimeout(() => {
            this.advancedService.eventSettings$.update({
                RegistrationFields: this.eventFields
            }).then(() => {
                this.appService.completeLoadingBar();
            });
        }, 200);
    }


}
