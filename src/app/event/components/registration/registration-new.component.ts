import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pluck';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../../../auth/services/auth-service';
import { EventService } from '../../services/event-service';
import { IoEvent, oEvent } from '../../../shared-models/oevent';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PromoteModalComponent } from '../event/modals/promote-modal-component';
import { AngularFireDatabase } from 'angularfire2/database';
import { AppService } from '../../../services/app-service';
import { IEventRegistration, EventRegistration } from '../../models/event-registration';
import { IPromoter, Promoter } from '../../models/promoter';
import * as _ from 'lodash';
import { Registration } from '../../models/registration/Registration';
import { BuyerInfo } from '../../models/registration/BuyerInfo';
import { FormField } from '../../models/registration/FormField';
import { RegistrationTicket } from '../../models/registration/RegistrationTicket';
import { SearchOcodeComponent } from './search-ocode.component';
import { RegistrationNotification } from '../../models/registration/RegistrationNotification';
import { EmailPopupComponent } from '../../../shared-module/components/email/email-popup.component';
import { EmailService } from '../../../shared-module/services/email.service';

@Component({
    templateUrl: './registration-new.html',
    styleUrls: [
        './registration.scss'
    ],
    providers: [NgbActiveModal]

})

export class RegistrationNewComponent implements OnInit {
    registration1: Registration;
    eventId = '';
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
    promoters: Promoter[];
    fields: any[] = [];
    event: IoEvent = new oEvent();


    constructor(private auth: AuthService,
        private af: AngularFireDatabase,
        private router: Router,
        private route: ActivatedRoute,
        public eventService: EventService,
        private modalService: NgbModal,
        private emailService: EmailService,
        public activeModal: NgbActiveModal,
        private appService: AppService) {
        this.registration1 = new Registration();
        this.registration1.buyerInfo = new BuyerInfo();
        this.registration1.formFields = new Array<FormField>();
        //        this.registration1.promoters = new Array<IPromoter>();
        this.promoters = new Array<Promoter>();
    }



    // -----------------------------------------------------------------------------------------------------------------------
    // GET ID PARAM AND SET THE SESSION DATA
    // -----------------------------------------------------------------------------------------------------------------------
    ngOnInit(): void {
        this.route.params.subscribe((params: Params) => {
            this.eventId = params['id'];

            this.eventService.setEvent(this.eventId, false);

            if (this.eventId != null) {
                this.loadTickets();
                this.loadUserDetail();
                this.loadFields(this.eventId);
                this.loadEventDetail(this.eventId);
                this.loadPromoters();
            } else {
                // TODO direct to somewhere else.
            }

        });

    }


    loadPromoters(): void {
        this.af.list(`/promoters/events/${this.eventId}`).subscribe((promoters) => {
            for (const ocode of promoters) {
                const newPromoter: IPromoter = new Promoter();
                this.af.object(`/ocodes/${ocode.$key}`).subscribe((profile) => {
                    // tslint:disable-next-line:no-shadowed-variable
                    this.eventService.getPromoterInfo(profile.uid).subscribe((profile) => {
                        newPromoter.name = profile.organizerName;
                        newPromoter.ocode = ocode.$key;
                        this.promoters.push(newPromoter);
                    });
                });
            }
        });
        console.log(this.promoters);

    }

    buildPromoters(promotersReturned) {
        this.promoters = new Array<Promoter>();
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
        this.eventService.promoters = this.promoters;
    }

    loadTickets(): void {
        const regTickets = new Array<RegistrationTicket>();
        if (this.eventId) {
            this.af.object(`/registrations/temp-tickets/${this.appService.sessionId}/${this.eventId}`).subscribe((data) => {
                if (data.tickets != null) {
                    for (const ticket of data.tickets) {
                        if (ticket.quantity > 0) {
                            const regTicket = new RegistrationTicket();
                            regTicket.ticketRef = ticket.key;
                            regTicket.quantity = ticket.quantity;
                            regTicket.price = ticket.price;
                            regTicket.unitPrice = ticket.unitPrice;
                            regTicket.name = ticket.name;
                            regTickets.push(regTicket);
                        }
                    }
                }
            });
        }
        this.registration1.tickets = regTickets;

    }

    loadUserDetail() {
        // Buyer info if not loaded
        this.af.object(`/contact/${this.auth.id}`).subscribe((data) => {
            const contactInfo = data;
            this.registration1.buyerInfo.firstName = contactInfo.first;
            this.registration1.buyerInfo.lastName = contactInfo.last;
            this.registration1.buyerInfo.email = contactInfo.email;
            this.registration1.buyerInfo.phone = contactInfo.phone;
        });
    }



