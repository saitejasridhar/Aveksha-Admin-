import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { EventService } from './../../shared/event.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from "rxjs/operators";


export interface Language {
  name: string;
}

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit {
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
    private bookApi: EventService,
    private actRoute: ActivatedRoute,
    private router: Router,
    private storage: AngularFireStorage,
  ) { 
    var id = this.actRoute.snapshot.paramMap.get('id');
    this.bookApi.GetEvent(id).valueChanges().subscribe(data => {
      this.languageArray = data.languages;
    })
  }

  /* Update form */
  updateBookForm(){
    this.editBookForm = this.fb.group({
      eimage: ['', [Validators.required]],
      etime: ['', [Validators.required]],
      edesc: ['', [Validators.required]],
      edate:['',[Validators.required]],
      etitle:['',[Validators.required]]

    })
  }


  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.editBookForm.controls[controlName].hasError(errorName);
  }

  /* Date */
  formatDate(e) {
    var convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    this.editBookForm.get('edate').setValue(convertDate, {
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
      var filePath=`events/${this.selectedImage.name}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath,this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            formValue['eimage'] = url;
            this.bookApi.UpdateEvent(id, this.editBookForm.value);   
            this.router.navigate(['event-list']);  
          })
        })
      ).subscribe();
    }
  }

}