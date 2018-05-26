import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pluck';

import {Component, OnInit, Input, EventEmitter} from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database/database";
import {AuthService} from "../../auth/services/auth-service";
import {ManageService} from "../../shared-module/services/manage-service";
import {IoEvent} from "../../shared-models/oevent";
import {Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AppService} from "../../services/app-service";
import {FirebaseListObservable} from "angularfire2/database/firebase_list_observable";
import {IEventRegistration} from "../../event/models/event-registration";
import {IAccountAbout, AccountAbout} from "../../account/components/about/about-model";

@Component({
    selector: '[manage-card]',
    templateUrl: '/manage-card.component.html',
    styleUrls: ['./manage-card.component.scss']
})

export class ManageCardComponent implements OnInit{

    @Input() eventId;
    @Input() eventType;
    event:IoEvent;
    eventSetEmitter:EventEmitter<any> = new EventEmitter();
    set:boolean = false;
    image:string;
    percentage:number;
    organizerSet:boolean = false;
    organizer:IAccountAbout = new AccountAbout();
    organizerOcode:string="";

    promoted:any = {
        displayPercentage: 0,
        percentage: 0,
        totalPromotions: 0
    };

    constructor(private af:AngularFireDatabase,
                private auth:AuthService,
                private router:Router,
                private appService:AppService,
                private modalService: NgbModal) {

    }

    ngOnInit(){
       this.setEvent();
       console.log(this.eventType);
       if(this.eventType === 'promotedLive' || this.eventType === 'promotedHistory'){
           this.populatePromoted();
       }
    }

    setEvent(){
        if(this.eventType === "live" || this.eventType === "promotedLive" || this.eventType == "attendingLive" || this.eventType == "bookmark"){
            this.af.object(`/events/live/${this.eventId}`).subscribe((data)=>{
                if(data.$exists()){
                    this.event = data.data;
                    this.setOrganizer(data.uid);
                    this.setPercentage();
                    this.set = true;
                    this.eventSetEmitter.emit();
                }
            });
        }
        else{
            this.af.object(`/drafts/draft/${this.auth.id}/${this.eventId}`).subscribe((data)=>{
                if(data.$exists()){
                    this.event = data;
                    this.set = true;
                    this.eventSetEmitter.emit();
                }
            });
        }
    }

    setOrganizer(id){
        this.af.object(`/about/${id}`).first().subscribe((about)=>{this.organizer=about;this.organizerSet=true;})
        this.af.object(`/ocodesById/${id}`).first().subscribe((data)=>{
            this.organizerOcode = data.ocode;
        })
    }

    open(content) {
        this.modalService.open(content).result.then((result) => {

        }, (reason) => {

        });
    }

    setPercentage(){
        this.percentage = (this.event.ticketsUsed / this.event.totalTickets);
    }

    editEvent(){
        this.router.navigateByUrl(`/create/${this.eventId}`);
    }

    deleteEvent(){
        //THIS ONLY HAPPENS IN DRAFT STATUS
        this.af.object(`/drafts/draft/${this.auth.id}/${this.eventId}`).remove();
    }

    populatePromoted(){
        //GET REGISTRATIONS
        if(this.appService.ocodeSet && this.set){
           this.getPromoterData();
        }
        else {
            this.appService.ocodeService.ocodeEmitter.subscribe(()=>{
                this.getPromoterData();
            })
        }
    }

    getPromoterData(){

        let path = `/promoters/events/${this.eventId}/${this.appService.ocode}/registrations/`;
        let promoteEvent$:FirebaseListObservable<IEventRegistration[]> = this.af.list(path);

        promoteEvent$.subscribe((data)=>{

            console.log(data);

            this.groomRegistrationData(data);

            if(this.set){
                this.finalizePromoterData();
            }
            else{
                this.eventSetEmitter.first().subscribe(()=>{
                    this.finalizePromoterData();
                });
            }
        });
    }

    groomRegistrationData(data){

        let total = 0;

        for(let registrant of data){
            delete registrant.$exists;
            delete registrant.$key;

            Object.keys(registrant).forEach(function(key,index) {
                if(registrant[key].hasChildren){
                    total += registrant[key].children.length;
                }
                else{
                    total += 1;
                }
            });


        }

        this.promoted.totalPromotions = total;
    }

    finalizePromoterData(){

        if(this.event.ticketsUsed > 0){
            this.promoted.percentage = this.promoted.totalPromotions / this.event.ticketsUsed;
            let displayPercentage = Math.round(this.promoted.percentage * 100);
            this.promoted.displayPercentage = displayPercentage.toString();
        }
        else{
            this.promoted.displayPercentage = 0;
        }

    }



}
