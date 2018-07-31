import {Component, AfterContentInit} from '@angular/core';
import {Router, NavigationEnd, RoutesRecognized} from '@angular/router';
import {AuthService} from "../../../auth/services/auth-service";
import {ManagePromotionsService} from "../../../shared-module/services/manage-promotions.service";

@Component({
    selector: 'manage-promoted-menu',
    template: `
        <div class="sec-nav"> 
            <div class="c-layout-sidebar-menu c-theme"> 
                <div class="c-sidebar-menu-toggler"> 
                    <h3 class="c-title c-font-uppercase c-font-bold">Manage Promotion</h3>
                </div>
                
                <a class="c-content-toggler" data-target="#sidebar-menu-1" data-toggle="collapse" href="javascript:;">
                    <span _ngcontent-c4="" class="c-line"></span>
                    <span _ngcontent-c4="" class="c-line"></span>
                    <span _ngcontent-c4="" class="c-line"></span>
                </a>
                
                <ul class="c-sidebar-menu collapse" id="sidebar-menu-1"> 
                    <li class="c-dropdown c-open"> 
                        <a class="c-toggler">Management</a>
                        <ul class="c-dropdown-menu"> 
                            <li routerLinkActive="active"> 
                                <a routerLink="event-details"> 
                                    Event Details
                                </a>
                            </li>
                            <li routerLinkActive="active"> 
                                <a routerLink="my-registrations"> 
                                    My registrations
                                </a>
                            </li>
                            <li routerLinkActive="active"> 
                                <a routerLink="registration-types"> 
                                    Registration types
                                </a>
                            </li>
                            
                            
                        </ul>
                    </li>
                    <li class="c-dropdown c-open"> 
                        <a class="c-toggler">Communication</a>
                        <ul class="c-dropdown-menu"> 
                            <li routerLinkActive="active"> 
                                <a routerLink="invite"> 
                                    Invite to attend
                                </a>
                            </li>
                            <li routerLinkActive="active"> 
                                <a routerLink="send-email"> 
                                    Send email
                                </a>
                            </li>
                           <!-- <li routerLinkActive="active"> 
                                <a routerLink="sent-messages"> 
                                    Sent messages
                                </a>
                            </li> -->
                        </ul>
                    </li>
                    
                </ul>
                
            </div>
        </div>
    `,
    styles: [

    ]
})

export class PromotedManageMenuComponent{

    constructor(private auth: AuthService,
                private router: Router,
                public promotionsService: ManagePromotionsService) {

    }

}
