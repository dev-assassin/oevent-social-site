import { Component, AfterContentInit, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized, ActivatedRoute, Params } from '@angular/router';
import { AppService } from '../../../services/app-service';
import { AuthService } from '../../../auth/services/auth-service';
import { ToastyService } from 'ng2-toasty';
import { CreateEventService } from '../../services/create-event.service';

@Component({
    selector: 'app-event-settings',

    template: `
        <div class="row">
            <div class="col-md-5">
                <label>Choose Category</label>
                <select class="form-control" [(ngModel)]="category" style="margin-top:4px;" (change)="saveCat()">
                    <option value="retreats">Retreats & Bootcamps</option>
                    <option value="intro">Intro Classes</option>
                    <option value="essential">Essential Wellness</option>
                    <option value="international">International</option>
                    <option value="corporate">Corporate Events</option>
                    <option value="diamond">Diamond Club</option>
                    <option value="business">Business Training</option>
                    <option value="specialty">Specialty Oil Classes</option>
                    <option value="skin">Skin & Body Care</option>
                    <option value="aromatic">Aromatic Certificate</option>
                    <option value="personal">Personal Development</option>
                    <option value="online">Online Events</option>
                </select>
            </div>

            <div class="col-md-7">
                <div id="keywords-container">
                    <label>Keywords</label>
                    <div class="key-words">
                        <rl-tag-input  (addTag)="saveKeywords()" (removeTag)="saveKeywords()"
                            [(ngModel)]="keywords" placeholder="Add relevant keywords" style="padding:0;">
                        </rl-tag-input>
                    </div>
                    <div class="error-text"></div>
                </div>
            </div>
        </div>
        <div class="row padding-vertical">
            <div class="col-sm-5">

                <div>
                    <label>Visibility</label>
                </div>

                <input type="radio" value="public" [(ngModel)]="visibility" name="visibility" (click)="saveVisibility()">
                    Public &nbsp; &nbsp; &nbsp;
                <input type="radio" value="private" [(ngModel)]="visibility" name="visibility" (click)="saveVisibility()">  Private

            </div>
            <div class="col-sm-7">

                <div>
                    <label> &nbsp; </label>
                </div>

                <input type="checkbox" [(ngModel)]="showRemainingTickets" (click)="saveTickets()">
                    Show Remaining Tickets &nbsp; &nbsp; &nbsp;
                <input type="checkbox" [(ngModel)]="showRegisteredAttendees" (click)="saveAttendees()">  Show Registered Attendees

            </div>
        </div>
    `,
    styles: [
        `
            :host{
                display:block;
            }
        `
    ],

})

export class EditSettingsComponent implements OnInit {

    category: String = '';
    keywords: String[] = [];
    visibility: String = 'public';
    showRemainingTickets: Boolean = true;
    showRegisteredAttendees: Boolean = true;

    constructor(private auth: AuthService,
        private appService: AppService,
        private router: Router,
        private route: ActivatedRoute,
        private toasty: ToastyService,
        private createService: CreateEventService, ) {

    }

    ngOnInit() {
        this.category = this.createService.draft.category;
        if (typeof this.createService.draft.keywords !== 'undefined') {
            this.keywords = this.createService.draft.keywords;
        }
        this.visibility = this.createService.draft.visibility;
        this.showRegisteredAttendees = this.createService.draft.showRegisteredAttendees;
        this.showRemainingTickets = this.createService.draft.showRemainingTickets;
    }

    saveCat() {
        this.createService.draftObject$.update({ category: this.category }).then(() => {
            this.createService.showSavedDraft();
        });
        if (this.createService.isLive()) {
            this.createService.publish();
        }
    }

    saveKeywords() {
        this.createService.draftObject$.update({ keywords: this.keywords }).then(() => {
            this.createService.showSavedDraft();
        });
        if (this.createService.isLive()) {
            this.createService.publish();
        }
    }

    saveVisibility() {
        this.createService.draftObject$.update({ visibility: this.visibility }).then(() => {
            this.createService.showSavedDraft();
        });
        if (this.createService.isLive()) {
            this.createService.publish();
        }
    }

    saveTickets() {
        setTimeout(() => {
            this.createService.draftObject$.update({ showRemainingTickets: this.showRemainingTickets }).then(() => {
                this.createService.showSavedDraft();
            });
        }, 500);
        if (this.createService.isLive()) {
            this.createService.publish();
        }
    }

    saveAttendees() {
        setTimeout(() => {
            this.createService.draftObject$.update({ showRegisteredAttendees: this.showRegisteredAttendees }).then(() => {
                this.createService.showSavedDraft();
            });
        }, 500);
        if (this.createService.isLive()) {
            this.createService.publish();
        }
    }

}
