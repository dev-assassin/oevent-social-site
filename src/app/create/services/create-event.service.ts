import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/switchMap';

import { Injectable, OnDestroy, EventEmitter } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { IoEvent, oEvent } from '../../shared-models/oevent';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs';
import { CreateEventDateService } from './create-date.service';
import { CreateTicketsService } from './create-tickets.service';
import { Http } from '@angular/http';
import { ToastyService } from 'ng2-toasty';
import { GroomedDate } from '../models/date.models';
import { EventService } from '../../event/services/event-service';
import * as moment from 'moment';
import * as firebase from 'firebase/app';
import { FieldValidation } from '../../../assets/common/validation/field-validation';
import { AppService } from '../../services/app-service';
import { AuthService } from '../../auth/services/auth-service';


@Injectable()
export class CreateEventService {

    eventId: string;
    eventSet = false;
    draftObject$: FirebaseObjectObservable<IoEvent> = new FirebaseObjectObservable<IoEvent>();
    liveObject$: FirebaseObjectObservable<IoEvent> = new FirebaseObjectObservable<IoEvent>();
    draftList$: FirebaseListObservable<any[]>;
    draft: IoEvent;
    draftSet = false;
    draftUpdated: EventEmitter<any> = new EventEmitter();
    valid = true;

    // KEEP TRACK OF SUBSCRIPTIONS TO KILL
    firebaseConnections: any[] = [];

    fieldValidations: Map<string, FieldValidation>;

    constructor(private af: AngularFireDatabase,
        private auth: AuthService,
        private dateService: CreateEventDateService,
        private ticketService: CreateTicketsService,
        private http: Http,
        private eventService: EventService,
        private toasty: ToastyService,
        private appService: AppService) {
        this.fieldValidations = new Map<string, FieldValidation>();

        this.draftList$ = this.af.list(`/drafts/draft/${this.auth.id}`);
        this.liveObject$ = this.af.object(`/events/live/${this.eventId}`);


    }

    setEventId(id): Promise<any> {
        this.eventId = id;

        this.dateService.initializeDate(id);
        this.ticketService.initTickets(id);

        return new Promise((resolve, reject) => {
            let objectSub: any;
            this.draftObject$ = this.af.object(`/drafts/draft/${this.auth.id}/${id}`);

            objectSub = this.draftObject$.subscribe((data) => {
                this.draft = data;
                this.draftSet = true;
                // give a sub for anything that needs updated live
                this.draftUpdated.emit();
                resolve();
            });

            this.registerConnection(objectSub);

        });
    }

    setNewEvent(): Promise<any> {
        return new Promise((resolve, reject) => {
            const blankEvent: IoEvent = new oEvent();
            blankEvent.type = 'local';
            this.draft = blankEvent;
            this.draftList$.push(blankEvent).then((data) => {
                resolve(data);
            });
        });
    }

    registerConnection(conn) {
        this.firebaseConnections.push(conn);
    };

    getGeoCode(address): Observable<any> {
        const key = 'AIzaSyCXlzLSm5F9D0W16PcX-FQQGi9W51E2SLM';
        let url = `https://maps.googleapis.com/maps/api/geocode/json?key=${key}&address=`;
        url = url + encodeURIComponent(address);

        return this.http.get(url);
    }

    // -----------------------------------------------------------------------------------------------------------------------
    // MINIMUM VALIDATION TO SAVE AN EVENT
    // -----------------------------------------------------------------------------------------------------------------------
    validateMin(): boolean {
        this.valid = true;
        this.fieldValidations.forEach((entryVal, entryKey) => {
            if (!entryVal.valid && (entryKey == 'title' || entryKey == 'event-date')) {
                this.valid = false;
            }
        });
        return this.valid;
    }

    validateLocation(draftObj: IoEvent): boolean {
        this.validateOnlineLocation(draftObj);
        this.validateLocalLocation(draftObj);
        return this.isFieldValid('online-location') && this.isFieldValid('local-location');
    }

