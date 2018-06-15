import { Component, Input, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { ToastyService } from 'ng2-toasty';
import { AngularFireDatabase } from 'angularfire2/database';
import { IAccountAbout } from '../../../account/components/about/about-model';
import { Router } from '@angular/router';
declare var Clipboard: any;

@Component({
    selector: 'app-o-attendee',
    styles: [
        ` `
    ],
    template: `
        <div class="c-image" *ngIf="profileSet">
            <a (click)="gotoProfile()" target="blank" *ngIf="ocodeSet">
                <img [src]="profile.imageURL" alt="" class="img-fluid">
            </a>
            <img [src]="profile.imageURL" alt="" class="img-fluid" *ngIf="!ocodeSet">
        </div>
    `
})

export class AttendeeComponent implements OnInit, AfterViewChecked {

    @Input() profileId;
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
