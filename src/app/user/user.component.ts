import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSnackBar } from '@angular/material';
import { BaseService } from '../base.service';
import { IOperation, IUser, IStation } from '../mock-data/models';
import { formatDate } from "../../lib/lib";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: IUser = null;
  address: string = "";
  variants: IStation[] = [];
  stations: IStation[] = [];
  date: Date = new Date;
  operations: IOperation[] = [];
  displayedColumns: string[] = ['date', 'type', 'data'];
  dataSource: any;
  isModalOpened: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private bs: BaseService, private sb: MatSnackBar) { 
    this.user = this.bs.getUser();
    this.operations = this.bs.getUsersOperations(this.user.name).reverse();
    this.dataSource = new MatTableDataSource(this.operations);
    this.stations = this.bs.getStations();
    this.variants = this.bs.getStations();
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  onBuy(amount: number) {
    this.bs.addTokens(this.user, amount);
    this.sb.open("Покупка токенов", "Готово", {
      duration: 3000
    });
    this.updateJournal();
  }

  onSale(amount: number) {
    this.bs.removeTokens(this.user, amount);
    this.sb.open("Продажа токенов", "Готово", {
      duration: 3000
    });
    this.updateJournal();
  }

  formatDate(date: Date) {
    return formatDate(date).string;
  }

  findVariants() {
    if (this.address.length) {
      this.variants = this.stations.filter((station: IStation) => {
        return station.address.toLowerCase().indexOf(this.address.toLowerCase()) === 0;
      });
    } else {
      this.variants = [...this.stations];
    }
  }

  validateAddress() {
    let arr = this.stations.filter((station: IStation) => station.address === this.address);
    return arr.length; 
  }

  setAddress(variant: IStation) {
    this.address = variant.address;
  }

  openReserveDialog() {
    this.isModalOpened = true;
  }

  setDate(date: Date) {
    this.date = date;
  }

  reserve() {
    this.bs.reserve(this.user, this.address, formatDate(this.date).string);
    this.sb.open("Бронирование", "Готово", {
      duration: 3000
    });
    this.address = "";
    this.closeModal();
    this.updateJournal();
    this.variants = [...this.stations];
  }

  charge() {
    this.bs.charge(this.user, this.address);
    this.address = "";
    this.updateJournal();
    this.variants = [...this.stations];
  }

  closeModal() {
    this.isModalOpened = false;
  }

  updateJournal() {
    this.operations = this.bs.getUsersOperations(this.user.name).reverse();
    this.dataSource = new MatTableDataSource(this.operations);
  }
}
