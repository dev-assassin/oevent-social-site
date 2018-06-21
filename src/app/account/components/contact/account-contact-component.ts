import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth-service';
import { AccountContactService } from '../../../shared-module/services/account-contact-service';
import { IAccountContact, AccountContact } from './contact-model';
import { ToastyService } from 'ng2-toasty/index';
import { AppService } from '../../../services/app-service';
import { AccountService } from '../../services/account-service';
import { FirebaseObjectObservable } from 'angularfire2/database/firebase_object_observable';
import { AngularFireDatabase } from 'angularfire2/database/database';

@Component({
    selector: 'app-account-contact',
    styles: [],
    templateUrl: './contact.html'
})

export class AccountContactComponent {
    values: IAccountContact = new AccountContact();
    contact$: FirebaseObjectObservable<IAccountContact> = new FirebaseObjectObservable();

    constructor(public auth: AuthService,
        private af: AngularFireDatabase,
        private accountService: AccountService,
        private toasty: ToastyService,
        private appService: AppService) {

        this.appService.startLoadingBar();

        if (this.auth.authenticated) {
            this.populate();
        } else {
            this.auth.authObservable.first().subscribe(() => {
                this.populate();
            });
        }

    }

    populate() {

        this.contact$ = this.af.object(`/contact/${this.auth.id}`);
        let contact: any;
        contact = this.contact$.subscribe((values) => {
            this.values = values;
        });
        this.accountService.destroyObservable.subscribe((data) => { if (data) { contact.unsubscribe(); } });
        this.appService.stopLoadingBar();
    }

    onSubmit(form: any) {

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

                this.contact$.set(cleanedValues).then(() => {
                    this.appService.completeLoadingBar();
                    this.toasty.success('Your contact information has been saved!');
                }, (err) => {

                    const toast = {
                        title: 'Failed',
                        msg: `Your contact information was not saved: ${err.message}`
                    };
                    this.appService.completeLoadingBar();
                    this.toasty.error(toast);

                });

            }
            // tslint:disable-next-line:one-line
            catch (err) {
                const toast = {
                    title: 'Failed',
                    msg: `Your contact information was not saved: ${err}`
                };
                this.appService.completeLoadingBar();
                this.toasty.error(toast);
            }
        }

    }

}
