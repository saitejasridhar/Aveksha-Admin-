import { User } from './../../shared/user';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { UserService } from './../../shared/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})

export class UserListComponent {
  
  dataSource: MatTableDataSource<User>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  BookData: any = [];
  displayedColumns: any[] = [
    '$key',
    'desc',
    'action'
  ];
  
  constructor(private bookApi: UserService){
    this.bookApi.GetUserList()
    .snapshotChanges().subscribe(books => {
        books.forEach(item => {
          let a = item.payload.toJSON();
          a['$key'] = item.key;
          this.BookData.push(a as User)
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
      this.bookApi.DeleteUser(e.$key)
    }
  }
  
}