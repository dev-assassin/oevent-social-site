import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SignInComponent } from './components/sign-in';
import { AuthGuard } from './guards/auth-guard';
import { UnauthGuard } from './guards/unauth-guard';
import { AuthService } from './services/auth-service';


@NgModule({
  declarations: [
    SignInComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    AuthGuard,
    AuthService,
    UnauthGuard
  ]
})

export class AuthModule { }
export { AuthGuard };
export { AuthService };
export { UnauthGuard };
export { SignInComponent };
