import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Contact } from '../model/contact';
import { ContactService } from '../service/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {

  title =  'New Contact';
  contact: Contact = {name:'', email:'', phone:''};

  constructor(
    private activatedRoute: ActivatedRoute,
    private contactService: ContactService,
    private toastController: ToastController,
    private router: Router
  ) {

    if(this.activatedRoute.snapshot.paramMap.get('item') !== null) {
      this.title = 'Update Contact';
      this.contact = JSON.parse(this.activatedRoute.snapshot.paramMap.get('item')) as Contact;
    }

  }

  ngOnInit() {

  }

  async toast(mensagem: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  saveContact() {
    if(this.contact.id !== undefined) {
      this.contactService.updateContact(this.contact).then(() => {
        this.toast('Updated contact!');
        this.returnToContacts();
      });
    } else {
      this.contactService.insertContact(this.contact).then(() => {
        this.toast('New contact created!');
        this.returnToContacts();
      });
    }
  }

  returnToContacts() {
    this.router.navigate(['/contacts']);
  }

}
