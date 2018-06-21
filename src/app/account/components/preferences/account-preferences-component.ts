import { Component } from '@angular/core';
import { AuthService } from '../../../auth/services/auth-service';
import { AccountPreferencesService } from './account-preferences-service';
import { AppService } from '../../../services/app-service';
import { ToastyService } from 'ng2-toasty/index';
import { IAccountPreferences, AccountPreferences } from './preferences-model';

@Component({
    selector: 'app-account-preferences',
    styles: [

    ],
    template: `

        <form #prefForm="ngForm" (ngSubmit)="onSubmit(prefForm.value)" novalidate>

            <h3 class="line">
                Email Preferences
            </h3>

            <h4>Following Notifications</h4>

            <div class="row">
                <div class="col-md-8 c-checkbox-list">
                    <div class="c-checkbox has-info">
                        <input  name="personNewEvent" [ngModel]="values.personNewEvent" type="checkbox"
                            id="checkbox1" class="c-check" checked="">

                        <label for="checkbox1">
                            <span class="inc"></span>
                            <span class="check"></span>
                            <span class="box"></span>
                            Receive email when someone you’re following makes a new event
                        </label>
                    </div>
                    <div class="c-checkbox has-info">
                        <input  name="placeNewEvent" [ngModel]="values.placeNewEvent" type="checkbox"
                            id="checkbox2" class="c-check" checked="">

                        <label for="checkbox2">
                            <span class="inc"></span>
                            <span class="check"></span>
                            <span class="box"></span>
                            Receive email when a place you’re following makes a new event
                        </label>
                    </div>
                </div>
            </div>

            <h4>ōevent Notifications</h4>

            <div class="row">
                <div class="col-md-8 c-checkbox-list">
                    <div class="c-checkbox has-info">
                        <input [ngModel]="values.newsletter" name="newsletter" type="checkbox" id="checkbox3" class="c-check" checked="">

                        <label for="checkbox3">
                            <span class="inc"></span>
                            <span class="check"></span>
                            <span class="box"></span>
                            Receive oEvent newsletter
                        </label>
                    </div>
                    <div class="c-checkbox has-info">
                        <input [ngModel]="values.features" name="features" type="checkbox" id="checkbox4" class="c-check" checked="">

                        <label for="checkbox4">
                            <span class="inc"></span>
                            <span class="check"></span>
                            <span class="box"></span>
                            Notify me of new ōEvent features and updates
                        </label>
                    </div>
                </div>
            </div>

            <br>

            <button type="submit" class="btn btn-lg btn-primary">Save Changes</button>
        </form>
    `
})

export class AccountPreferencesComponent {

    values: IAccountPreferences = new AccountPreferences();

    constructor(private preferencesService: AccountPreferencesService, public appService: AppService, public toasty: ToastyService) {

        this.preferencesService.prefs$.subscribe((values) => {

            if (values.$exists()) {
                this.values = values;
            } else {
                this.addDefault();
            }


        });
    }

    onSubmit(values: any, showToast = true) {



        try {

            this.appService.startLoadingBar();
            console.log(values);
            this.preferencesService.prefs$.set(values).then(() => {
                const toast = {
                    title: 'Success',
                    msg: 'Your preferences have been saved successfully!'
                };

                if (showToast) {
                    this.appService.completeLoadingBar();
                    this.toasty.success(toast);
                }

            }, (err) => {

                const toast = {
                    title: 'Failed',
                    msg: `Your preferences were not saved: ${err}`
                };


                this.appService.completeLoadingBar();
                this.toasty.error(toast);



            });

        }
        // tslint:disable-next-line:one-line
        catch (err) {
            const toast = {
                title: 'Failed',
                msg: `Your preferences were not saved: ${err}`
            };
            this.appService.completeLoadingBar();
            this.toasty.error(toast);
        }
    }

    addDefault() {
        this.values.features = this.values.newsletter = this.values.personNewEvent = this.values.placeNewEvent = true;
        this.onSubmit(this.values, false);
    }
}