    validateOnlineLocation(draftObj: IoEvent): boolean {
        this.fieldValidations.set('online-location', new FieldValidation());

        if (draftObj && draftObj.type === 'online' && !draftObj.location) {
            this.fieldValidations.get('online-location').valid = false;
            this.fieldValidations.get('online-location').errorMessage = 'URL can\'t be empty for the online event';
        }
        return this.isFieldValid('online-location');
    }

    validateLocalLocation(draftObj: IoEvent): boolean {
        this.fieldValidations.set('local-location', new FieldValidation());
        if (draftObj && draftObj.type === 'local' && !draftObj.location) {
            this.fieldValidations.get('local-location').valid = false;
            this.fieldValidations.get('local-location').errorMessage = 'Address can\'t be empty for the local event';
        }
        return this.isFieldValid('local-location');
    }



    validateEventImage(draftObj: IoEvent): boolean {

        this.fieldValidations.set('image', new FieldValidation());

        if (draftObj && !draftObj.imagePath) {
            this.fieldValidations.get('image').valid = false;
            this.fieldValidations.get('image').errorMessage = 'Event image is required';
        }
        return this.fieldValidations.get('image').valid;
    }

    validateDateTime(groomedDate: GroomedDate, eventType: string) {
        this.validateDate(groomedDate, eventType);
        this.validateTime(groomedDate, eventType);

    }

    validateDate(groomedDate: GroomedDate, eventType: string) {
        this.fieldValidations.set('event-date', new FieldValidation());
        this.fieldValidations.set('event-start-date', new FieldValidation());
        if (eventType === 'singleDay') {
            const currentDate = new Date();
            if (moment(currentDate).unix() > groomedDate.startDate) {
                this.fieldValidations.get('event-date').valid = false;
                this.fieldValidations.get('event-date').errorMessage = 'Event date can\'t be past';
            }
        } else if (eventType === 'multiDay') {
            const currentDate = new Date();
            if (moment(currentDate).unix() > groomedDate.startDate) {
                this.fieldValidations.get('event-start-date').valid = false;
                this.fieldValidations.get('event-start-date').errorMessage = 'Event start date can\'t be past';
            } else if (groomedDate.endDate <= groomedDate.startDate) {
                this.fieldValidations.get('event-date').valid = false;
                this.fieldValidations.get('event-date').errorMessage = 'End date has to be greater than the start date';
            }
        }

    }

    validateTime(groomedDate: GroomedDate, eventType: string): boolean {
        const times = groomedDate.timeString.split('-');
        const minsDifference = (moment(`2012-12-12 ${times[1]}`).toDate().getTime()
            - moment(`2012-12-12 ${times[0]}`).toDate().getTime()) / 60000;
        this.fieldValidations.set('end-time', new FieldValidation());
        if (minsDifference < 15) {
            console.log('Invalid time');
            this.fieldValidations.get('end-time').valid = false;
            this.fieldValidations.get('end-time').errorMessage = 'End time needs to be at least fifteen minutes more then the start time'
        }
        return this.fieldValidations.get('end-time').valid;
    }

    // -----------------------------------------------------------------------------------------------------------------------
    // VALIDATION OF INFORMATION FOR AN EVENT TO BE MADE LIVE
    // -----------------------------------------------------------------------------------------------------------------------
    validateLive(): boolean {
        this.valid = true;

        // Title and event date should already be checked for validation at this point.
        //

        let draftObj: IoEvent = null;
        this.draftObject$.subscribe((data) => {
            draftObj = data;
        });
        this.validateLocation(draftObj);
        this.validateEventImage(draftObj);

        this.fieldValidations.forEach((entryVal, entryKey) => {
            if (entryVal && !entryVal.valid) {
                console.log(entryKey);
                console.log(entryVal);
                this.valid = false;
            }
        });
        return this.valid;
    }

