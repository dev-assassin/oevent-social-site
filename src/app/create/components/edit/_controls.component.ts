import { Component, AfterContentInit, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized, ActivatedRoute, Params } from '@angular/router';
import { AppService } from "../../../services/app-service";
import { AuthService } from "../../../auth/services/auth-service";
import { ToastyService } from "ng2-toasty";
import { CreateEventService } from "../../services/create-event.service";

@Component({
    selector: 'event-controls',

    template: `
        <div *ngIf="!createService.valid" class="validation-error-text"> See errors above.</div>
        <button class="btn btn-primary btn-lg" style="margin-right:25px;" (click)="save()">Save</button>
        <button class="btn btn-success btn-lg" style="margin-right:25px;" (click)="publish()" *ngIf="eventStatus == 'draft'">Go Live</button>
        <button class="btn btn-warning btn-lg" style="margin-right:25px;" (click)="publish(false)" *ngIf="eventStatus == 'active'">Unpublish</button>
        <a (click)="gotoAdvanced()" *ngIf="createService.showAdvanced()">Advanced Options</a>
        
    `,
    styles: [
        `
            :host{
                display:block;
                text-align:center;
            }  
        `
    ],

})

export class EditControlsComponent implements OnInit {

    eventStatus: string;

    constructor(private auth: AuthService,
        private appService: AppService,
        private router: Router,
        private route: ActivatedRoute,
        private toasty: ToastyService,
        public createService: CreateEventService, ) {

    }

    ngOnInit() {

        this.eventStatus = this.createService.draft.status;

        this.createService.draftUpdated.subscribe(() => {
            this.eventStatus = this.createService.draft.status;
        });

    }

    save() {
        if (this.createService.isDraft()) {
            if (this.createService.validateMin()) {
                this.toasty.success("Draft Saved!");
            }
            else {
                this.toasty.error("Error validating");
            }
        } else if (this.createService.isLive()) {
            if (this.createService.validateLive()) {
                this.createService.publish();
            }
        }
    }

    publish(live: boolean = true) {
        if (this.createService.validateLive()) {
            this.save();
            if (live) {

                this.createService.publish()

            }
            else {
                this.createService.publish(false);
            }
        } else {
            this.toasty.error("Error validating");
        }
    }

    gotoAdvanced() {
        this.save();
        this.router.navigateByUrl(`/create/${this.createService.eventId}/advanced`);
    }

}