import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pluck';
import { Component, OnInit, AfterViewInit } from '@angular/core';
// import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../../../services/app-service';
// import { FirebaseObjectObservable } from 'angularfire2/database/firebase_object_observable';
import { ToastyService } from 'ng2-toasty';
import * as moment from 'moment';
import { EmailInviteTemplate } from '../../../event/models/invite-template';
import { FieldValidation } from '../../../../assets/common/validation/field-validation';
import { EmailService } from '../../../shared-module/services/email.service';
import { EventService } from '../../../event/services/event-service';
import { AddEmailsModalComponent } from '../../../event/components/my-event/invitations/add-emails-modal.component';
import { UpdateEmailModalComponent } from '../../../event/components/my-event/invitations/update-email-modal.component';
import { EmailMessage } from '../../../shared-models/email-message';
import { InviteEmail } from '../../../event/models/invite-email';
import { AuthService } from '../../../auth/services/auth-service';
import { FirebaseListObservable, FirebaseObjectObservable } from '../../../../../node_modules/angularfire2/database-deprecated/public_api';
import { AngularFireDatabase } from '../../../../../node_modules/angularfire2/database';

declare var Quill: any;

@Component({
    selector: 'app-my-event-invitations',
    templateUrl: './promoted-invite.component.html',
    styles: [
        `
                        .email-template{
                            padding: 1rem;
                            background-color: #f7f7f7;
                            border: 1px solid #d7d7d7;
                            margin-bottom:2rem;
                            margin-top:0rem;
                            position:relative;
                            padding-top:.5rem;
                        }

                        .email-template.editing{
                            background-color:white;
                        }

                        .email-template .round-icon{
                            position:absolute;
                            top:-15px;
                            right:-15px;
                        }

                        .block-label{
                            display:block;
                            margin-bottom:7px;
                        }

                        .ql-container{
                            height:auto;
                        }

                        .ql-container.ql-snow{
                            border:0px;
                        }

                        .ql-editor{
                            background-color:#f7f7f7;
                        }
                    `
    ]

})

export class PromotedInviteComponent implements OnInit, AfterViewInit {
    emailSelectionMap: Map<string, any>;
    selectAll: boolean;
    inviteEmails$: FirebaseListObservable<any>;
    inviteEmails: InviteEmail[] = new Array<InviteEmail>();
    inviteTemplate$: FirebaseObjectObservable<any>;
    inviteTemplate: EmailInviteTemplate = new EmailInviteTemplate();
    messageQuill: any;
    editing = false;
    testEmail: string;

    subjectLine = '';
    replyEmail = '';

    fieldValidations: Map<string, FieldValidation>;
    validToSendMessage = true;

    constructor(private af: AngularFireDatabase,
        private auth: AuthService,
        private modalService: NgbModal,
        public activeModal: NgbActiveModal,
        public appService: AppService,
        private toasty: ToastyService,
        private emailService: EmailService,
        public eventService: EventService) {
        this.emailSelectionMap = new Map<string, any>();
        this.selectAll = false;

        if (this.appService.contactSet) {
            this.replyEmail = this.appService.contact.email;
        } else {
            this.appService.contactEmitter.subscribe(() => {
                this.replyEmail = this.appService.contact.email;
                console.log(this.appService.contact);
            });
        }

    }

    ngOnInit() {
        if (this.auth.authenticated) {
            this.initInvites();
        } else {
            this.auth.authObservable.first().subscribe(() => {
                this.initInvites();
            });
        }
    }

    initInvites() {
        this.inviteEmails$ = this.eventService.getPromoterInviteEmails();
        this.inviteTemplate$ = this.eventService.getPromoterInviteEmailTemplate();
        this.loadInviteEmails();
        this.initValidations();
    }

    initValidations() {
        this.fieldValidations = new Map<string, FieldValidation>();
        this.fieldValidations.set('emails', new FieldValidation());
        this.fieldValidations.set('testEmail', new FieldValidation());
        this.fieldValidations.set('subject', new FieldValidation());
        this.fieldValidations.set('body', new FieldValidation());
    }

    ngAfterViewInit() {
        this.initializeReadOnly();
    }

    setDefaults() {

        alert('defaults');

        let messageDelta: any;

        if (typeof this.eventService.event.description !== 'string') {
            messageDelta = this.eventService.event.description;
        } else {
            messageDelta = { ops: [] };
        }


        console.log(messageDelta);

        const endingString = `\nLooking forward to seeing you there,\n\n${this.appService.about.organizerName}\n`;

        const endingOp = {
            'insert': endingString
        };

        if (typeof messageDelta['ops'] !== 'undefined') {
            messageDelta['ops'].push(endingOp);
        } else {
            messageDelta['ops'] = [endingOp];
        }



        this.inviteTemplate.subject = `You're invited to my event | ${this.eventService.event.title}`;

        this.inviteTemplate.messageDelta = messageDelta;
        this.messageQuill.setContents(this.inviteTemplate.messageDelta);
        this.inviteTemplate$.set(this.inviteTemplate);

    }


