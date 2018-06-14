import {CommonModule} from '@angular/common';
import {NgModule, ModuleWithProviders} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {AgmCoreModule} from "@agm/core";

import {RlTagInputModule} from "angular2-tag-input/";
import {NgbDatepickerModule, NgbTimepickerModule, NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {HttpModule} from "@angular/http";
import {ODatePipe} from "./pipes/date.pipe";
import {OTimePipe} from "./pipes/time.pipe";
import {CreateComponent} from "./components/create.component";
import {CreateEventService} from "./services/create-event.service";
import {EditComponent} from "./components/edit/edit.component";
import {PreviewComponent} from "./components/preview/preview.component";
import {AdvancedComponent} from "./components/advanced/advanced.component";
import {EditTitleComponent} from "./components/edit/_title.component";
import {EditDateComponent} from "./components/edit/_date.component";
import {EditTypeComponent} from "./components/edit/_event-type.component";
import {GoogleLocationComponent} from "./components/edit/_google-location.component";
import {CreateEventDateService} from "./services/create-date.service";
import {EditImageComponent} from "./components/edit/_event-image.component";
import {EditDescriptionComponent} from "./components/edit/_description.component";
import {EditSettingsComponent} from "./components/edit/_event-settings.component";
import {CreateTicketsService} from "./services/create-tickets.service";
import {EditTicketsComponent} from "./components/edit/tickets/tickets.component";
import {SingleTicketComponent} from "./components/edit/tickets/single-ticket.component";
import {SharedModule} from "../shared-module/shared.module";
import {EditControlsComponent} from "./components/edit/_controls.component";
import {PreviewService} from "./services/preview.service";
import {EventModule} from "../event/event.module";
import {AdvancedNavComponent} from "./components/advanced/advanced-nav.component";
import {AdvancedCompletionComponent} from "./components/advanced/views/completion.component";
import {AdvancedConfirmationComponent} from "./components/advanced/views/confirmation.component";
import {AdvancedEmailComponent} from "./components/advanced/views/email.component";
import {AdvancedFieldsComponent} from "./components/advanced/views/fields.component";
import {AdvancedPromoterComponent} from "./components/advanced/views/promoter.component";
import {AdvancedRegistrantComponent} from "./components/advanced/views/registrant.component";
import {AdvancedReminderComponent} from "./components/advanced/views/reminder.component";
import {UiSwitchModule} from "ngx-ui-switch/src";
import {CreateAdvancedService} from "./components/advanced/services/advanced.service";
import {ImageCropperModule, ImageCropperComponent} from "ng2-img-cropper";
import {EventMapComponent} from "./components/edit/modal/event-map.component";
import {CropModalComponent} from "../shared-module/components/crop-modal/crop-modal.component";
import {AuthGuard} from "../auth/guards/auth-guard";
import {createRouting} from "./create.routing";

@NgModule({
              declarations: [
                  CreateComponent,
                  EditComponent,
                  EditDateComponent,
                  EditTitleComponent,
                  EditTypeComponent,
                  EditImageComponent,
                  EditDescriptionComponent,
                  EditSettingsComponent,
                  EditTicketsComponent,
                  EditControlsComponent,
                  SingleTicketComponent,
                  PreviewComponent,
                  AdvancedComponent,
                  GoogleLocationComponent,
                  ODatePipe,
                  OTimePipe,
                  AdvancedNavComponent,
                  AdvancedCompletionComponent,
                  AdvancedConfirmationComponent,
                  AdvancedEmailComponent,
                  AdvancedFieldsComponent,
                  AdvancedPromoterComponent,
                  AdvancedRegistrantComponent,
                  AdvancedReminderComponent,
                  EventMapComponent,
              ],
              entryComponents: [
                  EventMapComponent,
              ],
              imports: [
                  CommonModule,
                  FormsModule,
                  createRouting,
                  AgmCoreModule.forRoot({apiKey: 'AIzaSyDz9UIddlXqbhsG1K2wz22MsxqkPNWfQJ8'}),
                  RlTagInputModule,
                  NgbDatepickerModule,
                  NgbTimepickerModule,
                  NgbTooltipModule,
                  HttpModule,
                  SharedModule,
                  EventModule,
                  UiSwitchModule,
                  ImageCropperModule
              ],
              providers: [
                  CreateEventService,
                  CreateEventDateService,
                  CreateTicketsService,
                  CreateAdvancedService,
                  PreviewService
              ],
              exports: [
                  AdvancedFieldsComponent,
                  AdvancedConfirmationComponent,
                  AdvancedEmailComponent
              ]
          })

export class CreateModule
{
}
