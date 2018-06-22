import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';


@Component({
  selector: 'app-fl-sign-in',
  styleUrls: [
    './sign-in.scss'
  ],
  templateUrl: './sign-in.html',
})

export class SignInComponent {
  constructor(private auth: AuthService, private router: Router) { }

  private postSignIn(): void {
    this.router.navigate(['/dashboard']);
  }
}
