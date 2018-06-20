import "rxjs/add/operator/do";
import "rxjs/add/operator/pluck";
import {Component, OnInit, AfterViewInit} from "@angular/core";
import {EventService} from "../../services/event-service";
import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AddEmailsModalComponent} from "./invitations/add-emails-modal.component";
import {InviteEmail} from "../../models/invite-email";
import {UpdateEmailModalComponent} from "./invitations/update-email-modal.component";
import {AppService} from "../../../services/app-service";
import {FirebaseObjectObservable} from "angularfire2/database/firebase_object_observable";
import {EmailInviteTemplate} from "../../models/invite-template";
import {ToastyService} from "ng2-toasty";
import * as moment from "moment";
import {FieldValidation} from "../../../../assets/common/validation/field-validation";
import {EmailMessage} from "../../../shared-models/email-message";
import {EmailService} from "../../../shared-module/services/email.service";
declare var Quill: any;

@Component({
               selector: 'my-event-invitations',
               templateUrl: './invitations.component.html',
               styles: [
                   `
                        .email-template{
                            padding: 1rem;
                            background-color: #f7f7f7;
                            border: 1px solid #d7d7d7;
                            margin-bottom:2rem;
                            margin-top:0rem;
                            position:relative;
                            padding-top:.5rem;
                        }
                        
                        .email-template.editing{
                            background-color:white;
                        }
                        
                        .email-template .round-icon{
                            position:absolute;
                            top:-15px;
                            right:-15px;
                        }
                        
                        .block-label{
                            display:block;
                            margin-bottom:7px;
                        }
                        
                        .ql-container{
                            height:auto;
                        }
                        
                        .ql-container.ql-snow{
                            border:0px;
                        }
                        
                        .ql-editor{
                            background-color:#f7f7f7;
                        }
                        
                    `
               ]

           })

export class MyEventInvitationsComponent implements OnInit, AfterViewInit
{
    emailSelectionMap: Map<string,any>;
    selectAll: boolean;
    inviteEmails$: FirebaseListObservable<any>;
    inviteEmails: InviteEmail[] = new Array<InviteEmail>();
    inviteTemplate$: FirebaseObjectObservable<any>;
    inviteTemplate: EmailInviteTemplate = new EmailInviteTemplate();
    messageQuill:any;
    editing:boolean = false;
    testEmail:string;

    subjectLine:string = "";
    replyEmail:string = "";

    fieldValidations:Map<string,FieldValidation>;
    validToSendMessage:boolean = true;

    constructor(private af: AngularFireDatabase,
                private modalService: NgbModal,
                public activeModal: NgbActiveModal,
                public appService: AppService,
                private toasty: ToastyService,
                private emailService:EmailService,
                public eventService: EventService)
    {
        this.emailSelectionMap = new Map<string,any>();
        this.selectAll = false;
        this.inviteEmails$ = this.eventService.getInviteEmails();



        if(this.appService.contactSet){
            this.replyEmail = this.appService.contact.email;
        }
        else{
            this.appService.contactEmitter.subscribe(()=>{
                this.replyEmail = this.appService.contact.email;
                console.log(this.appService.contact);
            });
        }

        this.inviteTemplate$ = this.eventService.getInviteEmailTemplate();
        this.initValidations();
    }

    ngOnInit()
    {
        this.loadInviteEmails();
        this.initValidations();
    }

    initValidations(){
        this.fieldValidations = new Map<string,FieldValidation>();
        this.fieldValidations.set("emails",new FieldValidation());
        this.fieldValidations.set("testEmail",new FieldValidation());
        this.fieldValidations.set("subject",new FieldValidation());
        this.fieldValidations.set("body",new FieldValidation());
    }

    ngAfterViewInit(){
        this.initializeReadOnly();
    }

    setDefaults(){

        let messageDelta = this.eventService.event.description;

        console.log(messageDelta);

        let endingString = `\nLooking forward to seeing you there,\n\n${this.appService.about.organizerName}\n`;

        let endingOp = {
            "insert" : endingString
        };

        if(typeof messageDelta['ops'] != "undefined"){
          messageDelta['ops'].push(endingOp);
        }
        else{
          messageDelta['ops'] = [endingOp];
        }



        this.inviteTemplate.subject = `You're invited to my event | ${this.eventService.event.title}`;

        this.inviteTemplate.messageDelta = messageDelta;
        this.messageQuill.setContents(this.inviteTemplate.messageDelta);
        this.inviteTemplate$.set(this.inviteTemplate);

    }


    loadInviteEmails()
    {
        this.inviteEmails$.subscribe((data) =>{
             this.inviteEmails = data;
             for (let inviteEmail of data) {
                 this.emailSelectionMap.set(inviteEmail.$key, {checked: false});
             }
         });
    }

    openAddEmailsModal()
    {
        this.activeModal.dismiss();
        this.modalService.open(AddEmailsModalComponent);
    }

