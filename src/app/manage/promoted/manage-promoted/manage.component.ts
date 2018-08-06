import {Component, AfterContentInit, OnInit} from '@angular/core';
import {Router, NavigationEnd, RoutesRecognized, Params, ActivatedRoute} from '@angular/router';
import {AuthService} from "../../../auth/services/auth-service";
import {ManagePromotionsService} from "../../../shared-module/services/manage-promotions.service";
import {EventService} from "../../../event/services/event-service";

@Component({
    template: `

        <section class="secondary-content"> 
            <div class="container"> 
                <ul class="breadcrumbs">
                    <li>
                        <a routerLink="/manage">
                            Manage Events
                        </a>
                    </li>
                    <li>
                        <a routerLink="/manage/promoted"> 
                            Promoted Events
                        </a>
                    </li>
                    <li *ngIf="eventService.set"> 
                        {{ eventService.event.title }}
                    </li>
                </ul>
                
                <div class="row"> 
                    <div class="col-md-3"> 
                        <manage-promoted-menu></manage-promoted-menu>
                    </div>
                    
                    <div class="col-md-9" *ngIf="eventService.eventId"> 
                        <router-outlet></router-outlet>
                    </div>
                </div>        
                
            </div>
        </section>


        
    `,
    styles: [

    ]
})

export class ManagePromotedComponent implements OnInit{

    eventId:string;

    constructor(private auth: AuthService,
                private router: Router,
                private route: ActivatedRoute,
                public eventService: EventService,
                public promotionsService: ManagePromotionsService) {

    }

    ngOnInit(): void{

        this.route.params.forEach((params: Params) => {

            this.route.params.forEach((params: Params) => {

                if(!params['id']){
                    this.eventService.inviteKey = "promoter";
                }

                else{
                    this.eventId = params['id'];
                    this.eventService.setEvent(params['id']).then(()=>{
                        this.eventService.inviteKey = "promoter";
                    });
                }
            });
        });

    }

}
