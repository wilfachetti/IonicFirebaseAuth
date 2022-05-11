import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthenticationService } from '../service/authentication.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private authenticationService: AuthenticationService) {
  }

  checkLoggedIn() {
    if(this.authenticationService.isLoggedIn) {
      //this.presentLoading();
      this.router.navigate(['contacts']);
    } else {
      this.router.navigate(['login']);
    }
  }
}
