import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/take';

import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AuthService} from "../../../auth/services/auth-service";
import {EventService} from "../../services/event-service";
import {AngularFireDatabase} from "angularfire2/database/database";
import * as _ from 'lodash';
import {DomSanitizer} from "@angular/platform-browser";
import {ITicket} from "../../../create/models/tickets.models";
import {ITicketRegistration} from "../../models/ticket-registration";
import {NgbModal, NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AttendeeModalComponent} from "./attendee-modal.component";
import {EmailService} from "../../../shared-module/services/email.service";
import {EmailPopupComponent} from "../../../shared-module/components/email/email-popup.component";
import * as jsonCSV from 'json-2-csv';


@Component({
    selector: 'my-event-attendees',
    template: `
        <h3 class="line" style="margin-bottom:0px;">
            Attendees
        </h3>
        
        <span class="pull-left"> 
            <strong>Total Registrations:</strong> {{ eventService.event.ticketsUsed }}
        </span>
        
        <a [href]="sanitize(csvString)" download="{{filename}}" *ngIf="showCSV" class="pull-right">Download table to CSV</a>
        
        <table class="table table-striped"> 
            <thead> 
                <tr>
                    <th> 
                        Name
                    </th>
                    <th> 
                        Promoter
                    </th>
                    <th> 
                        Email
                    </th>
                    <th> 
                        Registration Type
                    </th>
                </tr>
            </thead>
            <tbody> 
                <tr *ngFor="let attendee of attendeeList;let i = index"> 
                    <td> 
                        <a (click)="openModal(i)" class="pull-left">{{attendee.firstName}} {{ attendee.lastName }}</a>
                        <a (click)="triggerEmail(attendee.email, attendee.firstName, attendee.lastName)" class="pull-right"><i class="fa fa-envelope"></i></a>
                    </td>
                    <td> 
                        {{ attendee.promoterName }}
                    </td>
                    <td> 
                        {{ attendee.email }} 
                    </td>
                    <td> 
                        {{ attendee.ticketTitle }}
                        <span *ngIf="attendee.ticketQty>1"> 
                            ({{ attendee.ticketQty }})
                        </span>
                    </td>                    
                </tr>            
            </tbody>
            
        </table>
        
        
    `,
    styles: [
        `
            
        `
    ]

})

export class MyEventAttendeesComponent implements OnInit{

    //TRACK IF DATA HAS BEEN LOADED FROM FIREBASE
    set:boolean = false;

    attendees$:any;
    attendeeList:any[] = [];
    csvList:any[] = [];
    csvString:string = "";
    showCSV:boolean = false;
    filename:string = "";
    popupData:any[] = [];

    constructor(private auth: AuthService,
                private router: Router,
                private route: ActivatedRoute,
                private modalService: NgbModal,
                public activeModal: NgbActiveModal,
                private emailService: EmailService,
                private sanitizer:DomSanitizer,
                public eventService: EventService, private af:AngularFireDatabase) {
        this.attendees$ = this.eventService.getAttendeesByType();
        this.attendees$.subscribe((data)=>{

            this.attendeeList = [];

            for(let ticket of data){

                delete ticket.$exists;
                delete ticket.$key;

                for (var property in ticket) {
                    if (ticket.hasOwnProperty(property)) {
                        this.attendeeList.push(ticket[property]);
                    }
                }
            }

            console.log(this.attendeeList);

            this.createFullData();

        });
    }

    ngOnInit(){

        let a = Number(new Date());
        let date = new Date(a);

        if(this.eventService.set){
            this.filename = this.eventService.event.title + " - registrations - " + date;
        }
        else{
            this.eventService.eventUpdated.first().subscribe(()=>{
                this.filename = this.eventService.event.title + " - registrations - " + date;
            });
        }
    }

    createFullData(){

        let $this = this;

        let i = 0;

        for(let attendee of this.attendeeList){
            let entry:any = {};

            attendee.fields = _.sortBy(attendee.fields, "order");

            attendee.fields.forEach((field, index) =>{
                if(field.value.enabled){
                    if(typeof field.input != "undefined"){
                        entry[field.data.label] = field.input;
                    }
                    else{
                        entry[field.data.label] = "";
                    }
                }

            });

            entry["Promoter"] = attendee.promoterName;
            entry["Promoter Ocode"] = attendee.ocode;
            entry["Registration Type"] = attendee.ticketTitle;
            entry["Ticket Quantity"] = attendee.ticketQty;

            this.csvList.push(entry);
            this.popupData[i] = {data:entry, uid:attendee.uid};
            i++;
        }

        let jsonAction = function(err, csv){
            if(err) throw err;

            let escapedCSV = encodeURI(csv);
            $this.csvString = `data:text/csv;charset=utf-8,${escapedCSV}`;
            $this.showCSV = true;
        };

        let options = {

            wrap  : '"', // Double Quote (") character
            field : ',', // Comma field delimiter
            array : ';', // Semicolon array value delimiter
            eol   : '\n' // Newline delimiter

        };

        jsonCSV.json2csv(this.csvList, jsonAction, options);
    }

    sanitize(url:string){
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }

    openModal(index){
        this.eventService.modalAttendee = this.popupData[index];

        this.activeModal.dismiss();
        const signInRef = this.modalService.open(AttendeeModalComponent);
        signInRef.componentInstance.name = "Attendee";
    }

    triggerEmail(email, firstName, lastName){
            let name = firstName + " " + lastName;
            this.emailService.setToEmail(email, name);
            this.activeModal.dismiss();
            const emailRef = this.modalService.open(EmailPopupComponent);
            emailRef.componentInstance.name = "Attendee";
    }


}