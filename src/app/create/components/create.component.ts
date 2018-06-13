import {Component, OnInit, OnDestroy, Injectable} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {AppService} from "../../services/app-service";
import {AuthService} from "../../auth/services/auth-service";
import {CreateEventService} from "../services/create-event.service";
import {PreviewService} from "../services/preview.service";
import {CreateAdvancedService} from "./advanced/services/advanced.service";
import {OCodeService} from "../../services/ocode-service";

@Component({
    templateUrl: './create.component.html',
    styles: [
        `
            /* SPECIAL STYLE FOR THESE TABS ONLY */
            .nav-tabs .nav-item{
                min-width: 120px;
                margin-bottom: -1px;
                text-align: center;
            }  
            
            .light-bottom-border{
                border-bottom: 1px solid #eaeaea;
            }
            
        `
    ]

})

export class CreateComponent implements OnInit, OnDestroy{

    needsOcode:boolean = false;

    constructor(private auth: AuthService,
                private appService: AppService,
                private ocodeService: OCodeService,
                private router: Router,
                private route: ActivatedRoute,
                public createEventService:CreateEventService,
                private previewService: PreviewService,
                private advancedService: CreateAdvancedService) {

    }

    //CHECK FOR AN ID, IF THERE IS NONE
    ngOnInit(): void{

        if(this.auth.authenticated){
            this.checkOcode();
        }
        else{
            this.auth.authObservable.first().subscribe(()=>{
                if(this.auth.authenticated){
                    this.checkOcode();
                }
                else{
                    this.checkOcode();
                }
            })
        }
    }

    checkOcode(){

        if(this.appService.ocodeChecked){
            this.ocodeAction();
        }
        else{
            this.appService.ocodeStatusEmitter.first().subscribe(()=>{
                  this.ocodeAction();
            })
        }
    }

    ocodeAction(){
        if(this.appService.ocodeSet){
            this.setInitialEvent();
        }
        else{
            this.appService.triggerNeedOcode();
            this.needsOcode = true;
        }
    }

    setInitialEvent(){
        this.route.params.forEach((params: Params) => {

            this.route.params.forEach((params: Params) => {
                if(params['id']){
                    //SET IN RELEVANT SERVICES
                    this.createEventService.setEventId(params['id']);
                    this.previewService.setEventId(params['id']);
                    this.advancedService.setEventId(params['id']);
                }
                else{
                    this.createEventService.setNewEvent().then((data)=>{
                        let key = data.key;
                        this.router.navigateByUrl(`/create/${key}/edit`);
                    });
                }
            })

        })
    }

    ngOnDestroy(): void{
        this.createEventService.onDestroy();
    }

}
