import { Audtion } from './../../shared/audtion';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { AudtionService } from './../../shared/audtion.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})

export class BookListComponent {
  
  dataSource: MatTableDataSource<Audtion>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  BookData: any = [];
  displayedColumns: any[] = [
    '$key',
    'atitle', 
    'adate',
    'atime',
    'adesc',
    'action'
  ];
  
  constructor(private bookApi: AudtionService){
    this.bookApi.GetAudtionList()
    .snapshotChanges().subscribe(books => {
        books.forEach(item => {
          let a = item.payload.toJSON();
          a['$key'] = item.key;
          this.BookData.push(a as Audtion)
        })
        /* Data table */
        this.dataSource = new MatTableDataSource(this.BookData);
        /* Pagination */
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        }, 0);
    })
  }

  /* Delete */
  deleteBook(index: number, e){
    if(window.confirm('Are you sure?')) {
      const data = this.dataSource.data;
      data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
      this.dataSource.data = data;
      this.bookApi.DeleteAudtion(e.$key)
    }
  }
  
}