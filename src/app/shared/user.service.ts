import { Injectable } from '@angular/core';
import { User } from './user';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  booksRef: AngularFireList<any>;
  bookRef: AngularFireObject<any>;

  constructor(private db: AngularFireDatabase) {}

  /* Create book */
  AddEvent(event: User) {
    this.booksRef.push({
     desc: event.desc,
     image:event.image
    })
    .catch(error => {
      this.errorMgmt(error);
    })
  }

  /* Get book */
  GetUser(id: string) {
    this.bookRef = this.db.object('Users/' + id);
    return this.bookRef;
  }  

  /* Get book list */
  GetUserList() {
    this.booksRef = this.db.list('Users');
    return this.booksRef;
  }

  /* Update book */
  UpdateUser(id, event: User) {
    this.bookRef.update({
        desc: event.desc,
        image:event.image
    })
    .catch(error => {
      this.errorMgmt(error);
    })
  }

  /* Delete book */
  DeleteUser(id: string) {
    this.bookRef = this.db.object('Users/' + id);
    this.bookRef.remove()
    .catch(error => {
      this.errorMgmt(error);
    })
  }

  // Error management
  private errorMgmt(error) {
    console.log(error)
  }
}