    // -----------------------------------------------------------------------------------------------------------------------
    // TOGGLE EVENT LIVE OR UNPUBLISH DEPENDING ON INPUT VAR TRUE/FALSE AND ADD TO LIVE EVENTS (WHICH INCLUDE BOTH PRIVATE AND PUBLIC)
    //
    // -----------------------------------------------------------------------------------------------------------------------
    publish(live: boolean = true) {

        const liveObject$ = this.af.object(`/events/live/${this.eventId}`);
        const profileUpcoming$ = this.af.object(`events/profile/upcoming/${this.auth.id}/${this.eventId}`);

        let status: string;

        if (live) {
            status = 'active';
            this.setOrganizerPromoter();
        } else {
            status = 'draft';
        }

        this.draftObject$.update({ status: status }).then((success) => {

            if (live) {

                // PATCHWORKING A FIX... FOR WHATEVER REASON THE DATE SUBSCRIPTION IS FIRING TWICE
                const preventTwice = false;

                // GET DATA OBJECT DATA
                this.draftObject$.first().subscribe((data) => {

                    // GET DATE TYPE
                    this.af.object(`/events/components/date/${this.auth.id}/${data.dateKey}`).first().subscribe((dateData) => {

                        // PREVENT FROM RUNNING TWICE
                        if (!preventTwice) {

                            // ---------EVENT IS NOT RECURRING--------
                            if (dateData.eventType !== 'recurring') {
                                const values: IoEvent = data;

                                // REMOVE UNNEEDED PROPERTIES SO WE CAN PUSH BACK UP TO FIREBASE
                                delete data['$key'];
                                delete data['$exists'];

                                data.creator = `${this.appService.contact.first} ${this.appService.contact.last}`;

                                data.liveStatus = 'live';

                                // WRITE DATA TO THE LIVE EVENT
                                liveObject$.update({ ref: this.eventId, ocode: this.appService.ocode,
                                    uid: this.auth.id, data: data }).then((success) => {

                                    this.toasty.success('Event is now live!');

                                    // ADD TO UPCOMING PROFILE
                                    profileUpcoming$.update({
                                        startDate: data.startDate,
                                        endDate: data.endDate
                                    });

                                    // TAKE ACTIONS ON THE TICKETS
                                    this.ticketService.ticketListObject$.first().subscribe((data) => {

                                        console.log('ticket object', data.val());

                                        const tickets = data.val();

                                        const $this = this;

                                        Object.keys(tickets).forEach(function (key, index) {
                                            $this.af.object(`/tickets/stage/${key}`).set(tickets[key]);
                                        });

                                    });

                                }, (err) => {

                                });
                            }

                            // --------------EVENT IS RECURRING----------------------
                            /*else{

                                preventTwice = true;

                                let dates:number[] = this.createMultiple(dateData);
                                //CLONE IT FOR MULTIPLES
                                let copies:IoEvent[] = [];
                                //CLEAN IT UP FOR UPLOAD
                                let i:number = 0;

                                console.log(dates);

                                //CREATE ARRAY OF NEW EVENTS WITH VARIOUS DATES ETC...
                                for(let date of dates){
                                    let copy:IoEvent = Object.assign({},data);
                                    delete copy['$key'];
                                    delete copy['$exists'];
                                    copies[i] = copy;
                                    let start = moment.unix(date).startOf('day');
                                    let endUnix = start.clone().endOf('day').unix();
                                    let startUnix = moment(start).unix();

                                    //MOMENT MANIPULATES THE STRING SO I'M TRYING TO CLONE WHENEVER MANIPULATING
                                    let startCopy = start.clone();

                                    copies[i].endDate = endUnix;
                                    copies[i].startDate = startUnix;
                                    copies[i].parentKey = data.$key;
                                    copies[i].date = this.createDateString(startCopy);

                                    console.log(i);

                                    i++;
                                }

                                for(let copy of copies){

                                    this.af.object(`/events/events/${this.auth.id}/${this.id}/childEventKeys/`).remove().then(()=>{
                                        this.af.list(`/events/live/`).push({
                                            ref: this.id, ocode: this.appService.ocode, uid: this.auth.id, data:copy
                                        }).then((success)=>{
                                            this.af.object(`/events/events/${this.auth.id}/
                                                ${this.id}/childEventKeys/${success.key}`).set({'set':true});

                                            this.singleTicketList$.first().subscribe((data)=>{

                                                console.log(data);

                                                this.af.object(`/tickets/stage/${this.id}`).remove().then(()=>{
                                                    for(let ticket of data){
                                                        delete ticket['$key'];
                                                        delete ticket['$exists'];
                                                        this.af.list(`/tickets/stage/${this.id}/${success.key}`).push(ticket);
                                                    }
                                                });

                                            });

                                        });
                                    });
                                }
                            }*/
                        }

                    });

                });

            } else {

                this.draftObject$.first().subscribe((data) => {
                    this.af.object(`/events/components/date/${this.auth.id}/${data.dateKey}`).first().subscribe((dateData) => {

                        // IF NOT RECURRING IT'S A SINGLE EVENT AND CAN BE REMOVED AS SUCH
                        if (dateData.eventType !== 'recurring') {
                            liveObject$.remove().then((success) => {
                                profileUpcoming$.remove().then(() => {
                                    this.toasty.info('Event is no longer live.');
                                });

                            }, (err) => {

                            });
                        }
                        // REMOVE ALL CHILD EVENTS
                        /*else {
                            let $this = this;
                            Object.keys(data.childEventKeys).forEach(function(key,index) {
                                $this.af.object(`/events/live/${key}`).remove();
                            });

                        }*/
                    });

                });

            }


        }, (err) => {
            this.toasty.error(err.message);
        });
    }

