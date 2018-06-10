import { Component, AfterContentInit, OnInit, Input, ViewChild } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized, ActivatedRoute, Params } from '@angular/router';
import { AppService } from '../../../services/app-service';
import { AuthService } from '../../../auth/services/auth-service';
import { ToastyService } from 'ng2-toasty';
import { CreateEventService } from '../../services/create-event.service';
import { ImageCropper, CropperSettings, ImageCropperComponent } from 'ng2-img-cropper';
import { CropModalComponent } from '../../../shared-module/components/crop-modal/crop-modal.component';
import { ImageCropService } from '../../../shared-module/services/image-crop.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-event-image',

    template: this.newMethod(),
    styles: [
        `
            :host{
                display:block;
            }
        `
    ]

})

export class EditImageComponent implements OnInit {

    @ViewChild('cropper', undefined)
    cropper: ImageCropperComponent;
    imageSet: Boolean = false;
    imageURL: String = '';
    imageUploaded: Boolean = false;
    cropperSettings: CropperSettings;

    constructor(private auth: AuthService,
        private appService: AppService,
        private toasty: ToastyService,
        private modalService: NgbModal,
        private imageCropService: ImageCropService,
        private createService: CreateEventService, ) {



    }

    private newMethod(): string {
        return `

        <!-- npm install ng2-file-upload --save  NEED TO TRY THIS NEXT -->

        <label>Event Image</label>
        <div class="form-group row">
            <div class="col-md-3">
                <div>
                    <span class="btn btn-primary btn-lg btn-file margin-vertical">
                        Upload Photo <i class="fa fa-camera"></i> <input (change)="fileChangeListener($event)" type="file">
                    </span>
                    <br />
                    <div *ngIf="!createService.isFieldValid('image')" class="validation-error-text">
                        {{createService.fieldValidations.get("image").errorMessage}}
                    </div>
                </div>
            </div>
            <div class="col-md-9">
                <div style="min-height:50px;margin-top:15px;">
                    <img [src]="imageURL" class="img-fluid" *ngIf="imageSet">
                </div>
            </div>
        </div>
        <br /><br />
    `;
    }

    fileChangeListener($event) {

        const file: File = $event.target.files[0];
        this.imageCropService.file = file;
        this.imageCropService.setPorportions(273, 175);
        this.modalService.open(CropModalComponent);
        // tslint:disable-next-line:no-shadowed-variable
        this.imageCropService.triggerUpload.first().subscribe((file: any) => {
            this.uploadFileDirect(file);
        });

    }

    ngOnInit() {
        this.getImage();
    }

    // -----------------------------------------------------------------------------------------------------------------------
    // HANDLE MAIN FILE UPLOAD AND SET IMAGESET PROPERTY TO TRUE AFTER UPLOAD
    // -----------------------------------------------------------------------------------------------------------------------
    uploadFile(event) {

        const $this = this;
        let longEnough = false;
        const path = `eventImage/${this.createService.eventId}`;

        this.appService.startLoadingBar();
        setTimeout(() => { longEnough = true; }, 700);

        this.auth.uploadFile(event, path).subscribe((data) => {

            $this.createService.draft.imagePath = $this.imageURL = data.downloadURL;
            $this.createService.draftObject$.update({ imagePath: data.downloadURL });
            $this.imageSet = true;
            $this.toasty.success({
                title: 'Image uploaded and saved',
                msg: 'Image uploaded and saved successfully!'
            });

            $this.appService.updateProfile();

            if (longEnough) {
                $this.appService.stopLoadingBar();
            } else {
                setTimeout(() => { $this.appService.stopLoadingBar(); }, 500);
            }
        });
    }

    uploadFileDirect(file) {
        const $this = this;
        let longEnough = false;
        const path = `eventImage/${this.createService.eventId}`;

        this.appService.startLoadingBar();
        setTimeout(() => { longEnough = true; }, 700);

        this.auth.uploadFileDirect(file, path).subscribe((data) => {

            $this.createService.draft.imagePath = $this.imageURL = data.downloadURL;
            $this.createService.draftObject$.update({ imagePath: data.downloadURL });
            $this.imageSet = true;
            $this.toasty.success({
                title: 'Image uploaded and saved',
                msg: 'Image uploaded and saved successfully!'
            });
            if ($this.createService.isLive()) {
                $this.createService.publish();
            }

            $this.appService.updateProfile();

            if (longEnough) {
                $this.appService.stopLoadingBar();
            } else {
                setTimeout(() => { $this.appService.stopLoadingBar(); }, 500);
            }
        });
    }

    // -----------------------------------------------------------------------------------------------------------------------
    // GET IMAGE PATH
    // -----------------------------------------------------------------------------------------------------------------------
    getImage() {

        const path = `eventImage/${this.createService.eventId}`;
        this.auth.getFile(path).then((success) => {
            this.imageURL = success;
            this.imageSet = true;
        }, (error) => {
            // BASICALLY NO IMAGE UPLOADED SO DO NOTHING
        });
    }
}
