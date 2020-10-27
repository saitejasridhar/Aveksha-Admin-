import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { AudtionService } from './../../shared/audtion.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from "rxjs/operators";


export interface Language {
  name: string;
}

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})

export class EditBookComponent implements OnInit {
  imgSrc: string='/assets/img/image_placeholder.jpg'
  selectedImage: any = null;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  languageArray: Language[] = [];
  @ViewChild('chipList') chipList;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedBindingType: string;
  editBookForm: FormGroup;

  ngOnInit() {
    this.updateBookForm();
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
    private location: Location,
    private bookApi: AudtionService,
    private actRoute: ActivatedRoute,
    private router: Router,
    private storage: AngularFireStorage,
  ) { 
    var id = this.actRoute.snapshot.paramMap.get('id');
    this.bookApi.GetAudtion(id).valueChanges().subscribe(data => {
      this.languageArray = data.languages;
    })
  }

  /* Update form */
  updateBookForm(){
    this.editBookForm = this.fb.group({
      aimage: ['', [Validators.required]],
      atime: ['', [Validators.required]],
      adesc: ['', [Validators.required]],
      adate:['',[Validators.required]],
      atitle:['',[Validators.required]]

    })
  }


  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.editBookForm.controls[controlName].hasError(errorName);
  }

  /* Date */
  formatDate(e) {
    var convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    this.editBookForm.get('adate').setValue(convertDate, {
      onlyself: true
    })
  }

  /* Go to previous page */
  goBack(){
    this.location.back();
  }

  // /* Submit book */
  // updateBook() {
  //   var id = this.actRoute.snapshot.paramMap.get('id');
  //   if(window.confirm('Are you sure you wanna update?')){
  //       this.bookApi.UpdateBook(id, this.editBookForm.value);
  //     this.router.navigate(['books-list']);
  //   }
  // }

  updateBook(formValue) {
    if (this.editBookForm.valid){
      var id = this.actRoute.snapshot.paramMap.get('id');
      var filePath=`audition/${this.selectedImage.name}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath,this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            formValue['aimage'] = url;
            this.bookApi.UpdateAudtion(id, this.editBookForm.value);   
            this.router.navigate(['books-list']);  
          })
        })
      ).subscribe();
    }
  }

}