    // -----------------------------------------------------------------------------------------------------------------------
    // FUNCTION TO CALL ON DESTROY TO RELEASE CONNECTIONS TO FIREBASE
    // -----------------------------------------------------------------------------------------------------------------------
    onDestroy() {
        for (const reference of this.firebaseConnections) {
            reference.unsubscribe();
        }
    }

    // LOGIC FOR SHOWING ADVANCED BUTTON
    showAdvanced(): boolean {
        if (typeof this.draft !== 'undefined') {
            if (this.draft.status !== 'blank') {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    showSavedDraft() {
        const message = (this.isLive()) ? 'Event Saved' : 'Draft Saved';
        this.toasty.success(message);
    }

    showEventUpdated() {
        this.toasty.success('Event Updated');
    }

    isFieldValid(fieldId: string): boolean {
        if (this.fieldValidations.get(fieldId) && !this.fieldValidations.get(fieldId).valid) {
            return false;
        }
        return true;
    }

    isDateValid(): boolean {
        return this.isFieldValid('event-date') && this.isFieldValid('end-time') && this.isFieldValid('event-start-date');
    }

    setErrorInField(field: string, errMsg: string) {
        const fieldValidation: FieldValidation = new FieldValidation();
        fieldValidation.fieldId = field;
        fieldValidation.valid = false;
        fieldValidation.errorMessage = errMsg;
        this.fieldValidations.set(field, fieldValidation);
    }

    initValidationField(field) {
        this.fieldValidations.set(field, new FieldValidation());
    }

    isLive(): boolean {
        return this.draft.status === 'active';
    }

    isDraft(): boolean {
        return this.draft.status === 'draft';
    }

    setPromoterCount() {
        this.af.list(`/promoters/events/${this.eventId}`).first().subscribe((data) => {
            this.af.object(`/events/live/${this.eventId}/data`).update({ promoters: data.length });
        });
    }

    setOrganizerPromoter() {

        this.af.object(`/promoters/events/${this.eventId}/${this.appService.ocode}`)
            .update({ datetime: firebase.database.ServerValue.TIMESTAMP }).then(() => {
            if (this.appService.ocodeSet) {

                this.af.object(`/promoters/events/${this.eventId}/${this.appService.ocode}`)
                    .update({ datetime: firebase.database.ServerValue.TIMESTAMP }).then(() => {

                    // SET THE COUNT
                    this.setPromoterCount();

                    // ADD TO THE USERS PROMOTED EVENTS
                    this.af.object(`/promoters/users/${this.auth.id}/${this.eventId}`).update({ set: true });

                });
            }
        });

    }

}
