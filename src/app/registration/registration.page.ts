import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})

export class RegistrationPage implements OnInit {

  constructor(
    public authenticationService: AuthenticationService,
    public router: Router
  ) { }

  ngOnInit(){}

  signUp(email, password){
    this.authenticationService.registerUser(email.value, password.value).then((res) => {
      this.authenticationService.sendVerificationMail();
      this.router.navigate(['verify-email']);
    }).catch((error) => {
      window.alert(error.message);
    });
  }
}
