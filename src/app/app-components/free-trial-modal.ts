import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../auth/services/auth-service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import {AngularFireDatabase} from "angularfire2/database";
import {AppService} from "../services/app-service";
import {ToastyService} from "ng2-toasty";

@Component({
    selector: 'ft-signup',
    styles: [
        `
            .login-error{padding-bottom:15px;}
        `
    ],
    templateUrl: './free-trial.html'
})

export class FreeTrialModalComponent {

    suppress:boolean = false;
    ocode:string = "";
    error:boolean = false;
    errorMsg:string = "";

    constructor(public auth: AuthService,
                private router: Router,
                private toasty: ToastyService,
                public activeModal: NgbActiveModal,
                private af: AngularFireDatabase,
                private appService: AppService) {

    }

    gotoFreeTrial(){
        this.activeModal.dismiss();
        this.router.navigateByUrl('/free-trial');
    }

    suppressToggle(){

        let freeTrial$ = this.af.object(`marketing/free-trial-popup/${this.auth.id}`);

        if(!this.suppress){
            freeTrial$.set({'set':true});
        }
        else{
            freeTrial$.remove();
        }
    }

    validate():boolean{
        if(this.ocode.length > 5 && this.ocode.length < 21 && this.ocode.match(/^[0-9a-z]+$/)){
            //THIS IS THE ONLY ERROR COMING ONCE WE HIT THE DB
            this.errorMsg = "Your ōcode is already in use";
            return true;
        }
        else{
            this.errorMsg = "ōcode must be be between 6 and 20 characters and can only contain letters or numbers";
            this.error = true;
            return false;
        }
    }

    setOcode(){
        if(this.validate()){

            this.appService.ocodeService.setOcode(this.ocode).then(()=>{
                this.appService.ocodeService.getOcodeObservable.emit(false);
                this.toasty.success("your new ōcode has been selected!");
            }, (err)=>{
                this.error = true;
            })


        }
    }
}
