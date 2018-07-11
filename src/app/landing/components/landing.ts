import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pluck';

import {Component, AfterContentInit} from '@angular/core';
import {Router, NavigationEnd, RoutesRecognized} from '@angular/router';
import {AuthService} from "../../auth/services/auth-service";
import {AppService} from "../../services/app-service";

declare var jQuery:any;
declare var OtriggerSlides:any;


@Component({
    templateUrl: './landing.html',
    styleUrls: [
        './landing.scss'
    ]
})

export class LandingComponent {

    constructor(private auth: AuthService,
                private router: Router,
                public appService: AppService) {
        jQuery('body').css('background-color', '#fff');

        this.hideHeader();

        if(this.auth.authenticated){
            this.showHeader();
        }
        else{
            this.auth.authObservable.subscribe(()=>{
                if(this.auth.authenticated){
                    this.showHeader();
                }
                else{
                    this.hideHeader();
                }
            });
        }

        router.events.subscribe((val) => {
            if(val instanceof RoutesRecognized){
                jQuery('body').css('background-color', '#f7f7f7')
            }
        });
    }

    hideHeader(){
        jQuery('app-header, footer.c-layout-footer').css('display', 'none');
        jQuery('html').css('marginTop', '0');
    }

    showHeader(){
        jQuery('app-header, footer.c-layout-footer').css('display', 'block');
        jQuery('html').css('marginTop', '90px');
    }



    /** COMING BACK LATER **
    search(){
        let route = `/search?q=${this.searchString}&location=${this.location}&range=40mi`;
        if(this.date != "all"){
            route += `&date=${this.date}`;
        }
        this.router.navigateByUrl(route);
    }*/



}
