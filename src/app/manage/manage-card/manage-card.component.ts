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
    template: `
        <ng-template #delete let-c="close" let-d="dismiss">
            <div class="modal-header"> 
                <h4 class="modal-title"> 
                    Modal Title
                </h4>
                <button type="button" class="close" aria-label="Close" (click)="d('Cross click')">
                  <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body"> 
                <div class="row"> 
                    <div class="col-3"> 
                        <img [src]="event.imagePath" class="img-fluid" />
                    </div>
                    <div class="col-9"> 
                        Are you sure you want to delete {{ event.title }}?    
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" (click)="deleteEvent();c('')"><i class="fa fa-times"></i> Delete Draft</button>
                <button type="button" class="btn btn-secondary" (click)="c('')">Cancel</button>
            </div>
        </ng-template>
        
        <div *ngIf="set" class="manage-card-container">
            <div class="row align-items-center">
                <div class="col-md-4">
                    
                    <span 
                        *ngIf="eventType=='live' || eventType=='past' || eventType=='promotedLive' || eventType=='attendingLive'"
                        class="liveStatus {{event.liveStatus}}" 
                        >                        
                        {{ event.liveStatus }}
                    </span>
                    
                    <img [src]="event.imagePath" class="img-fluid" />
                    
                </div>
                <div class="col-md-8">
                    <div class="c-info-list">
                        <h3 class="c-title c-font-bold c-font-22 c-font-dark">
                            {{ event.title }}
                        </h3>
                        <div>{{ event.location }}</div>
                        <div>{{ event.date }} | {{ event.time }}</div>
                        
                        <!-- SHOW SIGNUP PROGRESS TO ORGANIZER-->
                        <div *ngIf="eventType=='live' || eventType=='past'">
                            <status-bar [percentage]="percentage"></status-bar>
                            <div style="font-size:12px;">{{ event.ticketsUsed }}/{{ event.totalTickets }} registrations filled</div>
                        </div>
                          
                        <!-- SHOW PROMOTER CONTRIBUTION TO PROMOTER -->
                        <div *ngIf="eventType=='promotedLive' || eventType=='promotedPast'">
                            <status-bar [percentage]="promoted.percentage"></status-bar>
                            <div style="font-size:12px;">
                                You've referred <strong>{{ promoted.displayPercentage }}%</strong> of registrants ({{ promoted.totalPromotions }}/{{ event.ticketsUsed }})
                            </div>
                            
                            <div> 
                                <a [routerLink]="'/manage/promoted/'+eventId+'/event-details'"><i class="fa fa-gear"></i> Manage</a>
                                <a [routerLink]="'/manage/promoted/'+eventId+'/invite'" style="margin-left:15px;"><i class="fa fa-users"></i> Invite</a>
                            </div>
                            
                        </div>
                        
                        <!--Bookmarked Events -->
                        <div *ngIf="eventType=='bookmark'"> 
                            <div *ngIf="organizerSet && organizerOcode.length" style="margin-bottom:1rem;">
                                Organized By
                                <a [routerLink]="'/'+organizerOcode" target="_blank"> 
                                    {{ organizer.organizerName }}
                                </a>
                            </div>
                            
                            <div>
                                <a [routerLink]="'/event/'+eventId" target="_blank" style="padding-left:2rem;"> 
                                    <i class="fa fa-desktop"></i> 
                                    Event Page                                    
                                </a>
                            </div>
                        </div>
                        
                        
                        <!-- SHOWING TO ATTENDEES -->
                        <div *ngIf="eventType=='attendingLive'"> 
                            <div *ngIf="organizerSet && organizerOcode.length" style="margin-bottom:1rem;">
                                Organized By
                                <a [routerLink]="'/'+organizerOcode" target="_blank"> 
                                    {{ organizer.organizerName }}
                                </a>
                            </div>
                            
                            <div> 
                                <a [routerLink]="'/manage/attending/'+eventId"> 
                                    <i class="fa fa-ticket"></i> 
                                    Manage Registration
                                </a>
                                <a [routerLink]="'/event/'+eventId" target="_blank" style="padding-left:2rem;"> 
                                    <i class="fa fa-desktop"></i> 
                                    Event Page                                    
                                </a>
                            </div>
                        </div>
                                                  
                                                  
                                                  
                                                  
                    </div>
                    <div class="low" *ngIf="eventType=='live'" style="margin-top:5px;"> 
                        <a routerLink="/my-event/{{eventId}}"><i class="fa fa-gear"></i> Manage</a> &nbsp; &nbsp; 
                        <a><i class="fa fa-users"></i> Invite</a>                        
                    </div>
                    <div class="low" *ngIf="eventType=='draft'" style="margin-top:5px;"> 
                        <a routerLink="/create/{{eventId}}" ><i class="fa fa-edit"></i> Edit</a> &nbsp; &nbsp; 
                        <a (click)="open(delete)"><i class="fa fa-trash"></i> Delete</a>                        
                    </div>
                </div>
            </div>
        </div>
        
    `,
    styles: [
        `
            :host{
              font-size:.9rem;
            }

            .liveStatus{
                position: absolute;
                display: inline-block;
                padding: 0px 14px;
                font-size: .75rem;
                background-color: rgba(0, 128, 0, 0.85);
                color: #fff;
                text-transform: lowercase;
            }
            
            .liveStatus.closed{
                background-color:rgba(243, 61, 4, 0.85);
            }
            
            .liveStatus.cancelled{
                background-color:rgba(224, 202, 26, 0.85);
            }
            
            h3{
                font-weight:100;
                font-size:15px;
                margin-bottom:0;
            }
            
            .low{
                font-size:.75rem;
            }
            
            .manage-card-container{
                padding-bottom:2rem;
            }
            
        `
    ]
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
