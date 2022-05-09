import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Contact } from 'src/app/model/contact';

@Injectable({
  providedIn: 'root'
})

export class ContactService {
  collectionName = 'contacts/';
  collection: any;

  constructor(private db: AngularFirestore) {}

  readContacts() {
    this.collection = this.db.collection(this.collectionName)
      .valueChanges({ idField: 'id' , name: 'name', email: 'email', phone:'phone' }) as Observable<Contact[]>;

    return this.collection;
  }

  insertContact(contact: Contact){
    return this.db.collection(this.collectionName).add(contact);
  }

  updateContact(contact: Contact){
    return this.db.doc(this.collectionName + contact.id).update({
      name: contact.name,
      email: contact.email,
      phone: contact.phone
    });
  }

  deleteContact(contactId: string){
    return this.db.doc(this.collectionName + contactId).delete();
  }

}
