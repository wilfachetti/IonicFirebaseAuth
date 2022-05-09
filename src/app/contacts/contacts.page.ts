import { Component, OnInit } from '@angular/core';
import { Contact } from '../model/contact';
import { ContactService } from '../service/contact.service';
import 'hammerjs';
import { Observable } from 'rxjs';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {

  items: Observable<Contact[]>;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.items = this.contactService.readContacts();
  }

  ionViewDidEnter() {
  }

  create(contact: Contact){
    this.contactService.insertContact(contact);
  }

  update(contact) {
    this.router.navigate(['contact', {item: JSON.stringify(contact)}]);
    //this.contactService.updateContact(contact);
  }

  delete(id) {
    this.contactService.deleteContact(id).then(() => {
      this.toast('Excludec contact!');
    });
  }

  async apresentaAlerta(item: Contact) {
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

  async toast(mensagem: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }
}
