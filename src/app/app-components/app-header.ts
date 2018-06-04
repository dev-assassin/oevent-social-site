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
  template: `

    <header>
      <nav class="fixed-top">
        <top-bar-reminder 
            [show]="showProfileReminder" 
            [title]="'Youre almost done!'" 
            [message]="'Dont forget to add your profile information.'" 
            [linkText]="'Go to profile &#8594;'" 
            [linkAddress]="'/account/contact'"
        ></top-bar-reminder>

        <top-bar-reminder 
            [show]="!showProfileReminder && showAboutMeReminder" 
            [title]="'Youre almost done!'" 
            [message]="'Dont forget to add your picture and other information in the about me section'" 
            [linkText]="'Go to about me &#8594;'" 
            [linkAddress]="'/account/about'"
        ></top-bar-reminder>

        <nav class="navbar navbar-light bg-faded">
          <div class="container-fluid">
              <a class="navbar-brand" routerLink="/" routerLinkActive="active">
                  <img src="../../assets/images/logo.svg" alt="ōevent logo">
              </a>
  
              <div class="pull-right">
                  <button class="navbar-toggler hidden-md-up" type="button" data-toggle="collapse" data-target="#exCollapsingNavbar2">
                      ☰
                  </button>
              </div>
  
              <div class="pull-right main-nav-container">
                  <div class="navbar-collapse navbar-left navbar-toggleable-sm collapse" id="exCollapsingNavbar2">
                      <ul class="nav navbar-nav">
                      
                          <li class="nav-item" *ngIf="authenticated">
                            <a class="nav-link" routerLink="/create" routerLinkActive="active">
                                <span class="fa fa-plus"></span>
                                Create Event
                            </a>
                          </li>
                          
                          <li class="nav-item">
                              <a class="nav-link" routerLink="/search">
                                  <span class="fa fa-search"></span>
                                  Find Events
                              </a>
                          </li>
                          
                          <li class="nav-item" *ngIf="!authenticated">
                              <a class="nav-link" (click)="join()">
                                  Join Now
                              </a>
                          </li>
                          <li class="nav-item" *ngIf="!authenticated">
                              <a class="nav-link" (click)="signIn()">
                                  Login
                              </a>
                          </li>
                          
                          <li class="nav-item" *ngIf="authenticated">
                              <a class="nav-link notifications" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                  <span class="fa fa-bell"></span><span class="hidden-sm-up notifications-icon"> &nbsp; &nbsp;Notifications</span>
                                  <span class="badge top-icon-right">{{activeMessages.length}}</span>
                              </a>
                               <ul class="dropdown-menu notification-dropdown pull-left" aria-labelledby="user-drop">
                                    <li *ngFor="let message of activeMessages">
                                    <notif-item [message]="message" [mini]="true" ></notif-item>
                                    </li>
                                    <li class="text-center">
                                      <button onclick="document.location = '/notifications'" class="btn btn-primary text-center">
                                          View Notifications Center
                                      </button>
                                  </li>
                               </ul>
                              <!--
                              <ul class="dropdown-menu notification-dropdown pull-left" aria-labelledby="user-drop">
                                  <li class="notification">
                                      <div class="row people">
                                          <div class="col-sm-3">
                                              <a href="organizer.html">
                                                  <img src="../../assets/images/avatars/brianne.jpg" class="img-responsive img-circle">
                                              </a>
                                          </div>
                                          <div class="col-sm-9 c-pos-relative">
                                              <span class="delete-message">
                                                  <a href="#">
                                                      <span class="fa fa-times"></span>
                                                  </a>
                                              </span>
  
                                              <a href="organizer.html">Brianne Hovey</a> — 4/9, 11:48 PM
  
                                              <div class="c-margin-b-8 c-margin-t-8">
                                                  added a new event: "Introduction to Essential Oils 2K16"
                                              </div>
  
                                          </div>
                                      </div>
                                  </li>
  
                                  <li role="separator" class="divider"></li>
  
                                  <li class="notification">
                                      <div class="row people">
                                          <div class="col-sm-3">
                                              <a href="organizer.html">
                                                  <img src="../../assets/images/avatars/brianne.jpg" class="img-responsive img-circle">
                                              </a>
                                          </div>
                                          <div class="col-sm-9 c-pos-relative">
                                              <span class="delete-message">
                                                  <a href="#">
                                                      <span class="fa fa-times"></span>
                                                  </a>
                                              </span>
  
                                              <a href="organizer.html">Brianne Hovey</a> — 4/9, 11:48 PM
  
                                              <div class="c-margin-b-8 c-margin-t-8">
                                                  added a new event: "Introduction to Essential Oils 2K16"
                                              </div>
                                          </div>
                                      </div>
                                  </li>
  
                                  <li role="separator" class="divider"></li>
  
                                  <li class="text-center">
                                      <button onclick="document.location = '/notifications'" class="btn btn-primary text-center">
                                          View Notifications Center
                                      </button>
                                  </li>
                              </ul>
                              -->
                          </li>
                          
                          <li class="nav-item dropdown profile-dropdown" *ngIf="authenticated">
                              <a class="nav-link" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                      <span class="avatar-wrapper">
                                          <img *ngIf="profileSet" [src]="profile" class="img-circle user-avatar-image">
                                      </span>
                                  {{ appService.header.first }} <span class="fa fa-caret-down"></span>
                              </a>
                              <div class="dropdown-menu" aria-labelledby="user-drop">
                                  <a class="dropdown-item" routerLink="/bookmarks">Bookmarks</a>
                                  <a class="dropdown-item" routerLink="/following">Following</a>
                                  <a class="dropdown-item" routerLink="/manage">Managing Events</a>
                                  <a class="dropdown-item" routerLink="/account/contact">Account Settings</a>
                                  <a *ngIf="appService.ocodeSet" class="dropdown-item" href="organizer.html" routerLink="/{{ appService.ocode }}">My Profile</a>
                                  <a class="dropdown-item" (click)="triggerSignOut();">Logout</a>
                              </div>
  
                          </li>
                      </ul>
                  </div><!-- .navbar-collapse -->
              </div><!-- .pull-right .main-nav-container -->
          </div><!-- .container -->
        </nav>
        </nav>
      </header>
    
  `
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
