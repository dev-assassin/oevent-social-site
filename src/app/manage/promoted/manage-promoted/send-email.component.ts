import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pluck';
import { Component, OnInit, Input } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AppService } from '../../../services/app-service';
import { EmailMessage } from '../../../shared-models/email-message';
import { EmailService } from '../../../shared-module/services/email.service';
import { ToastyService } from 'ng2-toasty';
import * as moment from 'moment';
import { FieldValidation } from '../../../../assets/common/validation/field-validation';
import { EventService } from '../../../event/services/event-service';
declare var Quill: any;

@Component({
    selector: 'app-my-event-send-email',
    template: `
        <h3 class="line" style="margin-bottom:0px;">
            {{ eventService.event.title }} - Send Email
        </h3>

        <div div class="row">
            <div class="col-md-12">
                <label>
                    Reply-to Email
                </label>
                <div>
                    <input class="form-control" disabled [(ngModel)]="replyToEmail" />
                </div>
            </div>
        </div>

        <div class="row padding-vertical">

                <div class="col-md-4">
                 <label>
                    To:
                </label>
                <select class="form-control" [(ngModel)]="listGroup" (change)="listGroupSelected()">
                    <option value="my_attendees">
                        My Attendees ({{attendeeEmails.length}})
                    </option>
                    <option value="organizer">
                        Organizer ({{ organizerEmail }})
                    </option>
                </select>
                </div>
                <div class="col-md-4" *ngIf="listGroup == 'attendees_by_registration_type'">
                 <label>
                    Registration Type:
                </label>
                 <select class="form-control" [(ngModel)]="regType" >
                    <option value="{{regType.$key}}" *ngFor="let regType of eventService.eventTickets$ | async">
                        {{regType.ticketTitle}} ({{registrationTypeAttendees.get(regType.$key)?
                            registrationTypeAttendees.get(regType.$key).length:0}})
                    </option>
                </select>
                </div>

        </div>

        <div div class="row">
            <div class="col-md-12 {{!fieldValidations.get('subject').valid?'has-error':''}}">
                <label>
                    Subject
                </label>
                <div>
                    <input class="form-control" [(ngModel)]="subject" />
                    <div *ngIf="!fieldValidations.get('subject').valid" class="validation-error-text">
                    {{fieldValidations.get("subject").errorMessage}}
                    </div>

                </div>
            </div>
        </div>

        <!-- <div div class="row padding-vertical">
            <div class="col-md-4">
                <label>
                    Salutation
                </label>
                <div>
                    <select class="form-control">>
                        <option>Hi</option>
                    </select>
                </div>
            </div>
            <div class="col-md-4">
                <label>
                    &nbsp;
                </label>
                <div>
                    <select class="form-control">>
                        <option>&lt;First Name&gt;</option>
                    </select>
                </div>
            </div>
        </div> -->

        <div class="row">
            <div class="col-md-12 {{!fieldValidations.get('body').valid?'has-error':''}}">
                <label>
                    Body
                </label>
                <div>
                    <div id="toolbar"></div>
                    <div id="message" style="min-height:150px;"></div>
                    <div *ngIf="!fieldValidations.get('body').valid" class="validation-error-text">
                    {{fieldValidations.get("body").errorMessage}}
                    </div>
                </div>
            </div>
        </div>

        <div class="row padding-vertical">
            <div class="col-md-9">
                <label>
                    Send Test Email
                </label>
                <div>
                    <input class="form-control" [(ngModel)]="testEmail" />
                </div>
            </div>
            <div class="col-md-3">
                <br />
                <button class="btn btn-primary btn-block" (click)="sendTestEmail()">Send</button>
            </div>
        </div>

        <div class="row">
            <div class="col-md-12">
                <button class="btn btn-primary btn-lg" (click)="sendEmail()">Send Now</button> &nbsp;
               <!-- <button class="btn btn-outline-primary btn-lg">Save as Draft</button> &nbsp;  -->
                <button class="btn btn-default btn-lg" (click)="cancel()">Cancel</button> &nbsp;
            </div>
        </div>
    `,
    styles: [
        ``
    ]

})

export class PromotedSendEmailComponent implements OnInit {

    @Input() title: string;
    eventId: string;
    set = false;
    replyToEmail: string;
    promoters$: any;
    attendees$: any;
    subject: string;
    promotersCount: number;
    attendeesCount: number;
    everyOneCount: number;
    registrationTypeAttendees: Map<string, string[]>;
    body: string;
    toList: string;
    promoterEmails: string[];
    attendeeEmails: string[];
    listGroup: string;
    fieldValidations: Map<string, FieldValidation>;
    valid = true;
    testEmail: string;
    regType: string;
    messageQuill: any;
    organizerEmail: string;
    listGroupSelected: string;


    constructor(private toasty: ToastyService,
        private af: AngularFireDatabase,
        public eventService: EventService,
        public appService: AppService,
        public emailService: EmailService) {
        this.listGroup = '';
        this.promoterEmails = new Array<string>();
        this.attendeeEmails = new Array<string>();
        this.registrationTypeAttendees = new Map<string, string[]>();
        this.attendees$ = this.eventService.getAttendeesByType();
        this.promoters$ = this.eventService.getPromoters();
        this.initFieldValidations();
    }

