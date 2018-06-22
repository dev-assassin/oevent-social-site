import { Component, AfterContentInit, OnInit } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized, ActivatedRoute, Params } from '@angular/router';
import { AppService } from '../../../services/app-service';
import { AuthService } from '../../../auth/services/auth-service';

@Component({
    selector: 'app-advanced-nav',
    template: `
        <div class="csec-nav">
                <div class="c-layout-sidebar-menu c-theme ">
                    <!-- BEGIN: LAYOUT/SIDEBARS/SHOP-SIDEBAR-DASHBOARD -->
                    <div class="c-sidebar-menu-toggler">
                        <h3 class="c-title c-font-uppercase c-font-bold">Advanced Settings</h3>
                        <a href="javascript:;" class="c-content-toggler" data-toggle="collapse" data-target="#sidebar-menu-1">
                            <span class="c-line"></span>
                            <span class="c-line"></span>
                            <span class="c-line"></span>
                        </a>
                    </div>
                    <ul class="c-sidebar-menu collapse " id="sidebar-menu-1">
                        <li class="c-dropdown c-open">
                            <a class="c-toggler">Settings

                            </a>
                            <ul class="c-dropdown-menu">
                                <li routerLinkActive="active">
                                    <a routerLink='email'>Email Settings</a>
                                </li>
                            </ul>
                        </li>
                        <li class="c-dropdown c-open">
                            <a class="c-toggler">Customize Emails

                            </a>
                            <ul class="c-dropdown-menu">
                                <li routerLinkActive="active">
                                    <a routerLink='promoter'>Promoter Welcome</a>
                                </li>
                                <li routerLinkActive="active">
                                    <a routerLink='registrant'>Registrant Welcome</a>
                                </li>
                                <li  routerLinkActive="active">
                                    <a routerLink='reminder'>Event Reminder</a>
                                </li>
                                <li routerLinkActive="active">
                                    <a routerLink='completion'>Event Completion</a>
                                </li>

                            </ul>
                        </li>
                        <li class="c-dropdown c-open">
                            <a class="c-toggler">Registration Form

                            </a>
                            <ul class="c-dropdown-menu">
                                <li  routerLinkActive="active">
                                    <a routerLink='fields'>Registration Form Fields</a>
                                </li>
                                <li  routerLinkActive="active">
                                    <a routerLink='confirmation'>Confirmation Page</a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <!-- END: LAYOUT/SIDEBARS/SHOP-SIDEBAR-DASHBOARD -->
                </div>
            </div>
    `,
    styles: [
        `
            .c-sidebar-menu{
                margin-top:25px;
            }
        `
    ],

})

export class AdvancedNavComponent implements OnInit {

    constructor(private auth: AuthService, private appService: AppService, private router: Router, private route: ActivatedRoute) {

    }

    ngOnInit() {

    }


}
