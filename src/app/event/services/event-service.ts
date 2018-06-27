import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/switchMap';

import { Injectable, EventEmitter } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { IoEvent, IoRef, oEvent, oRef } from '../../shared-models/oevent';
import { Observable } from 'rxjs';
import { IAccountAbout } from '../../account/components/about/about-model';
import { AppService } from '../../services/app-service';
import { TicketRegistration } from '../models/ticket-registration';
import { IEventRegistration, EventRegistration } from '../models/event-registration';
import { EventFormFields } from '../../create/components/advanced/models/advanced-settings';
import * as _ from 'lodash';
import * as firebase from 'firebase/app';
import { FirebaseListObservable } from 'angularfire2/database/firebase_list_observable';
import { Promoter } from '../models/promoter';
import { InviteEmail } from '../models/invite-email';
import { EmailInviteTemplate } from '../models/invite-template';
import { AuthService } from '../../auth/services/auth-service';

@Injectable()
export class EventService {

    event: IoEvent = new oEvent();
    profile: IAccountAbout;
    set = false;
    eventUpdated: EventEmitter<any> = new EventEmitter(true);
    profileId: string;

    // EVENT OCODE
    eventOwnerOcode;

    // REFERRER OCODE (WOULD BE IN THE LINK OR CHOSEN UPON REGISTRATION)
    refOcode: string;
    refOcodeName: string;
    refOcodeSet = false;
    promoterProfile: IAccountAbout;
    promoterProfileSet = false;

    profileSet = false;
    eventId = '';
    ticketPath = '';
    profileEmitter: EventEmitter<any> = new EventEmitter();

    currentTickets: any;
    ticketTotal: number;

    totalTicketQty = 0;
    perTicketQty: number[] = [];

    totalUsedTicketQty = 0;
    perTicketUsedQty = 0;

    registrationTickets: any[] = [];

    eventTickets$: FirebaseListObservable<any>;

    registered = false;
    registerErrors: string[] = [];
    registerTimeout: any;
    disableRegisterButton = false;

    registrationFields$: FirebaseObjectObservable<EventFormFields>;

    event$: FirebaseObjectObservable<any>;

    fields: any[] = [];
    fieldsSet = false;
    promoters: Promoter[];

    selectedInviteEmailKey: string;

    modalAttendee: any;

    shareLink = '';

    inviteKey = 'organizer';

    allAttendeesWithOcode = [];

    constructor(public af: AngularFireDatabase,
        public auth: AuthService,
        private appService: AppService) {

    }

    // ** EVENT **//

    setEvent(eventId: string, draft: boolean = false): Promise<any> {

        this.eventId = eventId;
        let rootPath: string;
        let ticketPath: string;
        let event: IoRef = new oRef();

        if (draft) {
            rootPath = `/drafts/draft/${this.auth.id}`;
            ticketPath = `/drafts/tickets`;
            event.ocode = this.appService.ocode;
            event.uid = this.auth.id;
            event.ref = eventId;

            this.event$ = this.af.object(`/drafts/draft/${this.auth.id}/${eventId}`);

        } else {
            rootPath = '/events/live';
            ticketPath = `/tickets/live`;
            this.event$ = this.af.object(`/events/live/${eventId}/data`);
        }

        return new Promise((resolve, reject) => {

            this.af.object(`${rootPath}/${eventId}/`).subscribe((data) => {

                // DRAFT AND LIVE EVENTS HAVE A DIFFERENT SHAPE
                if (!draft) {
                    event = data;
                } else {
                    event.data = data;
                }

                // set the profile of the organizer
                this.profileId = event.uid;
                this.eventOwnerOcode = event.ocode;
                this.setProfile(event.uid);

                this.event = event.data;
                this.set = true;
                this.eventUpdated.emit(false);

                if (typeof event.data !== 'undefined') {

                    if (typeof event.data.parentKey !== 'undefined') {
                        if (event.data.parentKey !== '') {
                            this.ticketPath = `${ticketPath}/${data.data.parentKey}/${eventId}`;
                        } else {
                            this.ticketPath = `${ticketPath}/${eventId}`;
                        }
                    } else {
                        this.ticketPath = `${ticketPath}/${eventId}`;
                    }

                    // REFERENCE TO TICKETS
                    this.eventTickets$ = this.af.list(this.ticketPath);

                    resolve(data);

                } else {
                    reject();
                }

            });
        });

    }

