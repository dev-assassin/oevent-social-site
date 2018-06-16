import {Component, Input, OnInit, AfterViewInit, AfterViewChecked} from '@angular/core';
import {ToastyService} from "ng2-toasty";
import {EventService} from "../../services/event-service";
declare var Clipboard:any;

@Component({
    selector: 'o-invite',
    styles: [
        `
            :host{
                margin-bottom:2rem;
            }

            .login-error{padding-bottom:15px;}
            
            .share{
              display:flex;
              justify-content: space-between;
              margin-top:3px;
            }
            
            .share>div{
                min-width: 66px;
                text-align: center;
                margin: 5px 2px;
            }
            
            .share.narrow>div{
                min-width:33px;
            }
            
            .share>div>a{
                border-radius: 2px;
                text-align:center;
                display:block;
                width:100%;
                padding:4px 0;
                background-color: #26c6da;
                color: white;
            }
            
            .share>div>a:hover{
                background-color:#1d8390;
            }
            
        `
    ],
    template: `
       <div>
           <label><strong>Invitation link:</strong></label>
           <div class="input-group">
               <input id="link" [(ngModel)]="link" class="form-control">
               <span class="input-group-btn">
                    <button id="copy-link" data-clipboard-target="#link" class="btn btn-primary" (click)="copy()"><i class="fa fa-files-o"></i> Copy to Clipboard</button>
               </span>
           </div>
           
           
           <div [ngClass]="{'narrow': width!='wide'}" class="share" *ngIf="!hideSocials && !twoSocials">
           
                <div>
                    <a (click)="shareTwitter()"><i class="fa fa-twitter"></i></a>
                </div>
           
                <div>
                    <a (click)="shareFacebook()"><i class="fa fa-facebook"></i></a>
                </div>
           
                <div>
                    <a (click)="shareReddit()"><i class="fa fa-reddit"></i></a>
                </div>
           
                <div>
                    <a (click)="shareGoogle()"><i class="fa fa-google-plus"></i></a>
                </div>
            
                <div>    
                    <a (click)="shareEmail()"><i class="fa fa-envelope"></i></a>
                </div>
           </div>
           
           <div *ngIf="twoSocials" class="text-center" style="margin-top:2.5rem;margin-bottom:2rem;">
           
                <h4 style="border:0;text-align:center"> 
                    POST TO SOCIAL MEDIA
                </h4>
                <div class="row"> 
                    <div class="col-6"> 
                        <button class="btn btn-lg btn-facebook btn-block" (click)="shareFacebook()" style="font-size:1.75rem;"> 
                            <i class="fa fa-facebook"></i>
                        </button>
                    </div>
                    
                    <div class="col-6"> 
                        <button class="btn btn-lg btn-twitter btn-block" (click)="shareTwitter()" style="font-size:1.75rem;"> 
                            <i class="fa fa-twitter"></i>
                        </button>
                    </div>
                </div>
                
           </div>
           
       </div>
       
       
    
    `
})

export class InviteComponent implements OnInit, AfterViewChecked{

    @Input() eventId;
    @Input() title;
    @Input() description;
    @Input() imagePath;
    @Input() width;
    @Input() hideSocials:boolean = false;
    @Input() twoSocials:boolean = false;
    @Input() hideButtonText:boolean = false;

    //THE CLASS WAS POPULATING BEFORE THE OCODE WAS SET SO NOW IT CHECKS EVERY TIME OCODE IS CHANGED
    private _ocode: any;
    @Input()
    set ocode(ocode: any) {
        if(ocode) this._ocode = ocode;
        this.createLink();
        this.createClipboard();
    }
    get ocode() { return this._ocode; }

    link:string;
    viewChecked:boolean = false;
    popupSettings:string = "toolbar=0,status=0,resizable=yes,width=450,height=600";

    constructor(private toasty: ToastyService,
                private eventService: EventService) {
        this.width = "wide";
    }

    ngOnInit(){
        this.createLink();
    }

    ngAfterViewChecked(){
        if(!this.viewChecked){
            this.createClipboard();
        }
    }

    createLink(){

        let getUrl = window.location;
        let baseUrl = getUrl .protocol + "//" + getUrl.host + "/";


        console.log(baseUrl);


        if(typeof this.ocode != "undefined"){
            this.link = `${baseUrl}event/${this.eventId};ocode=${this.ocode}`;
        }
        else{
            this.link = `${baseUrl}event/${this.eventId}/${this.eventId}`;
        }

        this.eventService.shareLink = this.link;

    }

    createClipboard(){
        new Clipboard('#copy-link');
        this.viewChecked = true;
    }

    copy(){
        this.toasty.success("Event link copied to clipboard!");
    }

    /*
    copyLink() {

        let link = this.link;

        if (window.clipboardData && window.clipboardData.setData) {
            // IE specific code path to prevent textarea being shown while dialog is visible.
            return clipboardData.setData("Text", link);

        } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            let textarea = document.createElement("textarea");
            textarea.textContent = link;
            textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
            document.body.appendChild(textarea);
            textarea.select();
            try {
                return document.execCommand("copy");  // Security exception may be thrown by some browsers.
            } catch (ex) {
                console.warn("Copy to clipboard failed.", ex);
                return false;
            } finally {
                document.body.removeChild(textarea);
                this.toasterService.pop("success", "", "link copied to clipboard");
            }
        }

    }*/

    shareTwitter() {

        let text = encodeURIComponent(`Join my event at ōEvent! | ${this.title}`);
        let url = `https://www.twitter.com/intent/tweet?text=${text}&url=${this.link}`;

        window.open(
            url,
            'Twitter',
            this.popupSettings
        );

    }

    shareFacebook() {

        let url=`https://www.facebook.com/sharer/sharer.php?u=${this.link}`;

        window.open(
            url,
            'FACEBOOK',
            this.popupSettings
        )
    }

    shareReddit() {
        let title = encodeURIComponent(`Join my event at ōEvent! | ${this.title}`);
        let url =  `https://www.reddit.com/submit?url=${this.link}&title=${title}`;
        window.open(
            url,
            'REDDIT',
            this.popupSettings
        )
    }

    shareGoogle() {
        let url =  `https://plus.google.com/share?url=${this.link}`;
        window.open(
            url,
            'Google +',
            this.popupSettings
        )
    }

    shareEmail() {
        let subject = encodeURIComponent(`Join my event at ōEvent! | ${this.title}`);
        let body = encodeURIComponent(`Sign up with oevent for , ${this.title} at ${ this.link }`);
        let url = `mailto:?body=${body}&subject=${subject}`;
        window.open(url, '_blank');
    }


}
