import {Component, EventEmitter, Input, Output, ViewEncapsulation, OnInit} from '@angular/core';
import {AppService} from "../services/app-service";
import {AuthService} from "../auth/services/auth-service";
import {IHeader, Header} from "../models/header";
import {InappNotificationService} from "../shared-module/services/inapp-notification.service";
import {Message} from "../notifications/models/Message";

@Component({
  selector: 'app-header',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app-header.scss'
  ],
  templateUrl: './app-header.html'
})

export class AppHeaderComponent{

  @Input() showProfileReminder: boolean = false;
  @Input() showAboutMeReminder: boolean = false;
  @Input() authenticated: boolean;
  @Output() signOut = new EventEmitter(false);

  profile:string;
  profileSet:boolean = false;
  header:IHeader;
  activeMessages:Message[];

  constructor(public appService: AppService, public auth: AuthService, private inAppNotificationService:InappNotificationService) {
    this.appService.updateProfileEmitter.subscribe(()=>{
      this.getProfileImage();
      this.loadActiveMessages();
    });
    this.activeMessages = new Array();
  }



  public loadActiveMessages(){
    if(this.auth.authenticated) {
      this.inAppNotificationService.getActiveMessages(this.auth.id).subscribe((data) => {
        this.activeMessages = data;
      });
    }
  }



  getProfileImage(){
    if(this.auth.authenticated){
      this.auth.getFile('profile').then((success)=>{
        this.profileSet = true;
        this.profile = success;
        this.appService.userImage = success;
      }, (error)=>{

      })
    }
  }

  signIn(){
    this.appService.openLogin();
  }

  triggerSignOut(){
    this.profileSet = false;
    this.signOut.emit()
  }

  join(){
    this.appService.openJoin();
  }

}
