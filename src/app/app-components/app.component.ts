import {Component, AfterContentInit, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {SignInComponent} from "../shared-module/components/sign-in/sign-in";
import {NgbModal, NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AppService} from "../services/app-service";
import {JoinComponent} from "../shared-module/components/join/join";
import {SlimLoadingBarService} from "ng2-slim-loading-bar/index";
import {ToastyService, ToastyConfig} from "ng2-toasty/index";
import * as moment from 'moment';
import {FreeTrialModalComponent} from "./free-trial-modal";
import {ForgotPasswordComponent} from "./forgot-password.component";
import {NeedOcodeComponent} from "../shared-module/components/need-ocode/need-ocode";
import {AuthService} from "../auth/services/auth-service";

@Component({
  selector: 'app-root',
  styleUrls: [
    './app.scss'
  ],
  providers: [NgbActiveModal],
  template: `
    <div>
        <ng2-slim-loading-bar [color]="'#34c1d6'" [height]="'3px'"></ng2-slim-loading-bar>
    </div>
    <div>
      <app-header
        [showProfileReminder]="auth.showProfileReminder"
        [showAboutMeReminder]="auth.showAboutMeReminder"
        [authenticated]="auth.authenticated"
        (signOut)="signOut()" ></app-header>
      
      <main class="main">
        <router-outlet></router-outlet>
      </main>
      
      <footer class="footer">
        <div class="container">
            <div class="ftr-r">
                <h2>Contact Us</h2>
                <p>572 E 1400 S <br/> Orem, UT 84097<br/>USA</p>
                <!--<h6><a href="tel:801-434-4422">801-434-4422</a></h6>-->
                <a href="mailto:support@oevent.com">support@oevent.com</a>
            </div>
            <div class="ftr-l">
                <div class="ftr-logo"><a href="index.html"><img src="../../../assets/images/home/logo-icon.jpg" alt="" /></a></div>
                <div class="social-icon">
                    <a href="https://www.facebook.com/oeventcom/"><img src="../../../assets/images/home/facebook.png" alt="" /></a>
                    <a href=""><img src="../../../assets/images/home/twitter.png" alt="" /></a>
                    <!--<a href=""><img src="../../../assets/images/home/google-plus.png" alt="" /></a>-->
                </div>
                <p>©2017 ōEvent <span>all rights reserved</span></p>
            </div>
        </div>
      </footer>
    </div>
      
    <template ngbModalContainer></template>    
    
    <ng2-toasty></ng2-toasty>
  `
})

export class AppComponent implements AfterContentInit, OnInit {

  env:string;
  set:boolean = false;

  constructor(private appService: AppService,
              public auth: AuthService,
              private router: Router,
              private modalService: NgbModal,
              public activeModal: NgbActiveModal,
              public toastyService: ToastyService,
              public toastyConfig: ToastyConfig) {
    this.toastyConfig.theme = 'bootstrap';

    appService.openLoginEmitter.subscribe(()=>{
      this.openSignIn();
    });

    appService.openJoinEmitter.subscribe((data)=>{
      this.openJoin();
    });

    appService.triggerFreeTrial.subscribe(()=>{
      this.openFreeTrial();
    });

    appService.forgotPasswordEmitter.subscribe(()=>{
      this.openForgottenPassword();
    });

    router.events.subscribe(() => {
      window.scrollTo(0, 0);
    });

    this.appService.ocodeBlockEmitter.subscribe(()=>{
      this.blockForOcode();
    })

  }

  ngOnInit(){

    //DON'T LOAD ANYTHING UNTIL AUTH HAS BEEN CHECKED AND POPULATED (LOGGED IN OUR OUT)
    this.set = (typeof this.auth.user != "undefined");
    this.auth.authObservable.subscribe(()=>{
      this.set = (typeof this.auth.user != "undefined");
    })
  }

  signOut(): void {
    this.appService.signOut();
    this.appService.reset();
  }

  openSignIn(): void{
    this.activeModal.dismiss();
    const signInRef = this.modalService.open(SignInComponent);
    signInRef.componentInstance.name = "Login";
  }

  openJoin(): void{
    this.activeModal.dismiss();
    const signInRef = this.modalService.open(JoinComponent);
    signInRef.componentInstance.name = "Join";
  }

  openFreeTrial(): void{
    this.activeModal.dismiss();
    const trialRef = this.modalService.open(FreeTrialModalComponent);
    trialRef.componentInstance.name = "Trial";
  }

  openForgottenPassword(): void{
    this.activeModal.dismiss();
    const forgotRef = this.modalService.open(ForgotPasswordComponent);
    forgotRef.componentInstance.name = "Forgot";
  }

  ngAfterContentInit(){

  }

  blockForOcode(){
    this.activeModal.dismiss();
    const ocode = this.modalService.open(NeedOcodeComponent, {keyboard:false});
    ocode.componentInstance.name = "no_ocode";
  }

}
