import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddBookComponent } from './components/add-book/add-book.component';
import { AddEventComponent } from './components/add-event/add-event.component';
import { BookListComponent } from './components/book-list/book-list.component';
import { EditBookComponent } from './components/edit-book/edit-book.component';
import { EditEventComponent } from './components/edit-event/edit-event.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { UserListComponent } from './components/user-list/user-list.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'add-book' },
  { path: 'add-book', component: AddBookComponent },
  { path: 'edit-book/:id', component: EditBookComponent },
  { path: 'books-list', component: BookListComponent },
  { path:'add-event',component:AddEventComponent},
  { path:'edit-event/:id',component:EditEventComponent},
  { path:'event-list',component:EventListComponent},
  { path:'user-list',component:UserListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }