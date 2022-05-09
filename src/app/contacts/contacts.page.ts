import { Component, OnInit } from '@angular/core';
import { ContactService } from '../service/contact.service';
import 'hammerjs';
import { Observable } from 'rxjs';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { IContact } from '../model/i-contact';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {

  items: Observable<IContact[]>;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.items = this.contactService.readContacts();
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

  async toast(showMessage: string) {
    const toast = await this.toastController.create({
      message: showMessage,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }
}
