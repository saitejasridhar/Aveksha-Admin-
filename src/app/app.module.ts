import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';


import { AppComponent } from './app.component';
import { AddBookComponent } from './components/add-book/add-book.component';
import { EditBookComponent } from './components/edit-book/edit-book.component';
import { BookListComponent } from './components/book-list/book-list.component';
import {MatProgressSpinnerModule} from '@angular/material';

const Materialcomponents=[
  MatProgressSpinnerModule
]

/* Angular material */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './material.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

/* Firebase */
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from "@angular/fire/storage";
import { environment } from 'src/environments/environment';
import {AngularFirestoreModule} from '@angular/fire/firestore'

/* Angular CRUD services */
import { AudtionService } from './shared/audtion.service';

/* Reactive form services in Angular 7 */
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from './spinner/spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    AddBookComponent,
    EditBookComponent,
    BookListComponent,
    SpinnerComponent,
    
  ],
  imports: [
    RichTextEditorAllModule,
      BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireStorageModule,
    AngularFirestoreModule

  ],
  providers: [AudtionService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
