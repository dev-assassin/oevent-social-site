import {Component, OnInit} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {EventService} from "../../../services/event-service";
import {InviteEmail} from "../../../models/invite-email";
import {FirebaseListObservable} from "angularfire2/database/firebase_list_observable";
import * as Papa from 'papaparse/papaparse.min.js';

@Component({
               selector: 'invitation-emails',
               styles: [
               ],
               templateUrl: './add-emails-modal.html'
           })

export class AddEmailsModalComponent implements OnInit
{

    addOption:string;
    emails:string;
    inviteEmails$:FirebaseListObservable<any>;
    inviteEmails:InviteEmail[];

    constructor(public activeModal: NgbActiveModal,
                public eventService: EventService
    )
    {
        this.addOption = "manual";
        if(eventService.set){
            this.setInvite();
        }
        else{
            this.eventService.eventUpdated.first().subscribe(()=>{
                this.setInvite();
            });
        }


    }

    ngOnInit(): void
    {

    }

    setInvite(){
        if(this.eventService.inviteKey != "promoter"){
            this.inviteEmails$ = this.eventService.getInviteEmails();
        }
        else{
            this.inviteEmails$ = this.eventService.getPromoterInviteEmails();
        }
    }

    addEmails(){
        if(this.addOption == "manual") {
            let lines = this.emails.split("\n");
            let uniqueEmails = new Set<string>();
            for (let line of lines) {
                let lineEmails = line.split(",");
                for (let email of lineEmails) {
                    uniqueEmails.add(email.trim().toLowerCase());
            }
            }
            uniqueEmails.forEach((email) =>
                                 {
                                     let inviteEmail: InviteEmail = new InviteEmail();
                                     inviteEmail.email = email;
                                     this.inviteEmails$.push(inviteEmail);
                                 });
        }else if(this.addOption == "from_file"){
            for(let inviteEmail of this.inviteEmails){
                this.inviteEmails$.push(inviteEmail);
            }
        }
        this.activeModal.dismiss();
    }

    fileChangeListener($event):void {
        this.uploadAction($event.target);
    }

    uploadAction(inputValue:any):void {
        var file:File = inputValue.files[0];
        let localArr = [];
        Papa.parse(file, {
            complete: function(results) {
                let firstRow = true;
                for(var row of results.data){
                    if(!firstRow) {
                        let inviteEmail: InviteEmail = new InviteEmail();
                        inviteEmail.email = row[0];
                        inviteEmail.firstName = row[1];
                        inviteEmail.lastName = row[2];
                        localArr.push(inviteEmail);
                    }else{
                        firstRow = false;
                    }

                }
            }
        });
        this.inviteEmails = localArr;
    }

}
