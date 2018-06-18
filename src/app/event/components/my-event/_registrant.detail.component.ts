import { Component, Input, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { ToastyService } from 'ng2-toasty';
import { AngularFireDatabase } from 'angularfire2/database'
import { IAccountAbout } from '../../../account/components/about/about-model';
import { Router } from '@angular/router';
declare var Clipboard: any;

@Component({
    selector: 'app-o-registrant',
    styles: [
        `
        `
    ],
    template: `

        <div class="row c-cart-table-row margin-vertical-sm" *ngIf="profileSet">
            <div class="col-md-2 col-sm-3 col-sm-5 c-cart-image">
                <a (click)="gotoProfile()" target="blank" *ngIf="ocodeSet">
                    <img [src]="profile.imageURL" alt="" class="img-fluid">
                </a>
            </div>
            <div class="col-md-3 col-sm-3 col-sm-6 c-cart-ref">

                <a (click)="gotoProfile()" >
                    <p>{{ profile.organizerName }}</p>
                </a>
            </div>
            <div class="col-md-5 col-sm-6 col-sm-6 c-cart-desc">

                <p>
                    <a class="c-font-bold c-theme-link c-font-dark">{{ children.length }}</a>
                </p>
            </div>
        </div>
    `
})

export class RegistrantComponent implements OnInit, AfterViewChecked {

    @Input() profileId;
    @Input() children;
    profile: IAccountAbout;
    profileSet = false;
    ocodeSet = false;
    ocode = '';

    constructor(private af: AngularFireDatabase, private router: Router) {

    }

    ngOnInit() {
        this.populateProfile();
        this.getOcode();
    }

    ngAfterViewChecked() {

    }

    gotoProfile() {
        this.router.navigateByUrl(`/${this.ocode}`);
    }

    getOcode() {
        this.af.object(`/ocodesById/${this.profileId}`).first().subscribe((data) => {
            this.ocode = data.ocode;
            this.ocodeSet = true;
        });
    }

    populateProfile() {

        return this.af.object(`/about/${this.profileId}/`).first().subscribe((profile) => {
            this.profile = profile;
            this.profileSet = true;
        });

    }





}
