import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { IContact } from '../model/i-contact';
import { ContactService } from '../service/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {

  title =  'New Contact';
  contact: IContact = {name:'', email:'', phone:''};

  constructor(
    private activatedRoute: ActivatedRoute,
    private contactService: ContactService,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    if(this.activatedRoute.snapshot.paramMap.get('item') !== null) {
      this.title = 'Update Contact';
      this.contact = JSON.parse(this.activatedRoute.snapshot.paramMap.get('item')) as IContact;
    }
  }

  saveContact() {
    if(this.contact.id !== undefined) {
      this.contactService.updateContact(this.contact).then(() => {
        this.toast('Updated contact!');
        this.returnToContacts();
      });
    } else {
      this.contactService.insertContact(this.contact).then(() => {
        this.toast('Created new contact!');
        this.returnToContacts();
      });
    }
  }

  returnToContacts() {
    this.router.navigate(['contacts']);
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
