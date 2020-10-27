import { Component, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { EventService } from './../../shared/event.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { finalize } from "rxjs/operators";


export interface Language {
  name: string;
}

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {
  imgSrc: string='/assets/img/image_placeholder.jpg'
  selectedImage: any = null;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  languageArray: Language[] = [];
  @ViewChild('chipList') chipList;
  @ViewChild('resetBookForm') myNgForm;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedBindingType: string;
  bookForm: FormGroup;

  ngOnInit() { 
    this.bookApi.GetEventList();
    this.submitBookForm();
  }

  showPreview(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
    }
    else {
      this.imgSrc = '/assets/img/image_placeholder.jpg';
      this.selectedImage = null;
    }
  }

  constructor(
    public fb: FormBuilder,
    private bookApi: EventService,
    private storage: AngularFireStorage,
  ) { }



  /* Reactive book form */
  submitBookForm() {
    this.bookForm = this.fb.group({
      etitle: ['', [Validators.required]],
      edate: ['', [Validators.required]],
      etime: ['', [Validators.required]],
      eimage:['',[Validators.required]],
      edesc: ['', [Validators.required]],
    })
  }

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.bookForm.controls[controlName].hasError(errorName);
  }

  
  /* Date */
  formatDate(e) {
    var convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    this.bookForm.get('edate').setValue(convertDate, {
      onlyself: true
    })
  }

  /* Reset form */
  resetForm() {
    this.imgSrc='/assets/img/image_placeholder.jpg';
    this.languageArray = [];
    this.bookForm.reset();
    Object.keys(this.bookForm.controls).forEach(key => {
      this.bookForm.controls[key].setErrors(null)
    });
  }

  /* Submit book */
  submitBook(formValue) {
    if (this.bookForm.valid){
      var filePath=`events/${this.selectedImage.name}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath,this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            formValue['eimage'] = url;
            this.bookApi.AddEvent(formValue);       
          })
        })
      ).subscribe();
       this.resetForm();
    }
  }

  get formControls() {
    return this.bookForm['controls'];
  }

}
