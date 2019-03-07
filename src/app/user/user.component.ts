import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { BaseService } from '../base.service';
import { IOperation, IUser, IStation } from '../mock-data/models';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: IUser = null;
  showInput: boolean = true;
  address: string = "";
  variants: IStation[] = [];
  stations: IStation[] = [];
  time: string;
  operations: IOperation[] = [];
  displayedColumns: string[] = ['date', 'type'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private bs: BaseService) { 
    this.user = this.bs.getUser();
    this.operations = this.bs.getUsersOperations(this.user.name);
    this.dataSource = new MatTableDataSource(this.operations);
    this.stations = this.bs.getStations();
    this.variants = this.bs.getStations();
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  onBuy(amount: number) {
    this.bs.addTokens(this.user.name, amount);
  }

  onSale(amount: number) {
    this.bs.removeTokens(this.user.name, amount);
  }

  findVariants() {
    if (this.address.length) {
      this.variants = this.stations.filter((station: IStation) => {
        return station.address.toLowerCase().indexOf(this.address.toLowerCase()) === 0;
      });
    }
  }

  setAddress(address: string) {
    this.address = address;
    this.variants = [];
  }

  validateForm() {
    return this.time;
  }

  reserve() {
    console.log(`Зарядка по адресу ${this.address} в ${this.time}`);
    this.address = "";
    this.variants = [];
    this.time = "00:00";
  }

  charge() {
    console.log("Идет зарядка");
  }
}
