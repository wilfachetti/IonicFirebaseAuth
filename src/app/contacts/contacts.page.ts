import { Component, OnInit } from '@angular/core';
import { ContactService } from '../service/contact.service';
import 'hammerjs';
import { Observable } from 'rxjs';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { IContact } from '../model/i-contact';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {

  items: Observable<IContact[]>;

  constructor(
    private contactService: ContactService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {
  }

  ngOnInit() {
    this.items = this.contactService.readContacts();
  }

  ionViewWillEnter() {
    this.presentLoading();
  }

  ionViewDidEnter() {
    this.dismissLoading();
  }

  ionViewWillLeave() {
    //this.dismissLoading();
  }

  create(contact: IContact){
    this.contactService.insertContact(contact);
  }

  update(contact: IContact) {
    this.router.navigate(['contact', {item: JSON.stringify(contact)}]);
  }

  delete(id) {
    this.contactService.deleteContact(id).then(() => {
      this.toast('Excludec contact!');
    });
  }

  async showAlert(item: IContact) {
    const alert = await this.alertController.create({
      message: 'Select: ',
      buttons: [
        {
          text: 'Delete',
          handler: () => this.delete(item.id),
        },
        {
          text: 'Edit',
          handler: () => this.update(item),
        }
      ]
    });

    alert.present();
  }

  toast(showMessage: string) {
    this.toastController.create({
      message: showMessage,
      duration: 2000,
      position: 'middle'
    }).then((toast) => {
      toast.present();
    });
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();
  }

  dismissLoading() {
    return this.loadingController.dismiss();
  }

}
