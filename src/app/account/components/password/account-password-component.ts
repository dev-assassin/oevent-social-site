import { Component } from '@angular/core';
import { AuthService } from '../../../auth/services/auth-service';
import { AccountPasswordService } from './account-password-service';
import { ToastyService } from 'ng2-toasty/index';
import { AppService } from '../../../services/app-service';

@Component({
    selector: 'app-ccount-password',
    styles: [

    ],
    template: `
        <div class="col-md-9 sec-main">
            <h3 class="line">
                Change Password
            </h3>

            <h4>Password Change Confirmation</h4>

            <div class="row">
                <div class="form-group col-md-5">
                    <label for="exampleInputPassword1">Current Password</label>
                    <input [(ngModel)]="oldPass" type="password" class="form-control c-theme" id="firstname"
                        style="background-image: url(&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAASCAYAAABSO15qA
                            AAAAXNSR0IArs4c6QAAAPhJREFUOBHlU70KgzAQPlMhEvoQTg6OPoOjT+JWOnRqkUKHgqWP4OQbOPokTk6OTkVULNSLVc62oJmb
                            Idzd95NcuGjX2/3YVI/Ts+t0WLE2ut5xsQ0O+90F6UxFjAI8qNcEGONia08e6MNONYwCS7EQAizLmtGUDEzTBNd1fxsYhjEBnHP
                            QNG3KKTYV34F8ec/zwHEciOMYyrIE3/ehKAqIoggo9inGXKmFXwbyBkmSQJqmUNe15IRhCG3byphitm1/eUzDM4qR0TTNjEixGd
                            AnSi3keS5vSk2UDKqqgizLqB4YzvassiKhGtZ/jDMtLOnHz7TE+yf8BaDZXA509yeBAAAAAElFTkSuQmCC&quot;);
                            background-attachment: scroll; background-size: 16px 18px; background-position: 98% 50%;
                            background-repeat: no-repeat; cursor: auto;" autocomplete="off">
                </div>
            </div>

            <div class="row">
                <div class="form-group col-md-5">
                    <label for="exampleInputPassword1">New Password</label>
                    <input [(ngModel)]="newPass" type="password" class="form-control c-theme" id="firstname"
                        style="background-image: url(&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACIU
                            lEQVQ4EX2TOYhTURSG87IMihDsjGghBhFBmHFDHLWwSqcikk4RRKJgk0KL7C8bMpWpZtIqNkEUl1ZCgs0wOo0SxiLMDApWlgOPrH7/
                            5b2QkYwX7jvn/uc//zl3edZ4PPbNGvF4fC4ajR5VrNvt/mo0Gr1ZPOtfgWw2e9Lv9+chX7cs64CS4Oxg3o9GI7tUKv0Q5o1dAiTfCg
                            QCLwnOkfQOu+oSLyJ2A783HA7vIPLGxX0TgVwud4HKn0nc7Pf7N6vV6oZHkkX8FPG3uMfgXC0Wi2vCg/poUKGGcagQI3k7k8mcp5slc
                            GswGDwpl8tfwGJg3xB6Dvey8vz6oH4C3iXcFYjbwiDeo1KafafkC3NjK7iL5ESFGQEUF7Sg+ifZdDp9GnMF/KGmfBdT2HCwZ7TwtrBP
                            C7rQaav6Iv48rqZwg+F+p8hOMBj0IbxfMdMBrW5pAVGV/ztINByENkU0t5BIJEKRSOQ3Aj+Z57iFs1R5NK3EQS6HQqF1zmQdzpFWq3W
                            42WwOTAf1er1PF2USFlC+qxMvFAr3HcexWX+QX6lUvsKpkTyPSEXJkw6MQ4S38Ljdbi8rmM/nY+CvgNcQqdH6U/xrYK9t244jZv6ByU
                            OSiDdIfgBZ12U6dHEHu9TpdIr8F0OP692CtzaW/a6y3y0Wx5kbFHvGuXzkgf0xhKnPzA4UTyaTB8Ph8AvcHi3fnsrZ7Wore02YViqVO
                            rRXXPhfqP8j6MYlawoAAAAASUVORK5CYII=&quot;); background-attachment: scroll; background-size: 16px 18px;
                            background-position: 98% 50%; background-repeat: no-repeat;">
                </div>
            </div>

            <div class="row">
                <div class="form-group col-md-5">
                    <label for="exampleInputPassword1">Confirm New Password</label>
                    <input [(ngModel)]="newPassRepeat" type="password" class="form-control c-theme" id="firstname"
                        style="background-image: url(&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACIUlEQVQ4
                            EX2TOYhTURSG87IMihDsjGghBhFBmHFDHLWwSqcikk4RRKJgk0KL7C8bMpWpZtIqNkEUl1ZCgs0wOo0SxiLMDApWlgOPrH7/5b2QkYwX7jvn/
                            uc//zl3edZ4PPbNGvF4fC4ajR5VrNvt/mo0Gr1ZPOtfgWw2e9Lv9+chX7cs64CS4Oxg3o9GI7tUKv0Q5o1dAiTfCgQCLwnOkfQOu+oSLyJ2A7
                            83HA7vIPLGxX0TgVwud4HKn0nc7Pf7N6vV6oZHkkX8FPG3uMfgXC0Wi2vCg/poUKGGcagQI3k7k8mcp5slcGswGDwpl8tfwGJg3xB6Dvey8vz6
                            oH4C3iXcFYjbwiDeo1KafafkC3NjK7iL5ESFGQEUF7Sg+ifZdDp9GnMF/KGmfBdT2HCwZ7TwtrBPC7rQaav6Iv48rqZwg+F+p8hOMBj0IbxfMd
                            MBrW5pAVGV/ztINByENkU0t5BIJEKRSOQ3Aj+Z57iFs1R5NK3EQS6HQqF1zmQdzpFWq3W42WwOTAf1er1PF2USFlC+qxMvFAr3HcexWX+QX6lU
                            vsKpkTyPSEXJkw6MQ4S38Ljdbi8rmM/nY+CvgNcQqdH6U/xrYK9t244jZv6ByUOSiDdIfgBZ12U6dHEHu9TpdIr8F0OP692CtzaW/a6y3y0Wx5k
                            bFHvGuXzkgf0xhKnPzA4UTyaTB8Ph8AvcHi3fnsrZ7Wore02YViqVOrRXXPhfqP8j6MYlawoAAAAASUVORK5CYII=&quot;);
                            background-attachment: scroll; background-size: 16px 18px; background-position: 98% 50%;
                            background-repeat: no-repeat;">
                </div>
            </div>

            <br>

            <a class="btn btn-primary btn-lg" (click)="updatePasswordInit()">Submit</a>

        </div>
    `
})

export class AccountPasswordComponent {

    oldPass: string;
    newPass: string;
    newPassRepeat: string;

    constructor(private auth: AuthService, private toasty: ToastyService, private appService: AppService) {

    }

    updatePasswordInit() {
        this.updatePassword(this.newPass, this.oldPass);
    }

    updatePassword(newPass, oldPass) {

        this.appService.startLoadingBar();

        this.auth.updatePassword(newPass, oldPass).subscribe((data) => {

            if (data.status === 'success') {

                const toast = {
                    title: 'Success',
                    msg: 'Your password has been updated!'
                };

                this.appService.completeLoadingBar();
                this.toasty.success(toast);

            } else {
                const toast = {
                    title: 'Error',
                    msg: data.message
                };

                this.appService.completeLoadingBar();
                this.toasty.error(toast);

            }


        });
    }

}
