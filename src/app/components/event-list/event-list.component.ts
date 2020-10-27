
import { Event } from './../../shared/event';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { EventService } from './../../shared/event.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})

export class EventListComponent {
  
  dataSource: MatTableDataSource<Event>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  BookData: any = [];
  displayedColumns: any[] = [
    '$key',
    'etitle', 
    'edate',
    'etime',
    'edesc',
    'action'
  ];
  
  constructor(private bookApi: EventService){
    this.bookApi.GetEventList()
    .snapshotChanges().subscribe(books => {
        books.forEach(item => {
          let a = item.payload.toJSON();
          a['$key'] = item.key;
          this.BookData.push(a as Event)
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
      this.bookApi.DeleteEvent(e.$key)
    }
  }
  
}