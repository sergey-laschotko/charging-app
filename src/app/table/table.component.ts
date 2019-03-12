import { Component, OnInit, Input, ViewChild, SimpleChanges } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { formatDate } from '../../lib/lib';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  @Input() data: any = null;
  @Input() displayedColumns: string[] = [];
  @Input() columnsHeaders: string[] = [];
  dataSource: any = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.data);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.dataSource = new MatTableDataSource(changes.data.currentValue);
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  isDate(arg: any) {
    return arg instanceof Date;
  } 

  formatDate(date: Date) {
    return formatDate(date).string;
  }
}