    loadInviteEmails() {

        console.log(this.inviteEmails$);

        this.inviteEmails$.subscribe((data) => {

            console.log('test here', data);

            this.inviteEmails = data;
            for (const inviteEmail of data) {
                this.emailSelectionMap.set(inviteEmail.$key, { checked: false });
            }
        });
    }

    openAddEmailsModal() {
        this.activeModal.dismiss();
        this.modalService.open(AddEmailsModalComponent);
    }

    openUpdateEmailModal(key: string) {
        this.activeModal.dismiss();
        this.eventService.selectedInviteEmailKey = key;
        this.modalService.open(UpdateEmailModalComponent);
    }

    selectAllToggle() {
        this.emailSelectionMap.forEach((entryVal, entryKey) => {
            entryVal.checked = this.selectAll;
        });
    }

    removeSelectedEmails() {
        const keysToDelete = [];
        this.emailSelectionMap.forEach((entryVal, entryKey) => {
            if (entryVal.checked) {
                keysToDelete.push(entryKey);
            }
        });

        for (const key of keysToDelete) {
            this.inviteEmails$.remove(key);

        }
    }

    editTemplate() {
        this.editing = true;
        this.initializeEdit();
    }

    initializeReadOnly() {
        this.messageQuill = new Quill('#template', {
            readOnly: true
        });

        this.inviteTemplate$.first().subscribe((template) => {

            if (template.$exists()) {
                this.inviteTemplate = template;
                this.messageQuill.setContents(this.inviteTemplate.messageDelta);
            } else {
                this.setDefaults();
            }


        });
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
        this.messageQuill = new Quill('#template', {
            modules: {
                toolbar: toolbarOptions
            },
            theme: 'snow'
        });

        console.log(this.messageQuill.root.innerHTML);


        this.inviteTemplate$.first().subscribe((template) => {

            if (template.$exists()) {
                this.inviteTemplate = template;
                this.messageQuill.setContents(this.inviteTemplate.messageDelta);
            } else {
                this.setDefaults();
            }

        });
    }


    sendInvitation(test: boolean = false): void {

        if (this.validSendMessage(test)) {
            let toList = '';
            for (const inviteEmail of this.inviteEmails) {
                if (toList !== '') {
                    toList += ',';
                }
                toList += inviteEmail.email;
            }
            const body = `
                    <table>
                    <tr>
                       <td width="75%">
                             ${this.messageQuill.root.innerHTML}
                       </td>
                       <td valign="top">
                            <a href="${this.eventService.shareLink}">
                                <strong> ${ this.eventService.event.title} </strong>
                            </a>

                            <a href="${this.eventService.shareLink}">
                                <img src="${this.eventService.event.imagePath}" style="width:100%;" />
                            </a>

                            <br /><br />

                            <a class="btn btn-primary btn-block" href="${this.eventService.shareLink}">
                                Join My Event!
                            </a>
                        </td>
                    </tr>
                    </table>
                    `;
            const pendingMessage: EmailMessage = new EmailMessage();
            pendingMessage.subject = this.inviteTemplate.subject;
            pendingMessage.body = body;
            pendingMessage.from = this.replyEmail;
            pendingMessage.sendDateTime = moment().unix();
            if (!test) {
                pendingMessage.toList = toList;
            } else {
                pendingMessage.toList = this.testEmail;
            }
            console.log(pendingMessage);
            this.emailService.triggerPendingEmail(pendingMessage).then(() => {
                this.toasty.success('InvitationSent Sent');
            }, (err) => {
                this.toasty.error(err.message);
            });
            // this.pendingEmailMessages$.push(pendingMessage);
            // this.toasty.success('Invitation sent');
        } else {
            this.toasty.error('Error validating');
        }
    }

    validSendMessage(test): boolean {
        this.initValidations();
        this.validToSendMessage = true;
        if (!test) {
            if (!this.inviteEmails || this.inviteEmails.length === 0) {
                this.fieldValidations.get('emails').valid = false;
                this.fieldValidations.get('emails').errorMessage = 'Please add emails';
                this.validToSendMessage = false;
            }
        } else {
            if (!this.testEmail || this.testEmail.length === 0) {
                this.fieldValidations.get('testEmail').valid = false;
                this.fieldValidations.get('testEmail').errorMessage = 'Please enter valid email address';
                this.validToSendMessage = false;
            }
        }

        if (FieldValidation.isEmptyText(this.inviteTemplate.subject)) {
            this.fieldValidations.get('subject').valid = false;
            this.fieldValidations.get('subject').errorMessage = 'Subject is required';
            this.validToSendMessage = false;
        }
        return this.validToSendMessage;
    }

    saveTemplate() {
        this.initializeReadOnly();
        this.editing = false;
        const contents = this.messageQuill.getContents();
        this.inviteTemplate$.update({ messageDelta: contents }).then(() => {
            this.toasty.success('Template Saved!');
        });
    }

    cancelTemplate() {
        this.initializeReadOnly();
        this.editing = false;
        this.messageQuill.setContents(this.inviteTemplate.messageDelta);
    }

}