    initFieldValidations() {
        this.fieldValidations = new Map<string, FieldValidation>();
        this.fieldValidations.set('subject', new FieldValidation());
        this.fieldValidations.set('body', new FieldValidation());
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterViewInit() {
        // INITIALIZE QUILL EDITOR
        this.initializeEdit();
    }

    initializeEdit() {

        const toolbarOptions = [
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],
            ['link']
        ];

        // INSTANTIATE BASED ON ID
        this.messageQuill = new Quill('#message', {
            modules: {
                toolbar: toolbarOptions
            },
            theme: 'snow'
        });


        /** @PRAKASH THIS IS HOW YOU ACCESS THE EDITOR HTML AS A STRING **/
        console.log(this.messageQuill.root.innerHTML);


    }

    ngOnInit() {
        this.loadReplyToEmail();
        if (this.eventService.set) {
            this.set = true;
            this.loadToLists();
        } else {
            this.eventService.eventUpdated.first()
                .subscribe(() => {
                    this.set = true;
                    this.loadToLists();
                });
        }

        if (this.appService.contactSet) {
            this.replyToEmail = this.appService.contact.email;
        } else {
            this.appService.contactEmitter.first().subscribe(() => {
                this.replyToEmail = this.appService.contact.email;
            });
        }

        if (this.eventService.profileSet) {
            this.organizerEmail = this.eventService.profile.email;
        } else {
            this.eventService.profileEmitter.first().subscribe(() => {
                this.organizerEmail = this.eventService.profile.email;
            });
        }

        if (this.appService.ocodeSet) {
            this.populateAttendees();
        } else {
            this.appService.ocodeService.ocodeEmitter.subscribe((ocode) => {
                this.populateAttendees();
            });
        }


    }

    loadReplyToEmail() {
        if (this.appService.contact.email) {
            this.replyToEmail = this.appService.contact.email;

        } else {
            this.replyToEmail = this.appService.auth.email;
            this.af.object(`/contact/${this.appService.auth.id}`)
                .subscribe((snap) => {
                    this.replyToEmail = snap.email;
                });

        }
    }


    loadToLists(): void {
        this.everyOneCount = 0;
        this.promoters$.subscribe((data) => {
            this.promotersCount = data.length;
            this.everyOneCount += data.length;
        });


    }

    populatePromoters() {
        this.promoters$.subscribe((data) => {
            if (data && data.length > 0) {

                for (const promoter of data) {
                    this.af.object(`/ocodes/${promoter.$key}`)
                        .subscribe((snap) => {

                            this.af.object(`/contact/${snap.uid}`)
                                // tslint:disable-next-line:no-shadowed-variable
                                .subscribe((snap) => {

                                    this.promoterEmails.push(String(snap.email));
                                });


                        });
                }

            }
        });
    }

    populateAttendees() {
        this.attendeesCount = 0;
        this.eventService.getAttendeesByOcode(this.appService.ocode).then((attendees) => {
            console.log(attendees);
            this.attendeeEmails = [];
            for (const attendee of attendees) {
                this.attendeeEmails.push(attendee.email);
            }
            this.listGroup = 'my_attendees';
        });
    }

    cancel() {
        this.subject = '';
        this.body = '';
        this.toList = '';
        this.regType = '';
        this.listGroup = '';
    }

    validToSend(emailMessage: EmailMessage): boolean {
        this.valid = true;
        this.fieldValidations.set('subject', new FieldValidation());
        this.fieldValidations.set('body', new FieldValidation());

        if (FieldValidation.isEmptyText(emailMessage.subject)) {
            this.fieldValidations.get('subject').valid = false;
            this.fieldValidations.get('subject').errorMessage = 'Subject is required';
            this.valid = false;
        }
        if (FieldValidation.isEmptyText(emailMessage.body)) {
            this.fieldValidations.get('body').valid = false;
            this.fieldValidations.get('body').errorMessage = 'Body is required';
            this.valid = false;
        }
        return this.valid;
    }


    sendTestEmail() {
        this.sendEmailToRecipient(this.testEmail);
    }

    sendEmail() {
        let toList: string;
        if (this.listGroup === 'my_attendees') {
            toList = this.attendeeEmails.join(',');
        } else if (this.listGroup === 'organizer') {
            toList = this.organizerEmail;
        }
        this.sendEmailToRecipient(toList);
    }

    sendEmailToRecipient(toList: string) {

        const pendingMessage: EmailMessage = new EmailMessage();
        pendingMessage.subject = this.subject;
        pendingMessage.body = this.messageQuill.root.innerHTML;
        pendingMessage.from = this.replyToEmail;
        pendingMessage.sendDateTime = moment().unix();
        pendingMessage.toList = toList;

        if (this.validToSend(pendingMessage)) {
            this.emailService.triggerPendingEmail(pendingMessage)
                .then(() => {
                    this.toasty.success('Email Sent');
                }, (err) => {
                    this.toasty.error(err.message);
                });
        } else {
            this.toasty.error('Validation failed');
        }
    }
}
