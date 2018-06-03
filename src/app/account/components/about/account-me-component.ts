import {Component, ViewChild} from '@angular/core';
import {AuthService} from "../../../auth/services/auth-service";
import {ToastyService} from "ng2-toasty/index";
import {AppService} from "../../../services/app-service";
import {AccountMeService} from "../../../shared-module/services/account-me-service";
import {IAccountAbout, AccountAbout} from "./about-model";
import {ImageCropper, CropperSettings, ImageCropperComponent} from "ng2-img-cropper";
import {FirebaseObjectObservable} from "angularfire2/database/firebase_object_observable";
import {AngularFireDatabase} from "angularfire2/database/database";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CropModalComponent} from "../../../shared-module/components/crop-modal/crop-modal.component";
import {ImageCropService} from "../../../shared-module/services/image-crop.service";

@Component({
    selector: 'account-about-me',
    styles: [

    ],
    templateUrl: './about-me.html'
})

export class AccountMeComponent {

    upload:string;
    file:string;
    imageSet:boolean = false;
    progress: number = 0;
    values: IAccountAbout = new AccountAbout();

    public about$: FirebaseObjectObservable<IAccountAbout>;

    constructor(public auth: AuthService,
                public toasty: ToastyService,
                private af: AngularFireDatabase,
                private imageCropService: ImageCropService,
                private modalService: NgbModal,
                public appService: AppService){

        this.getProfile();

        this.appService.startLoadingBar();

        if(this.auth.authenticated){
            this.populate();
        }
        else{
            this.auth.authObservable.first().subscribe(()=>{
                this.populate();
            })
        }

    }

    populate(){
        this.about$ = this.af.object(`/about/${this.auth.id}`);
        this.about$.subscribe((values)=>{
            this.values = values;
            this.appService.stopLoadingBar();
        });
    }

    onSubmit(values:any){

        values.imageSet = this.imageSet;
        values.imageURL = this.file;
        this.updateAbout(values);

    }

    updateAbout(values:IAccountAbout){
        try {

            this.appService.startLoadingBar();
            this.about$.update(values).then(()=>{
                let toast = {
                    title: "Success",
                    msg: "Your contact information has saved successfully!"
                };

                this.appService.completeLoadingBar();
                this.toasty.success(toast);
            }, (err)=>{

                let toast = {
                    title: "Failed",
                    msg: `Your contact information was not saved: ${err}`
                };
                this.appService.completeLoadingBar();
                this.toasty.error(toast);

            });

        }
        catch(err){
            let toast = {
                title: "Failed",
                msg: `Your contact information was not saved: ${err}`
            };
            this.appService.completeLoadingBar();
            this.toasty.error(toast);
        }
    }

    uploadFile(event){

        let $this = this;
        let longEnough = false;

        this.appService.startLoadingBar();
        setTimeout(()=>{ longEnough = true }, 700);

        this.auth.uploadFile(event, "profile").subscribe((data)=>{
            $this.file = data.downloadURL;
            $this.imageSet = true;
            $this.values.imageSet = true;
            $this.toasty.success({
                title: "Image uploaded",
                msg: "Image uploaded successfully!"
            });
            $this.appService.updateProfile();

            if(longEnough){
                $this.appService.stopLoadingBar()
            } else{
                setTimeout(()=>{ $this.appService.stopLoadingBar() }, 500);
            }
        });
    }

    fileChangeListener($event) {

        let file:File = $event.target.files[0];
        this.imageCropService.file = file;
        this.imageCropService.setPorportions(280, 280);

        setTimeout(()=>{this.modalService.open(CropModalComponent)}, 100);

        this.imageCropService.triggerUpload.first().subscribe((file)=>{
            this.uploadFileDirect(file);
        })

    }

    uploadFileDirect(data){

        let path = `profile`;

        this.appService.startLoadingBar();
        setTimeout(()=>{ longEnough = true }, 700);
        let $this = this;
        let longEnough = false;

        this.appService.startLoadingBar();
        setTimeout(()=>{ longEnough = true }, 700);

        this.auth.uploadFileDirect(data, path).subscribe((data)=>{
            $this.file = data.downloadURL;
            $this.imageSet = true;
            $this.values.imageSet = true;
            $this.toasty.success({
                title: "Image uploaded",
                msg: "Image uploaded successfully!"
            });
            $this.appService.updateProfile();

            if(longEnough){
                $this.appService.stopLoadingBar()
            } else{
                setTimeout(()=>{ $this.appService.stopLoadingBar() }, 500);
            }
        });
    }

    getProfile(){
        this.auth.getFile("profile").then((success)=>{
            this.file = success;
            this.imageSet = true;
        }, (error)=>{
            this.toasty.error({
                title: "Error Retrieving Profile Image",
                msg: `Error retrieving image: ${error}`
            });
        })
    }

}
