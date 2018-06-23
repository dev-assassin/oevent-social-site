import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pluck';

import { Component, AfterContentInit, OnInit, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../../../auth/services/auth-service';
import { EventService } from '../../services/event-service';
import { IoEvent, oEvent } from '../../../shared-models/oevent';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PromoteModalComponent } from '../event/modals/promote-modal-component';
import { FirebaseListObservable, AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database'
import { AttendModalComponent } from '../event/modals/attend-modal-component';
import { AppService } from '../../../services/app-service';
import { IEventRegistration, EventRegistration } from '../../models/event-registration';
import { IPromoter, Promoter } from '../../models/promoter';
import * as _ from 'lodash';
import { EmailService } from '../../../shared-module/services/email.service';
import { EmailPopupComponent } from '../../../shared-module/components/email/email-popup.component';
import { FieldValidation } from '../../../../assets/common/validation/field-validation';

declare var Quill: any;

@Component({
    templateUrl: './registration.html',
    styleUrls: [
        './registration.scss'
    ],
    providers: [NgbActiveModal]

})

export class RegistrationComponent implements OnInit {

    test = 'testing';
    testCheckbox = false;

    id: string;
    description: any;
    // check if current use is a promoter
    promoter = false;

    // TRACK IF DATA HAS BEEN LOADED FROM FIREBASE
    set = false;

    // THIS IS THE MAIN REGISTRATION - registration.children are the sub-registrations
    registration: IEventRegistration = new EventRegistration();

    testSelect: string;

    noOcode = false;
    lookupOcode = false;
    oldOcode = '';
    ocodeDisable = false;

    promoters$: any;
    promoters: any[];

    fieldValidations: Map<string, FieldValidation>;
    valid = true;

    /* Confirmation message enabled */
    confirmation: any;
    confirmationEnabled: boolean;


    constructor(private auth: AuthService,
        private af: AngularFireDatabase,
        private router: Router,
        private route: ActivatedRoute,
        public eventService: EventService,
        private emailService: EmailService,
        private modalService: NgbModal,
        public activeModal: NgbActiveModal,
        private appService: AppService) {

        this.promoters$ = this.eventService.getPromoters;

        this.eventService.eventUpdated.first().subscribe(() => {
            this.eventService.setFields();
        });


    }

    initValidationFields() {
        this.fieldValidations = new Map<string, FieldValidation>();
        this.fieldValidations.set('fname', new FieldValidation());
        this.fieldValidations.set('lname', new FieldValidation());
        this.fieldValidations.set('email', new FieldValidation());

        this.eventService.registrationTickets.forEach((registrationTicket, index) => {
            if (typeof registrationTicket.fields !== 'undefined') {
                for (const field of registrationTicket.fields) {
                    this.fieldValidations.set(index + '_' + field.key, new FieldValidation());
                }
            }
        });

    }

    // -----------------------------------------------------------------------------------------------------------------------
    // GET ID PARAM AND SET THE SESSION DATA
    // -----------------------------------------------------------------------------------------------------------------------
    ngOnInit(): void {

        this.eventService.clearSingleInput();

        // CHECK THE STATE OF THE SERVICE AND SEE IF AN EVENT HAS BEEN INITIALIZED
        if (this.eventService.eventId.length > 5) {

            this.registration.ocode = this.eventService.refOcode;
            this.eventService.persistInformation();
            this.eventService.buildTicketRegistration();
            this.eventService.getPromoters().first().subscribe((promoters) => {
                this.buildPromoters(promoters);
            });

        } else { // IF NO EVENT HAS BEEN INITIALIZED CHECK FOR ANYTHING PERSISTENT

            this.route.params.forEach((params: Params) => {

                if (params['id']) {
                    this.id = params['id'];
                    this.initFromDB();
                }

            });

        }
        this.initValidationFields();

        if (this.appService.contactSet) {
            this.registration.firstName = this.appService.contact.first;
            this.registration.lastName = this.appService.contact.last;
            this.registration.email = this.appService.contact.email;
        } else {
            this.appService.contactEmitter.subscribe(() => {
                this.registration.firstName = this.appService.contact.first;
                this.registration.lastName = this.appService.contact.last;
                this.registration.email = this.appService.contact.email;
            });
        }
        this.confirmation = new Quill('#confirmation', {
            readOnly: true
        });
        this.eventService.getEventSettingsConfirmation().first().subscribe((data) => {
            this.confirmation.setContents(data.message);
            this.confirmationEnabled = data.enabled;
        });


    }

    initFromDB() {
        this.af.object(`/registrations/temp-tickets/${this.appService.sessionId}/${this.id}`).subscribe((data) => {

            this.eventService.setEvent(this.id).then(() => {
                this.eventService.getPromoters().first().subscribe((promoters) => {

                    this.buildPromoters(promoters);

                    if (data.ocode !== '') {
                        this.eventService.refOcodeSet = true;
                        this.eventService.refOcode = this.registration.ocode = data.ocode;
                        this.eventService.currentTickets = data.tickets;
                        this.eventService.ticketTotal = data.total;
                        this.eventService.buildTicketRegistration();
                    } else {
                        this.eventService.refOcodeSet = false;
                        this.eventService.refOcode = '';
                        if (typeof data.tickets !== 'undefined') {
                            this.eventService.currentTickets = data.tickets;
                            this.eventService.ticketTotal = data.total;
                            this.eventService.buildTicketRegistration();
                        } else {
                            // TODO FIGURE OUT AN ERROR DISPLAY IF NO TICKETS (there should always be at least one)
                        }
                    }

                });
            });

        });
    }


    buildPromoters(promotersReturned) {

        this.promoters = [];

        for (const ocode of promotersReturned) {

            const newPromoter: IPromoter = new Promoter();

            this.af.object(`/ocodes/${ocode.$key}`).first().subscribe((profile) => {

                // tslint:disable-next-line:no-shadowed-variable
                this.eventService.getPromoterInfo(profile.uid).subscribe((profile) => {
                    newPromoter.name = profile.organizerName;
                    newPromoter.ocode = ocode.$key;
                    this.promoters.push(newPromoter);
                });

            });

        }
    }

    selectPromoter(ocode) {
        this.registration.ocode = ocode;
        this.lookupOcode = false;
    }

    toggleDont() {
        if (this.registration.ocodeToggle) {
            this.registration.ocode = this.oldOcode;
            this.ocodeDisable = false;
            this.registration.ocodeToggle = false;
        } else {
            this.oldOcode = this.registration.ocode;
            this.ocodeDisable = true;
            this.registration.ocode = '';
            this.registration.ocodeToggle = true;
            this.lookupOcode = false;
        }
    }

    checkPromoter() {
        if (this.auth.authenticated) {
            this.eventService.checkPromoter().subscribe((data) => {
                if (data.$exists()) {
                    this.promoter = true;
                } else {
                    this.promoter = false;
                }
            });
        }
    }

    openPromoter() {
        this.activeModal.dismiss();
        const signInRef = this.modalService.open(PromoteModalComponent);
        signInRef.componentInstance.name = 'Promote';
    }

    validRegistration(): boolean {
        this.initValidationFields();

        if (!this.registration.firstName) {
            this.fieldValidations.get('fname').valid = false;
            this.fieldValidations.get('fname').errorMessage = 'First name is required';
        }

        if (!this.registration.lastName) {
            this.fieldValidations.get('lname').valid = false;
            this.fieldValidations.get('lname').errorMessage = 'Last name is required';
        }

        if (!this.registration.email) {
            this.fieldValidations.get('email').valid = false;
            this.fieldValidations.get('email').errorMessage = 'Email is required';
        } else {
            const EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

            if (this.registration.email.length <= 5 || !EMAIL_REGEXP.test(this.registration.email)) {
                this.fieldValidations.get('email').valid = false;
                this.fieldValidations.get('email').errorMessage = 'Invalid email address';
            }

        }


        this.eventService.registrationTickets.forEach((registrationTicket, index) => {
            if (registrationTicket.set) {
                for (const field of registrationTicket.fields) {
                    const key = `${index}_${field.key}`;
                    if (field.value.enabled) {
                        this.fieldValidations.set(key, new FieldValidation());
                        if (field.value.required && !field.input) {
                            this.fieldValidations.get(key).valid = false;
                        }
                    }
                }
            }
        });


        this.valid = true;
        this.fieldValidations.forEach((entryVal, entryKey) => {
            if (!entryVal.valid) {
                this.valid = false;

            }
        });
        return this.valid;

    }

    register() {
        if (this.validRegistration()) {
            // TRIGGERS CHILD TICKETS TO RECEIVE PARENT TICKET INFORMATION ON TICKETS THAT DON'T REQUIRE SEPARATE REGISTRATION
            this.eventService.submissionEmitter.emit();

            // GIVE TIME FOR CHILD TICKETS TO POPULATE BEFORE RUNNING REGISTER
            setTimeout(() => {
                this.eventService.register(this.registration);
            }, 1000);
        }
    }


    emailOrganizer() {
        this.emailService.setToEmail(this.eventService.profile.email, this.eventService.profile.organizerName);
        this.activeModal.dismiss();
        const emailRef = this.modalService.open(EmailPopupComponent);
        emailRef.componentInstance.name = 'Email';
    }

    change() {
        this.activeModal.dismiss();
        const signInRef = this.modalService.open(AttendModalComponent);
        signInRef.componentInstance.name = 'Attend';
    }



}
