import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {BookmarkService} from "../shared-module/services/bookmark.service";
import {BookmarkComponent} from "./components/bookmarks.component";
import {SharedModule} from "../shared-module/shared.module";
import {AuthGuard} from "../auth/guards/auth-guard";

const routes: Routes = [
    {path: '', component: BookmarkComponent, canActivate: [AuthGuard]}
];

@NgModule({

    declarations: [
        BookmarkComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    providers: [

    ]

})

export class BookmarkModule {}
