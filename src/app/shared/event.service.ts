import { Injectable } from '@angular/core';
import { Event } from './event';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})

export class EventService {
  booksRef: AngularFireList<any>;
  bookRef: AngularFireObject<any>;

  constructor(private db: AngularFireDatabase) {}

  /* Create book */
  AddEvent(event: Event) {
    this.booksRef.push({
     etitle: event.etitle,
     edesc: event.edesc,
     etime: event.etime,
     edate:event.edate,
     eimage:event.eimage
    })
    .catch(error => {
      this.errorMgmt(error);
    })
  }

  /* Get book */
  GetEvent(id: string) {
    this.bookRef = this.db.object('Events/' + id);
    return this.bookRef;
  }  

  /* Get book list */
  GetEventList() {
    this.booksRef = this.db.list('Events');
    return this.booksRef;
  }

  /* Update book */
  UpdateEvent(id, event: Event) {
    this.bookRef.update({
        etitle: event.etitle,
        edesc: event.edesc,
        etime: event.etime,
        edate:event.edate,
        eimage:event.eimage
    })
    .catch(error => {
      this.errorMgmt(error);
    })
  }

  /* Delete book */
  DeleteEvent(id: string) {
    this.bookRef = this.db.object('Events/' + id);
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