import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth-service';
import { AccountSocialService } from './account-social-service';
import { AngularFireDatabase } from 'angularfire2/database/database';
import { FirebaseObjectObservable } from 'angularfire2/database/firebase_object_observable';
import { Form } from '@angular/forms';
import { AppService } from '../../../services/app-service';
import { ToastyService } from 'ng2-toasty';

@Component({
    selector: 'app-account-social',
    styles: [

    ],
    templateUrl: ``
})

export class AccountSocialComponent implements OnInit {

    socialsSet = false;
    socials: Socials = new Socials();
    socials$: FirebaseObjectObservable<Socials>;

    constructor(private auth: AuthService,
        private af: AngularFireDatabase,
        private appService: AppService,
        private toasty: ToastyService,
        private socialService: AccountSocialService) {

    }

    ngOnInit() {
        this.socials$ = this.af.object(`/socials/${this.auth.id}`);
        this.socials$.first().subscribe((socials) => {
            if (socials.$exists()) {
                this.socials = socials;
                this.socialsSet = true;
            } else {
                this.socialsSet = true;
            }

        });
    }

    onSubmit(form: any) {

        console.log(form.valid, form.errors);

        if (form.valid) {
            const cleanedValues = {};
            const values = form.value;

            for (const key in values) {
                if (typeof values[key] !== 'undefined') {
                    cleanedValues[key] = values[key];
                }
            }

            try {

                this.appService.startLoadingBar();

                this.socials$.set(cleanedValues).then(() => {
                    this.appService.completeLoadingBar();
                    this.toasty.success('Your social media information has been saved!');
                }, (err) => {

                    const toast = {
                        title: 'Failed',
                        msg: `Your social media information was not saved: ${err.message}`
                    };
                    this.appService.completeLoadingBar();
                    this.toasty.error(toast);

                });

            }
            // tslint:disable-next-line:one-line
            catch (err) {
                const toast = {
                    title: 'Failed',
                    msg: `Your social media information was not saved: ${err}`
                };
                this.appService.completeLoadingBar();
                this.toasty.error(toast);
            }
        }
    }

}

export class Socials {
    facebookToggle = false;
    twitterToggle = false;
    linkedInToggle = false;
    googlePlusToggle = false;
    googlePlus: string = null;
    twitter: string = null;
    linkedIn: string = null;
    facebook: string = null;
}
