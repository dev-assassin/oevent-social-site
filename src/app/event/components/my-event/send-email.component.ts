import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pluck';
import { Component, OnInit, Input } from '@angular/core';
import { EventService } from '../../services/event-service';
import { AngularFireDatabase } from 'angularfire2/database';
import { AppService } from '../../../services/app-service';
import { EmailMessage } from '../../../shared-models/email-message';
import { EmailService } from '../../../shared-module/services/email.service';
import { ToastyService } from 'ng2-toasty';
import * as moment from 'moment';
import { FieldValidation } from '../../../../assets/common/validation/field-validation';
declare var Quill: any;

@Component({
    selector: 'app-my-event-send-email',
    templateUrl: `../send-email.component.html`,
    styles: [
        ``
    ]

})

export class MyEventSendEmailComponent implements OnInit {

    @Input() title: string;
    eventId: string;
    set = false;
    replyToEmail: string;
    promoters$: any;
    attendees$: any;
    subject: string;
    registrationTypeAttendees: Map<string, string[]>;
    body: string;
    toList: string;
    promoterEmails: string[];
    attendeeEmails: string[];
    allEmails: string[];
    listGroup: string;
    fieldValidations: Map<string, FieldValidation>;
    valid = true;
    testEmail: string;
    regType: string;
    messageQuill: any;


    constructor(private toasty: ToastyService, private af: AngularFireDatabase,
        public eventService: EventService,
        public appService: AppService, public emailService: EmailService) {
        this.listGroup = 'all';
        this.promoterEmails = new Array<string>();
        this.attendeeEmails = new Array<string>();
        this.allEmails = new Array<string>();
        this.registrationTypeAttendees = new Map<string, string[]>();
        this.attendees$ = this.eventService.getAttendeesByType();
        this.promoters$ = this.eventService.getPromoters();
        this.initFieldValidations();
        this.appService.updateContactAndAbout();
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
        this.populateAttendees();
        this.populatePromoters();
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
                                    this.allEmails.push(String(snap.email))
                                });


                        });
                }

            }
        });

    }

    populateAttendees() {
        this.attendees$.subscribe((data) => {
            for (const ticket of data) {
                const emails: string[] = new Array<string>();
                for (const property in ticket) {
                    if (ticket.hasOwnProperty(property)) {
                        emails.push(ticket[property].email);
                        this.attendeeEmails.push(ticket[property].email);
                        this.allEmails.push(ticket[property].email);
                    }
                }
                this.registrationTypeAttendees.set(ticket.$key, emails);
            }
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
        let toList = '';
        if (this.listGroup === 'all') {
            toList = this.allEmails.join(',');
        } else if (this.listGroup === 'all_promoters') {
            toList = this.promoterEmails.join(',');
        } else if (this.listGroup === 'all_attendees') {
            toList = this.attendeeEmails.join(',');
        } else if (this.listGroup === 'attendees_by_registration_type') {
            toList = this.registrationTypeAttendees.get(this.regType).join(',');
        }
        this.sendEmailToRecipient(toList);
    }

    sendEmailToRecipient(toList: string) {

        const pendingMessage: EmailMessage = new EmailMessage();
        pendingMessage.subject = this.subject;
        pendingMessage.body = this.messageQuill.root.innerHTML;
        pendingMessage.from = 'noreply@oevent.com';
        pendingMessage.replyTo = (this.replyToEmail) ? this.replyToEmail : '';
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
