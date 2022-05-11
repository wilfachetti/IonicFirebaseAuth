import { LoadingController } from '@ionic/angular';
import { AuthenticationService } from './authentication.service';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { IContact } from '../model/i-contact';

@Injectable({
  providedIn: 'root'
})

export class ContactService {
  userUid: any;
  collectionName: any;
  collection: any;

  constructor(
    private angularFirestore: AngularFirestore,
    private authenticationService: AuthenticationService,
    private loadingController: LoadingController
  ) {
    this.userUid = authenticationService.userData.uid;
    this.collectionName = 'users/' + this.userUid + '/contacts/';
  }

  readContacts() {
    this.collection = this.angularFirestore.collection(this.collectionName)
      .valueChanges({ idField: 'id' , name: 'name', email: 'email', phone:'phone' }) as Observable<IContact[]>;

    return this.collection;
  }

  insertContact(contact: IContact){
    return this.angularFirestore.collection(this.collectionName).add(contact);
  }

  updateContact(contact: IContact){
    return this.angularFirestore.doc(this.collectionName + contact.id).update({
      name: contact.name,
      email: contact.email,
      phone: contact.phone
    });
  }

  deleteContact(contactId: string){
    return this.angularFirestore.doc(this.collectionName + contactId).delete();
  }

}