    loadEventDetail(eventId: string) {
        this.af.object(`/events/live/${eventId}/data`).subscribe(
            data => {
                this.event = data;
            },
            err => console.error(err),
            () => console.log('done')
        );

    }

    loadFields(eventId: string) {
        let formFields: FormField[] = new Array<FormField>();
        this.af.object(`/events/settings/${eventId}/RegistrationFields`).subscribe((fields) => {
            if (fields.$exists()) {
                Object.keys(fields).forEach(function (key) {
                    if (key !== 'nameMap' && key !== '$exists' && key !== '$key') {
                        const formField = new FormField();
                        formField.enabled = fields[key].enabled;
                        formField.required = fields[key].required;
                        formField.key = key;
                        formField.type = fields.nameMap[key].type;
                        formField.label = fields.nameMap[key].label;
                        formField.value = '';
                        formFields.push(formField);
                    }
                });
                formFields = _.sortBy(formFields, 'order');
            }
        });
        this.registration1.formFields = formFields;
        console.log('fields after read from the database');
        console.log(this.registration1);
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

    openSearchOcodeModal() {
        this.activeModal.dismiss();
        this.modalService.open(SearchOcodeComponent);
    }

    register() {
        // TODO the validation.
        this.appService.startLoadingBar();
        console.log(this.registration1);


        // SET THE REGISTRATION UNDER THE EVENT
        this.af.list(`/registrations/events/${this.eventId}/${this.auth.id}`).push(this.registration1).then((registration) => {

            // KEEP A REFERENCE TO THE ORIGINAL REGISTRATION UNDER EVENT
            const registrationEventKey = registration.key;
            this.registration1.registrationEventKey = registrationEventKey;

            // DUPLICATE SET THE REGISTRATION UNDER THE USER'S ID FOR REFERENCE FROM THE USER
            // tslint:disable-next-line:no-shadowed-variable
            this.af.list(`/registrations/users/${this.auth.id}/${this.eventId}`).push(this.registration1).then((registration) => {
                // PUT A USER_REGISTRATION REFERENCE BACK IN THE EVENT SO THE EVENT ORGANIZER CAN ACCESS BOTH
                const registrationUserKey = registration.key;
                this.af.object(`/registrations/events/${this.eventId}/
                    ${this.auth.id}/${registrationEventKey}`).update({ registrationUserKey: registrationUserKey });

                // GROOM REGISTRATION INFORMATION FOR NOTIFICATION
                const regNotification = this.groomNotification(this.registration1);
                this.af.list(`/pending-notifications/registrations`).push(regNotification);


                // STAGE TICKETS FOR BACKEND TO DO ITS MAGIC
                for (const ticket of this.registration1.tickets) {

                    ticket.parentRef = registrationUserKey;
                    if (typeof registration.ocode !== 'undefined') {
                        ticket.ocode = registration.ocode;
                    } else {
                        ticket.ocode = '';
                    }
                    ticket.eventRef = this.eventId;

                    this.af.list(`/tickets/purchaseStaged`).push(ticket);
                }

                // DONE!
                this.appService.stopLoadingBar();
                // GO TO THE CONFIRMATION PAGE
                this.router.navigateByUrl(`/registerconfirm/${this.eventId}`);

            });


        });


    }

    groomNotification(registration): RegistrationNotification {

        const regNot = new RegistrationNotification();

        regNot.registrantId = this.auth.id;
        regNot.registrantFirstName = registration.buyerInfo.firstName;
        regNot.registrantLastName = registration.buyerInfo.lastName;
        regNot.registrantEmail = registration.buyerInfo.email;
        regNot.registrantImage = this.appService.userImage;
        regNot.registrantTickets = registration.tickets;
        regNot.registrantTotal = `${this.eventService.ticketTotal}`;
        regNot.promoterOcode = registration.ocode;
        regNot.eventImageURL = this.event.imagePath;
        regNot.eventTitle = this.event.title;
        regNot.eventLocation = this.event.location;
        regNot.eventId = this.eventId;
        regNot.eventOwnerOcode = this.eventService.eventOwnerOcode;
        regNot.eventDate = this.event.date;

        return regNot;
    }

    emailOrganizer() {
        this.emailService.setToEmail(this.eventService.profile.email, this.eventService.profile.organizerName);
        this.activeModal.dismiss();
        const emailRef = this.modalService.open(EmailPopupComponent);
        emailRef.componentInstance.name = 'Attend';
    }

}