    openUpdateEmailModal(key:string){
        this.activeModal.dismiss();
        this.eventService.selectedInviteEmailKey = key;
        this.modalService.open(UpdateEmailModalComponent);
    }

    selectAllToggle()
    {
        this.emailSelectionMap.forEach((entryVal, entryKey) =>{
           entryVal.checked = this.selectAll;
       });
    }

    removeSelectedEmails()
    {
        let keysToDelete = [];
        this.emailSelectionMap.forEach((entryVal, entryKey) =>{
           if (entryVal.checked) {
               keysToDelete.push(entryKey);
           }
        });

        for (let key of keysToDelete) {
            this.inviteEmails$.remove(key);

        }
    }

    editTemplate(){
        this.editing = true;
        this.initializeEdit();
    }

    initializeReadOnly(){
      this.messageQuill = new Quill('#template', {
        readOnly: true
      });

      this.inviteTemplate$.first().subscribe((template)=>{

        if(template.$exists()){
          this.inviteTemplate = template;
          this.messageQuill.setContents(this.inviteTemplate.messageDelta);
        }
        else{
          this.setDefaults();
        }


      });
    }

    initializeEdit(){

      let toolbarOptions = [
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],
        ['link']
      ];

      //INSTANTIATE BASED ON ID
      this.messageQuill = new Quill('#template', {
        modules: {
          toolbar: toolbarOptions
        },
        theme: 'snow'
      });

      console.log(this.messageQuill.root.innerHTML);


      this.inviteTemplate$.first().subscribe((template)=>{

        if(template.$exists()){
          this.inviteTemplate = template;
          this.messageQuill.setContents(this.inviteTemplate.messageDelta);
        }
        else{
          this.setDefaults();
        }

      });
    }


    sendInvitation(test:boolean = false):void{

        if(this.validSendMessage(test)) {
            let toList = "";
            for(let inviteEmail of this.inviteEmails){
                if(toList != ""){
                    toList += ",";
                }
                toList += inviteEmail.email;
            }
            let body = `
                    <table>
                    <tr>
                       <td width="75%">
                             ${this.messageQuill.root.innerHTML}
                       </td>
                       <td valign="top">
                            <a href="${this.eventService.shareLink}">
                                <strong> ${ this.eventService.event.title } </strong>
                            </a>
        
                            <a href="${this.eventService.shareLink}">
                                <img src="${this.eventService.event.imagePath}" style="width:100%;" />
                            </a>
        
                            <br /><br />
        
                            <a class="btn btn-primary btn-block" href="${this.eventService.shareLink}">
                                Join My Event!
                            </a>
                        </td>
                    </tr>    
                    </table>
                    `;
            let pendingMessage:EmailMessage = new EmailMessage();
            pendingMessage.subject = this.inviteTemplate.subject;
            pendingMessage.body = body;
            pendingMessage.from = this.replyEmail;
            pendingMessage.sendDateTime = moment().unix();
            if(!test){
                pendingMessage.toList  = toList;
            }
            else{
                pendingMessage.toList = this.testEmail;
            }
            console.log(pendingMessage);
            this.emailService.triggerPendingEmail(pendingMessage).then(()=>{
                this.toasty.success("InvitationSent Sent");
            }, (err)=>{
                this.toasty.error(err.message);
            })
            //this.pendingEmailMessages$.push(pendingMessage);
            //this.toasty.success("Invitation sent");
        }else{
            this.toasty.error("Error validating");
        }
    }

    validSendMessage(test):boolean{
        this.initValidations();
        this.validToSendMessage = true;
        if(!test){
            if(!this.inviteEmails || this.inviteEmails.length == 0) {
                this.fieldValidations.get("emails").valid=false;
                this.fieldValidations.get("emails").errorMessage="Please add emails";
                this.validToSendMessage = false;
            }
        }
        else{
            if(!this.testEmail || this.testEmail.length == 0){
                this.fieldValidations.get("testEmail").valid=false;
                this.fieldValidations.get("testEmail").errorMessage="Please enter valid email address";
                this.validToSendMessage = false;
            }
        }

        if(FieldValidation.isEmptyText(this.inviteTemplate.subject)){
            this.fieldValidations.get("subject").valid = false;
            this.fieldValidations.get("subject").errorMessage="Subject is required";
            this.validToSendMessage = false;
        }
        return this.validToSendMessage;
    }

    saveTemplate(){
      this.initializeReadOnly();
      this.editing = false;
      let contents = this.messageQuill.getContents();
      this.inviteTemplate$.update({messageDelta:contents}).then(()=>{
        this.toasty.success("Template Saved!");
      });
    }

    cancelTemplate(){
      this.initializeReadOnly();
      this.editing = false;
      this.messageQuill.setContents(this.inviteTemplate.messageDelta);
    }

}
