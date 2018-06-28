import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/services/auth-service';
import { AppService } from '../../services/app-service';
import { AngularFireDatabase } from 'angularfire2/database';
import { IAccountAbout, AccountAbout } from '../../account/components/about/about-model';
import { FollowingService } from '../services/following.service';
import { EmailPopupComponent } from '../../shared-module/components/email/email-popup.component';
import { ProfileService } from '../../profile/services/profile-service';
import { EmailService } from '../../shared-module/services/email.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountContactService } from '../../shared-module/services/account-contact-service';
import { ManagePromotionsService } from '../../shared-module/services/manage-promotions.service';
import { IAccountContact, AccountContact } from '../../account/components/contact/contact-model';
import { EventService } from '../../event/services/event-service';

@Component({
    selector: 'app-following-person',
    template: `
                <div class="row" style="margin-bottom: 15px; padding:0 15px 0 15px;">
                    <div class="col-md-6">
                        <img [src]="profile.imageURL" class="img-fluid"  />
                    </div>
                    <div class="col-md-6">
                        <div class="row">
                            <div class="col-sm-12"><a routerLink="/{{ ocode }}">{{ profile.organizerName }}</a> </div>
                            <div class="col-sm-12 medium-font">
                           <a routerLink="/{{ ocode }}"> {{upcomingEventsCount}}</a> upcoming events<br />
                            Promoting <a routerLink="/{{ ocode }}">{{promotionsCount}}</a> events
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-sm-12 medium-font" >
                                <a (click)="email()" target="blank" class=" pull-left">
                                <span aria-hidden="true" class="fa fa-envelope"></span>
                                    Email
                                </a>
                                <a (click)="follow()" *ngIf="!following" target="blank" class="pull-left" style="margin-left: 10px;">
                                    <span aria-hidden="true" class="fa fa-plus-square-o"></span>
                                    Follow
                                </a>
                                <a (click)="unfollow()" *ngIf="following" target="blank" class="pull-left" style="margin-left: 10px;">
                                    <span aria-hidden="true" class="fa fa-minus-square-o"></span>
                                    Unfollow
                                </a>
                                <div style="clear:both;"></div>
                            </div>
                        </div>
                    </div>

                </div>

    `,
    styles: [
        `
           :host{
                padding:0 2px;
           }

           .medium-font{
            font-size:12px;
           }

        `
    ],

})

// tslint:disable-next-line:component-class-suffix
export class FollowingPerson implements OnInit {
    @Input() id: string;
    set = false;
    profile: IAccountAbout;
    ocode = '';
    contact: IAccountContact;
    following = false;
    promotionsCount: number;
    upcomingEventsCount: number;


    constructor(private accountContactService: AccountContactService, private eventService: EventService,
        private authService: AuthService, private managePromotionService: ManagePromotionsService,
        private af: AngularFireDatabase, private modalService: NgbModal,
        private appService: AppService, private emailService: EmailService,
        private activeModal: NgbActiveModal, private followingService: FollowingService) {
        this.profile = new AccountAbout();
        this.contact = new AccountContact();
    }

    ngOnInit() {
        this.populateFollower();
        this.followingService.checkFollow(this.id).subscribe((data) => {
            if (data && data.set) {
                this.following = true;
            }
        });
        this.managePromotionService.getUserPromotions(this.id).subscribe((data) => {
            if (data) {
                this.promotionsCount = data.length;
            }
        });
        this.eventService.getUserUpcomingEvents(this.id).subscribe((data) => {
            if (data) {
                this.upcomingEventsCount = data.length;
            }
        });
    }

    populateFollower() {
        this.af.object(`/ocodesById/${this.id}`).first().subscribe((snap) => {
            this.ocode = snap.ocode;
            this.af.object(`/about/${this.id}`).first().subscribe((snap) => {
                this.profile = snap;
                this.set = true;
            });
            // tslint:disable-next-line:no-shadowed-variable
            this.accountContactService.getContactRef(this.id).first().subscribe((snap) => {
                this.contact = snap;
            });
        });

    }

    unfollow() {
        this.followingService.removeFollowAndFollower(this.id).then(() => {
            this.following = false;
        });
    }

    follow() {
        this.appService.startLoadingBar();
        this.followingService.setFollowAndFollower(this.id, this.contact).then(() => {
            this.following = true;
            this.appService.stopLoadingBar();
        });


    }

    email() {
        this.emailService.setToEmail(this.contact.email, this.profile.organizerName);
        this.activeModal.dismiss();
        const emailRef = this.modalService.open(EmailPopupComponent);
        emailRef.componentInstance.name = 'Email Organizer';
    }

}


