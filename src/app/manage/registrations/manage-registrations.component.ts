import {Component, AfterContentInit, OnInit} from '@angular/core';
import {Router, NavigationEnd, RoutesRecognized, Route, Params, ActivatedRoute} from '@angular/router';
import {AuthService} from "../../auth/services/auth-service";
import {ManageRegistrationsService} from "./manage-registrations.service";
import {IoEvent, oEvent} from "../../shared-models/oevent";
import {AngularFireDatabase} from "angularfire2/database/database";
import {IEventRegistration, EventRegistration} from "../../event/models/event-registration";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ToastyService} from "ng2-toasty";
import {AppService} from "../../services/app-service";

@Component({
    template: ` 
 
    <ng-template #delete let-c="close" let-d="dismiss">
        <div class="modal-header"> 
            <h4 class="modal-title"> 
                Delete Registration
            </h4>
            <button type="button" class="close" aria-label="Close" (click)="d('Cross click')">
              <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body"> 
            <div class="row"> 
                <div class="col-12"> 
                    Are you sure you want to delete {{ ticketToCancel.ticketTitle }}?
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-danger" (click)="deleteTicket(ticketToCancel);c('')"><i class="fa fa-times"></i> Delete Registration</button>
            <button type="button" class="btn btn-secondary" (click)="c('')">Cancel</button>
        </div>
    </ng-template>
 
 
    <section class="secondary-content">
        <div class="container">
            <ul class="breadcrumbs print-hide">
                <li>
                    <a routerLink="/manage">
                        Manage Events
                    </a>
                </li>
                <li>
                    <a routerLink="/manage/attending">
                        Attending
                    </a>
                </li>
                <li> 
                    {{ event.title }}
                </li>
            </ul>
            <div class="row" *ngIf="idSet"> 
                <div class="col-md-3 print-hide" style="padding-top:28px;"> 
                    <div class="buttons">
                        <div style="margin-bottom:.75rem"> 
                            <button class="btn btn-outline-primary btn-block btn-lg" (click)="print()"> 
                                Print Confirmation
                            </button>
                        </div>
                        <div style="margin-bottom:.75rem"> 
                            <button class="btn btn-outline-warning btn-block btn-lg" (click)="cancelOrder()"> 
                                Cancel Order
                            </button>
                        </div>
                    </div>
                    
                    <div style="margin-bottom:1.5rem"> 
                        <quick-contact [profileId]="ownerId" [color]="'#26C6DA'" [title]="'Event Organizer'"></quick-contact>
                    </div>
                    
                    <quick-contact [profileId]="promoterId" [title]="'Promoter'" *ngIf="promoterSet"></quick-contact>
                    
                </div>
                <div class="col-md-9"> 
                    <h3 class="line print-hide"> 
                        REGISTRATION - <a [routerLink]="'/'+eventId">{{event.title}}</a>
                        <span style="font-size:1rem;color:#333;display:block;font-weight:normal"> 
                            {{ event.date }}, {{ event.time }}
                        </span>
                    </h3>
                    
                    
                    <h3 *ngIf="!myTickets.length"> 
                        You have cancelled all registrations from this order
                    </h3>
                    
                    <div class="ticket-container print-hide" *ngFor="let ticket of myTickets"> 
                        <h4> 
                            {{ ticket.ticketTitle }} <span *ngIf="ticket.ticketQty > 1">({{ ticket.ticketQty }})</span>
                        </h4>
                        
                        <div class="tc-body"> 
                            <div *ngFor="let field of ticket.fields"> 
                                <div *ngIf="field.value.enabled"> 
                                    <strong>{{ field.data.label }}:</strong> {{ field.input }}
                                </div>
                            </div>
                            
                            <button class="pull-right btn btn-outline-warning" (click)="cancelTicket(delete, ticket);">Cancel registration</button>
                            
                            <div style="clear:both"></div>
                            
                        </div>
                        
                    </div>       
                                 
                                 
                                 <!-- shows only on printable view -->
                    <div class="printable hidden" style="border:2px solid #444;border-radius:5px;margin-bottom:30px;" *ngFor="let ticket of myTickets"> 
                        <table class="tickets"> 
                            <tr> 
                                <td style="border-right:1px solid #ededed;width:800px;"> 
                                    <h4 style="padding:2rem 1rem"> 
                                        Registration Confirmation - {{ event.title }}
                                    </h4>
                                    
                                    <div class="row"> 
                                        <div class="col-12"> 
                                            <div style="border-bottom:1px solid #ededed;padding:1rem;"> 
                                                <span style="color:#888;">Order Information</span><br/><br />
                                                Ordered by {{ myName }}
                                            </div>
                                        </div>                                            
                                    </div>
                                    
                                    <div class="row"> 
                                        <div class="col-6"> 
                                            <div style="padding:1rem">
                                                <span style="color:#888;">Registration Type</span><br/><br />
                                                <h3 style="text-transform: uppercase;padding:0;margin:0;font-size:22px;"> {{ ticket.ticketTitle }} <span *ngIf="ticket.ticketQty > 1">({{ ticket.ticketQty }})</span></h3>
                                            </div>
                                        </div>
                                        <div class="col-6" style="padding:1rem;border-left:1px solid #ededed;"> 
                                            <span style="color:#888;">Registrant</span><br/><br />
                                            <h3 style="padding:0;margin:0;font-size:22px;"> {{ ticket.firstName }} {{ ticket.lastName }}</h3>
                                        </div>
                                    </div>
                                    
                                    
                                    
                                </td>
                                <td style="width:300px;"> 
                                    <div style="border-bottom:1px solid #ededed;padding:1rem;">
                                        <span style="color:#888;">Date / Time</span><br/><br /><br />
                                        
                                        <strong>{{ event.date }}</strong><br />
                                        {{ event.time }}
                                        
                                    </div>
                                    <div style="padding:1rem;"> 
                                        <span style="color:#888;">Location</span><br/><br />
                                        
                                        {{ event.location }}
                                        
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>
                    
                    
                </div>                
            </div>
        </div>
    </section>
    `,
    styles: [
        `
            .buttons{ margin-bottom:2.5rem; }
            
            .ticket-container{
                border:1px solid #ededed;
                margin-bottom:2.5rem;
            }
            
            .ticket-container h4{
               padding:.5rem 1rem;
            }
            
            .ticket-container .tc-body{
                padding:1rem;
                padding-bottom:2rem;
                
            }
            
            .printable{
                height:0px;
                overflow:hidden;
                position:absolute;    
                opacity:0;
                background-image:url('/assets/images/logo-tran.svg');
                background-repeat:no-repeat;
                background-size:80%;
                background-position:center center;
                webkit-print-color-adjust:exact;
            }
            
            @media print {
                .printable{
                    height:auto;
                    overflow:visible;
                    position:static;
                    opacity:1;
                    page-break-inside: avoid;
                    
                }
                
                .print-hide{
                    display:none;
                }
            }
            
        `
    ]
})

