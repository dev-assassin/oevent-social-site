import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pluck';

import {Component, AfterContentInit, OnInit} from '@angular/core';
import {Router, NavigationEnd, RoutesRecognized, ActivatedRoute, Params} from '@angular/router';
import {AuthService} from "../../auth/services/auth-service";
import {AppService} from "../../services/app-service";
import {EmailActionService} from "../services/email-action.service";


@Component({
    templateUrl: './password-reset.component.html',
    selector: 'password-reset',
    styles: [
        `
           
        `
    ],

})

export class PasswordResetComponent implements OnInit{

    code:string;
    codeVerified:boolean = false;
    codeChecked:boolean = false;
    newPassword:string;

    showErr:boolean = false;
    errMessage = "";

    email:string = null;
    password:string = null;
    confirm:string = null;

    passwordReset:boolean = false;
    passwordResetError:boolean = false;

    constructor(private auth: AuthService,
                private appService: AppService,
                private router: Router,
                private route: ActivatedRoute,
                private emailActionService: EmailActionService) {

    }

    ngOnInit(){
        this.route.queryParams.subscribe((params:Params)=>{
            this.code = params['oobCode'];
            this.verifyCode();
        })
    }

    verifyCode(){
        this.emailActionService.verifyCode(this.code).then((email)=>{
            this.email = email;
            this.codeVerified = true;
            this.codeChecked = true;
        }, ()=>{
            this.codeVerified = false;
            this.codeChecked = true;
        })
    }

    confirmFocus(){
        this.showErr = false;
    }

    confirmBlur(){
        if(this.password != this.confirm){
            this.showErr = true;
        }
    }

    onSubmit(form){
        this.showErr = false;

        if(form.controls['password'].value == form.controls['confirm'].value){
            console.log(2);
            if(form.valid){
                this.emailActionService.resetPassword(this.code, form.controls['password'].value).then(()=>{
                    this.passwordReset = true;
                }, ()=>{
                    this.passwordResetError = true;
                })
            }
        }
        else{
            this.showErr = true;
            this.errMessage = "Passwords do not match";
        }

    }

}
