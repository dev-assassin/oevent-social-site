import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';


@Component({
  selector: 'fl-sign-in',
  styleUrls: [
    './sign-in.scss'
  ],
  template: `
    <div class="container">
      <div class="row">
          <div class="col-md-8 offset-md-2">
            <div class="card z-depth-4">
              <div class="card-header text-center">Sign in</div>
              <div class="card-block">
                <div class="text-center">
                  <button class="btn btn-primary btn-branded z-depth-1" (click)="signInWithGoogle()" type="button">
                      <span class="fa fa-google-plus-square"></span> 
                      <span>Google</span>
                  </button>
                </div>
                <div class="text-center">
                  <button class="btn btn-primary btn-branded z-depth-1" (click)="signInWithTwitter()" type="button">
                      <span class="fa fa-twitter"></span> 
                      <span>Twitter</span>
                  </button>
                </div>
                <div class="text-center">
                  <button class="btn btn-primary btn-branded z-depth-1" (click)="signInWithFacebook()" type="button">
                      <span class="fa fa-facebook-square"></span>
                      <span>Facebook</span>
                  </button>
                </div>
              </div>
              
            </div>
          </div>
          
          <div class="col-md-8 offset-md-2" style="margin-top:1.25rem">
            <div class="card z-depth-3"> 
                <div class="card-block" styl>
                     
                    <div class="marketing-line"> 
                        <img src="../../assets/images/mark-bw.svg" width="17" height="17" /> 
                        Keep a pulse on your audience
                    </div>    
                    <div class="marketing-line">
                        <img src="../../assets/images/mark-bw.svg" width="17" height="17"  />
                        Engage users
                    </div>
                    
                    <div class="marketing-line">
                        <img src="../../assets/images/mark-bw.svg" width="17" height="17"  />
                        Answer questions after the session
                    </div>
                    
                </div>
            </div>
          </div>
          
      </div>
    </div>
  `
})

export class SignInComponent {
  constructor(private auth: AuthService, private router: Router) {}

  private postSignIn(): void {
    this.router.navigate(['/dashboard']);
  }
}
