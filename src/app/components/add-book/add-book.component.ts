import { Component, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { AudtionService } from './../../shared/audtion.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { finalize } from "rxjs/operators";


export interface Language {
  name: string;
}

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit {
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
    this.bookApi.GetAudtionList();
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
    private bookApi: AudtionService,
    private storage: AngularFireStorage,
  ) { }



  /* Reactive book form */
  submitBookForm() {
    this.bookForm = this.fb.group({
      atitle: ['', [Validators.required]],
      adate: ['', [Validators.required]],
      atime: ['', [Validators.required]],
      aimage:['',[Validators.required]],
      adesc: ['', [Validators.required]],
    })
  }

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.bookForm.controls[controlName].hasError(errorName);
  }

  
  /* Date */
  formatDate(e) {
    var convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    this.bookForm.get('adate').setValue(convertDate, {
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
      var filePath=`audition/${this.selectedImage.name}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath,this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            formValue['aimage'] = url;
            this.bookApi.AddAudtion(formValue);       
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