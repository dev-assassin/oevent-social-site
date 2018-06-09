import {Component, AfterContentInit, OnInit, Input} from '@angular/core';
import {Router, NavigationEnd, RoutesRecognized, ActivatedRoute, Params} from '@angular/router';
import {AppService} from "../../../services/app-service";
import {AuthService} from "../../../auth/services/auth-service";
import {ToastyService} from "ng2-toasty";
import {CreateEventService} from "../../services/create-event.service";

//ADD QUILL FOR TYPING
declare var Quill:any;

@Component({
    selector: 'event-description',

    template: `

        <label>Description</label>   
        <div id="toolbar"></div>
        <div id="editor" style="min-height: 230px;"></div>        
    `,
    styles: [
        `
            :host{
                display:block;
            }  
        `
    ],

})

export class EditDescriptionComponent implements OnInit, AfterContentInit{

    //KEEP TRACK OF WYSIWYG OBJECT
    quill:any;
    description:any;
    descriptionText:string = "";

    constructor(private auth: AuthService,
                private appService: AppService,
                private router: Router,
                private route: ActivatedRoute,
                private toasty: ToastyService,
                private createService: CreateEventService, ) {

    }

    ngOnInit(){

    }

    // -----------------------------------------------------------------------------------------------------------------------
    // USING QUILL WHICH NEEDS TO ATTACH TO AN ELEMENT SO WAIT UNTIL AFTER CONTENT LOADED (TODO PROPER QUILL ANGULAR2 COMPONENT)
    // -----------------------------------------------------------------------------------------------------------------------
    ngAfterContentInit(){

        //TODO DECIDE WHETHER TO KEEP IMAGES HERE
        let toolbarOptions = [
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],
            ['link']
        ];

        //INSTANTIATE BASED ON ID
        this.quill = new Quill('#editor', {
            modules: {
                toolbar: toolbarOptions
            },
            theme: 'snow'
        });

        let $this = this;

        this.quill.on('selection-change', function(range, oldRange, source) {
            if (range) {

            } else {
                $this.editorBlur();
            }
        });

        this.initContent();

    }

    initContent(){
        this.createService.draftObject$.first().subscribe((data)=>{
            this.quill.setContents(data.description);
            this.descriptionText = data.descriptionText;
        });
    }

    saveContent(){

        this.descriptionText = this.quill.container.innerText;

        if(this.descriptionText.length){
            this.description = this.quill.getContents();

            this.createService.draftObject$.update({
                                                           descriptionText: this.descriptionText,
                                                           description: this.description
                                                       }).then(()=>
                                                               {
                                                                   this.createService.showSavedDraft();
                                                               });

            if(this.createService.isLive()){
                this.createService.publish();
            }
        }

    }

    editorBlur(){
        this.saveContent();
    }

}