export class RegistrationsManageComponent implements OnInit{

    eventId:string = "";
    idSet:boolean = false;
    event:IoEvent = new oEvent();
    promoterId:string;
    promoterSet:boolean = false;
    ownerId:string;
    registration:IEventRegistration = new EventRegistration();
    registrationWhole:any;
    checked:boolean = false;

    myName:string = "";

    allTickets:any[] = [];
    myTickets:any[] = [];

    ticketToCancel:any;

    constructor(private auth: AuthService,
                private af:AngularFireDatabase,
                private router: Router,
                private route: ActivatedRoute,
                private toasty: ToastyService,
                public appService: AppService,
                private modalService:NgbModal,
                public promotionsService: ManageRegistrationsService) {

        if(this.appService.aboutSet){
            this.myName = this.appService.about.organizerName;
        }
        else{
            this.appService.aboutEmitter.subscribe(()=>{
                this.myName = this.appService.about.organizerName;
            });
        }

    }

    ngOnInit(){
        this.route.params.forEach((params: Params) => {

            this.route.params.forEach((params: Params) => {
                this.eventId = params['id'];
                this.populateEvent();
                this.populateRegistration();
            })

        });
    }

    populateEvent(){
        this.af.object(`/events/live/${this.eventId}`).first().subscribe((data)=>{
           this.event = data.data;
           this.ownerId = data.uid;
           this.idSet = true;
        });
    }