    persistInformation(): void {

        const information = {
            ocode: '',
            tickets: [],
            total: 0
        };

        if (this.refOcodeSet) {

            information.ocode = this.refOcode;

            if (typeof this.currentTickets !== 'undefined') {
                if (this.currentTickets.length) {
                    information.tickets = this.currentTickets;
                    information.total = this.ticketTotal;
                }
            }
        } else if (typeof this.currentTickets !== 'undefined') {
            if (this.currentTickets.length) {
                information.tickets = this.currentTickets;
                information.total = this.ticketTotal;
            }
        }

        this.af.object(`/registrations/temp-tickets/${this.appService.sessionId}/${this.eventId}`).set(information);

    }

    setProfile(id: string) {
        this.af.object(`/about/${id}`).subscribe((profile: IAccountAbout) => {
            this.profile = profile;
            this.profileSet = true;
            this.profileEmitter.emit();
        })
    }

    setPromoter(id: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.af.object(`ocodes/${id}`).subscribe((ocode) => {
                this.af.object(`about/${ocode.uid}`).subscribe((profile: IAccountAbout) => {
                    this.promoterProfile = profile;
                    this.promoterProfileSet = true;
                    resolve();
                });

            });
        });
    }

    // ** PROMOTERS **//
    getPromoters() {
        return this.af.list(`/promoters/events/${this.eventId}`);
    }

    setPromoterCount() {
        this.af.list(`/promoters/events/${this.eventId}`).first().subscribe((data) => {
            this.af.object(`/events/live/${this.eventId}/data`).update({ promoters: data.length });
        });
    }

    addPromoter() {
        if (this.appService.ocodeSet) {

            this.af.object(`/promoters/events/${this.eventId}/${this.appService.ocode}`)
                .update({ datetime: firebase.database.ServerValue.TIMESTAMP }).then(() => {

                    console.log(this.appService.about);

                    // ADD A NOTIFICATION FOR THE PROMOTER & EVENT USER
                    const promoterNotification = {
                        promoter: this.auth.id,
                        promoterImage: this.appService.userImage,
                        promoterName: this.appService.about.organizerName,
                        eventImage: this.event.imagePath,
                        eventId: this.eventId,
                        eventTitle: this.event.title,
                        locationInfo: this.event.location,
                        eventTimeInfo: this.event.time,
                        eventOwnerEmail: this.profile.email,
                    };

                    this.af.list(`/pending-notifications/promoters`).push(promoterNotification);

                    // SET THE COUNT
                    this.setPromoterCount();

                    // ADD TO THE USERS PROMOTED EVENTS
                    this.af.object(`/promoters/users/${this.auth.id}/${this.eventId}`).update({ set: true });

                });
        }
    }

    checkPromoter() {
        if (this.appService.ocodeSet) {
            return this.af.object(`/promoters/events/${this.eventId}/${this.appService.ocode}`);
        }
    }

    addPromoterRegistrant(ocode) {
        return this.af.list(`/promoters/events/${this.eventId}/${ocode}/registrations/${this.auth.id}`);
    }

    getPromoterInfo(key): FirebaseObjectObservable<IAccountAbout> {
        return this.af.object(`/about/${key}`);
    }

    getPromoterInfoByOcode(ocode): Promise<IAccountAbout> {
        return new Promise((resolve, reject) => {
            this.af.object(`/ocodes/${ocode}`).first().subscribe((data) => {
                this.getPromoterInfo(data.uid).first().subscribe((AccountData) => {
                    resolve(AccountData);
                });
            })
        });

    }


    // ** ATTENDING / registration **//

    attending() {

        return this.af.object(`/attending/${this.eventId}/${this.auth.id}`);

    }

    getAttendeesRef() {
        return this.af.list(`/registrations/events/${this.eventId}`);
    }

    getAttendeesByType() {
        return this.af.list(`/registrations/type/${this.eventId}`).take(1);
    };

    registrationUsers() {
        return this.af.list(`/registrations/users/${this.auth.id}/${this.eventId}`);
    }

    ticketPurchase() {
        return this.af.list(`/tickets/purchaseStaged`);
    }

    registrationEvent() {
        return this.af.object(`/registrations/events/${this.eventId}/${this.auth.id}`);
    }

    registrationUser(ticketKey) {
        return this.af.object(`/registrations/users/${this.auth.id}/${this.eventId}/${ticketKey}`);
    }

    ticketsUser(ticketRef) {
        return this.af.list(`/tickets/users/${this.auth.id}/${this.eventId}/${ticketRef}`);
    }

    ticketsEvent(ticketRef) {
        return this.af.list(`/tickets/events/${this.eventId}/${ticketRef}`);
    }

    ticketsEventAll() {
        return this.af.list(`/tickets/events/${this.eventId}/`);
    }

    getEventRegistrationFields() {
        return this.af.object(`/events/settings/${this.eventId}/RegistrationFields`);
    }

    getEventSettingsConfirmation(): FirebaseObjectObservable<any> {
        return this.af.object(`/events/settings/${this.eventId}/Confirmation`);
    }

    registerNotifications(registration): Promise<any> {
        return new Promise((resolve) => {
            this.af.list(`/pending-notifications/registrations`).push(registration).then(() => {
                resolve();
            });
        });
    }

    // TICKETS ARE SEPARATE FROM REGISTRATIONS, THERE WILL BE AT LEAST 1 TICKET PER REGISTRATION
    getTickets() {
        if (this.ticketPath !== '') {
            return this.af.list(this.ticketPath);
        } else {
            return null;
        }
    }

    buildTicketRegistration() {
        this.registrationTickets = [];
        let i = 0;

        if (this.currentTickets) {
            for (const ticket of this.currentTickets) {

                this.groomTicket(ticket, i);
                i++;
            }
        }
    }

    groomTicket(ticket: any, index) {

        const newPath = `${this.ticketPath}/${ticket.key}`;
        this.af.object(newPath).subscribe((ticketData) => {
            this.addTicketRegistration(ticket, ticketData.ticketType, index, ticketData.multiRegistrant, ticketData.buyMultiple);
        });
    }

    addTicketRegistration(ticket: any, ticketType, index, multiRegistrant, buyMultiple) {
        // tslint:disable-next-line:radix
        for (const i = 0; i < parseInt(this.currentTickets[index].quantity); i++) {
            const newTicket = new TicketRegistration();
            newTicket.ticketRef = ticket.key;
            newTicket.ticketName = ticket.name;
            newTicket.catQty = ticket.quantity;
            newTicket.ticketNumber = i + 1;
            newTicket.ocode = this.refOcode;
            newTicket.showMulti = multiRegistrant;
            newTicket.buyMultiple = buyMultiple;
            newTicket.set = false;

            if (ticketType === 'paid') {
                newTicket.requiresPayment = true;
            } else {
                newTicket.requiresPayment = false;
            }

            newTicket.paid = ticket.paid;

            this.registrationTickets.push(newTicket);
        }
    }

    setFields(): Promise<null> {

        this.fields = [];
        this.fieldsSet = false;

        return new Promise((resolve, reject) => {
            this.registrationFields$ = this.getEventRegistrationFields();

            this.registrationFields$.first().subscribe((fields) => {

                const $this = this;

                if (fields.$exists()) {
                    Object.keys(fields).forEach(function (key) {

                        if (key !== 'nameMap' && key !== '$exists' && key !== '$key') {
                            $this.fields.push({
                                order: fields.nameMap[key].order,
                                key: key,
                                value: fields[key],
                                data: fields.nameMap[key]
                            });
                        }

                    });

                    this.fields = _.sortBy(this.fields, 'order');
                    this.fieldsSet = true;

                    resolve();

                }

            })
        });


    }

    register(registration: IEventRegistration) {
        // this.registrationTickets | separate tickets
        // registration | main registration
        this.appService.startLoadingBar();

        // GET THE PROMOTER'S NAME
        this.getPromoterInfoByOcode(registration.ocode).then((promoterAbout) => {


            let promoterName = '';

            if (promoterAbout.$exists()) {
                promoterName = promoterAbout.organizerName;
            }

            if (this.registrationTickets.length) {
                registration.hasChildren = true;
                registration.uid = this.auth.id;
                registration.total = this.ticketTotal;

                const childTickets: IEventRegistration[] = [];

                for (const ticket of this.registrationTickets) {
                    const childRegistration: IEventRegistration = new EventRegistration();
                    childRegistration.fields = ticket.fields;
                    childRegistration.email = ticket.fields[4].input;
                    childRegistration.firstName = ticket.fields[1].input;
                    childRegistration.lastName = ticket.fields[2].input;
                    childRegistration.paid = ticket.paid;
                    childRegistration.ocode = this.refOcode;
                    childRegistration.promoterName = promoterName;
                    childRegistration.uid = this.auth.id;
                    childRegistration.ticketRef = ticket.ticketRef;
                    childRegistration.isChild = ticket.multiChild;
                    childRegistration.isParent = ticket.multiParent;
                    childRegistration.requiresPayment = ticket.requiresPayment;
                    childRegistration.eventRef = this.eventId;
                    childRegistration.ticketTitle = ticket.ticketName;
                    childRegistration.ticketQty = ticket.regQty;
                    childTickets.push(childRegistration);
                }

                // TRACK KEYS FROM CHILD TICKETS
                const children: any[] = [];
                // KEEP TRACK OF THE ORIGINAL KEY TO KEEP RELATIONSHIPS
                let registrationUserKey: string;
                // MAKE SURE ALL CHILDREN HAVE BEEN ADDED WHEN POPULATING THEM INTO PARENT REGISTRATION
                let checkNumber = 0;

                this.registrationUsers().push(registration).then((data) => {

                    registrationUserKey = data.key;

                    this.registrationEvent().set(registration).then((data) => {



                        // BUILD UP INFORMATION FOR NOTIFICATIONS
                        const regNotification = {
                            registrantId: this.auth.id,
                            registrantFirstName: registration.firstName,
                            registrantLastName: registration.lastName,
                            registrantImage: this.appService.userImage,
                            registrantTickets: this.currentTickets,
                            registrantTotal: this.ticketTotal,
                            registrantEmail: registration.email,
                            promoterOcode: registration.ocode,
                            promoterName: promoterName,
                            eventOrganizerOcode: this.eventOwnerOcode,
                            eventImageURL: this.event.imagePath,
                            eventTitle: this.event.title,
                            eventLocation: this.event.location,
                            eventId: this.eventId,
                            eventOwnerOcode: this.eventOwnerOcode,
                            eventDate: this.event.date
                        };

                        // PUSH INFORMATION FOR NOTIFICATION
                        this.registerNotifications(regNotification).then(() => {

                            // LOOP THROUGH INDIVIDUALLY PURCHASED TICKETS NOW AND ADD ONE AT A TIME
                            for (const ticket of childTickets) {

                                ticket.parentRef = registrationUserKey;
                                ticket.paid = false;
                                ticket.ocode = registration.ocode;

                                // PUSH FOR TRACKING DATA ON THE EVENT
                                this.ticketPurchase().push(ticket);

                                // tslint:disable-next-line:no-shadowed-variable
                                this.ticketsUser(ticket.ticketRef).push(ticket).then((data) => {

                                    // for whatever reason parent get is not working on list
                                    const parent = data.path.o[4];

                                    children.push({ ticketRef: ticket.ticketRef, key: data.key });
                                    checkNumber++;

                                    if (checkNumber === childTickets.length) {
                                        this.addChildren(registrationUserKey, registration, children);
                                    }

                                    // tslint:disable-next-line:no-shadowed-variable
                                    this.ticketsEvent(ticket.ticketRef).push(ticket).then((data) => {
                                        this.setRegistered();



                                    })
                                });
                            }

                            // INCREMENT THE EVENT REGISTRATIONS
                            this.af.list(`/registrations/events/${this.eventId}`).first().subscribe((data) => {
                                this.af.object(`/events/live/${this.eventId}/data`).update({ registrations: data.length });
                            });

                        });
                    });

                });


            } else {

            }

        });


    }

    setRegistered() {

        if (typeof this.registerTimeout !== 'undefined') {

            clearTimeout(this.registerTimeout);

        }

        this.registerTimeout = setTimeout(() => {

            this.appService.scrollToTop();
            this.registered = true;
            this.appService.stopLoadingBar();


        }, 1000);

    }

    addChildren(registrationUserKey, registration: IEventRegistration, children) {

        for (const child of children) {
            registration.children.push(child);
        }

        this.registrationUser(registrationUserKey).set(registration);
        this.registrationEvent().set(registration);

        if (registration.ocode !== '') {
            this.addPromoterRegistrant(registration.ocode).push(registration);
        }
    }

    /** SERVICES AROUND SHOWING ONLY ONE OF SINGLE INPUT **/

    // tslint:disable-next-line:member-ordering
    singleInputTickets: any = {};
    // tslint:disable-next-line:member-ordering
    childInputListener: any = {};

    // tslint:disable-next-line:member-ordering
    submissionEmitter: EventEmitter<any> = new EventEmitter();

    clearSingleInput() {

        for (const key in this.singleInputTickets) {
            if (this.singleInputTickets.hasOwnProperty(key)) {
                delete this.singleInputTickets[key];
            }
        }

        this.singleInputTickets = {};
        this.childInputListener = {};

        const fieldsClone = JSON.parse(JSON.stringify(this.singleInputTickets));

    }

    setSingleParentEmitter(key) {
        this.childInputListener[key] = new EventEmitter();
    }

    registerMultiSingleInput(index, key): any {

        if (_.has(this.singleInputTickets, key)) {
            this.singleInputTickets[key].push(index);
            return false;
        } else {
            this.singleInputTickets[key] = [index];
            return true;
        }

    };

    addSingleMultiQty(index) {
        this.registrationTickets[index].regQty += 1;
    }

    getInviteEmails(): FirebaseListObservable<any> {
        return this.af.list(`/events/communication/${this.eventId}/invite-emails`);
    }

    getInviteEmail(key): FirebaseObjectObservable<any> {
        return this.af.object(`/events/communication/${this.eventId}/invite-emails/${key}`);
    }
    getInviteEmailTemplate(): FirebaseObjectObservable<EmailInviteTemplate> {
        return this.af.object(`/events/communication/${this.eventId}/invite-template`);
    }

    getPromoterInviteEmails(): FirebaseListObservable<any> {
        return this.af.list(`/events/communication/promoter/${this.auth.id}/${this.eventId}/invite-emails`);
    }

    getUserUpcomingEvents(id: string): FirebaseListObservable<any> {
        return this.af.list(`/events/profile/upcoming/${id}`);
    }

    getPromoterInviteEmail(key): FirebaseObjectObservable<any> {
        return this.af.object(`/events/communication/promoter/${this.auth.id}/${this.eventId}/invite-emails/${key}`);
    }

    getPromoterInviteEmailTemplate(): FirebaseObjectObservable<EmailInviteTemplate> {
        return this.af.object(`/events/communication/promoter/${this.auth.id}/${this.eventId}/invite-template`);
    }

    getLiveEventById(id: string): FirebaseObjectObservable<any> {
        return this.af.object(`/events/live/${id}`);
    }

    getAttendeesByOcode(ocode): Promise<any[]> {

        return new Promise((resolve, reject) => {

            const attendeeList = [];
            this.getAttendeesByType().subscribe((data) => {

                for (const ticket of data) {

                    delete ticket.$exists;
                    delete ticket.$key;

                    for (const property in ticket) {
                        if (ticket.hasOwnProperty(property)) {

                            if (ticket[property].ocode.length) {
                                this.allAttendeesWithOcode.push(ticket[property]);
                            }

                            if (ticket[property].ocode == ocode) {
                                attendeeList.push(ticket[property]);
                            }

                        }
                    }
                }
                resolve(attendeeList);
            });
        });

    }

    getAttendeesByTypeAndOcode(ocode, ticketTitle): Promise<any[]> {

        return new Promise((resolve, reject) => {
            this.getAttendeesByOcode(ocode).then((attendees) => {

                const typeAttendees = [];
                for (const attendee of attendees) {
                    if (attendee.ticketTitle === ticketTitle) {
                        typeAttendees.push(attendee);
                    }
                }

                const totalPromotedAttendees: any[] = [];
                for (const attendee of this.allAttendeesWithOcode) {
                    if (attendee.ticketTitle === ticketTitle) {
                        totalPromotedAttendees.push(attendee);
                    }
                }

                resolve({ attendees: typeAttendees, totalPromotedAttendees: totalPromotedAttendees });
            });
        });

    }

    getFeaturedEvents() {
        return this.af.list(`/featured`);
    }

    removeFeaturedEvent(key) {
        this.af.list(`/featured`).remove(key);
    }

}