    populateRegistration(){
        console.log(this.eventId);
        this.promotionsService.eventRegistration(this.eventId).then((ref)=>{
            ref.first().subscribe((data)=>{

                this.registrationWhole = data;

                if(data.length){
                    this.registration = data[0];
                    console.log(data[0]);
                    console.log(this.registration);
                    this.populatePromoter(data[0].ocode);
                    this.populateTickets();
                }
            });
        });
    }

    populateTickets(){
        this.checked = false;
        this.allTickets = [];

        this.af.list(`/registrations/type/${this.eventId}`).first().subscribe((types)=>{
           for(let type of types){
               console.log(type);
               let path = `/registrations/type/${this.eventId}/${type.$key}`;
               let cancelPath = `/registrations/cancelled/${this.eventId}/${type.$key}`;
               this.af.list(path).first().subscribe((tickets)=>{
                  for(let ticket of tickets){
                      ticket['path'] = `${path}/${ticket.$key}`;
                      ticket['cancelPath'] = `${cancelPath}/${ticket.$key}`;
                      this.allTickets.push(ticket);
                  }

                  this.groomTickets();

               });
           }
        });
    }

    groomTickets(){
        this.myTickets = [];

        for(let ticket of this.allTickets){
            if(ticket.uid == this.auth.id){
                this.myTickets.push(ticket);
            }
        }
        this.checked = true;
    }

    cancelTicket(content, ticket){
        this.ticketToCancel = ticket;

        this.modalService.open(content).result.then((result) => {

        }, (reason) => {

        });
    }

    cancelOrder(){
        for(let ticket of this.myTickets){
            this.deleteTicket(ticket);
        }

        //COPY TO CANCELLED FOR EVENT ACCESS AS WELL AS USER ACCESS WITH SOME CRAZY NESTING TO DELETE EVERYWHERE
        this.af.object(`/registrations/orders/cancelled/users/${this.auth.id}/${this.eventId}`).set(this.registrationWhole).then(()=>{
            this.af.object(`/registrations/orders/cancelled/events/${this.auth.id}/${this.eventId}`).set(this.registrationWhole).then(()=>{
                this.af.object(`/registrations/users/${this.auth.id}/${this.eventId}`).remove().then(()=>{
                    this.af.object(`/registrations/events/${this.eventId}/${this.auth.id}`).remove().then(()=>{
                        this.toasty.success("Your order has been removed");
                        this.router.navigateByUrl('/manage/attending/upcoming');
                    });
                });
            });
        });



    }

    deleteTicket(ticket){
        //COPY TO CANCELLED AND REMOVE
        this.af.object(ticket.cancelPath).set(ticket).then(()=>{
            this.af.object(ticket.path).remove().then(()=>{

                let ticketRef = this.af.object(`/tickets/live/${this.eventId}/${ticket.ticketRef}`);
                let eventRef = this.af.object(`/events/live/${this.eventId}/data`);

                //UPDATE TICKET COUNTS -- TODO MANAGE THIS IN THE BACKEND LATER
                ticketRef.first().subscribe((ticketData)=>{
                    let newTicketsUsedTicket = ticketData.ticketsUsed - ticket.ticketQty;
                    let newTicketsLeftTicket = ticketData.ticketsLeft + ticket.ticketQty;
                    ticketRef.update({ticketsLeft:newTicketsLeftTicket, ticketsUsed:newTicketsUsedTicket});
                });


                this.populateTickets();
                this.toasty.success("Ticket has been cancelled");
            })
        });
    }

    print(){
        window.print();
    }

    populatePromoter(ocode){
        this.af.object(`/ocodes/${ocode}`).first().subscribe((data)=>{
            console.log(data);
            this.promoterId = data.uid;
            this.promoterSet = true;
        })
    }



}
