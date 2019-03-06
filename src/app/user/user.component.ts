import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatTable } from '@angular/material';

import { stations } from '../stations';

const operations: { date: string, operation: string }[] = [
  { date: "17:00 21.02.2019", operation: "Зарядка" },
  { date: "19:00 21.02.2019", operation: "Покупка 3 токенов" },
  { date: "09:34 22.02.2019", operation: "Бронь зарядки на 12:00" },
  { date: "12:00 22.02.2019", operation: "Зарядка" },
  { date: "16:23 22.02.2019", operation: "Продажа 1 токена" },
  { date: "21:12 22.02.2019", operation: "Продажа 2 токенов" },
  { date: "10:17 23.02.2019", operation: "Зарядка" },
  { date: "15:43 24.02.2019", operation: "Зарядка" },
];  

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  username: string = "John Doe";
  tokens: number = 5;
  showInput: boolean = true;
  address: string = "";
  variants: string[] = [];
  stations: string[] = stations;
  time: string;
  displayedColumns: string[] = ['date', 'operation'];
  dataSource = new MatTableDataSource(operations);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  onBuy(amount: number) {
    this.tokens += amount;
  }

  onSale(amount: number) {
    this.tokens -= amount;
  }

  findVariants() {
    if (this.address.length) {
      this.variants = this.stations.filter((station: string) => {
        return station.toLowerCase().indexOf(this.address.toLowerCase()) === 0;
      });
    } else {
      this.variants = [];
    }
  }

  setAddress(address: string) {
    this.address = address;
    this.variants = [];
  }

  toggleForm() {
    this.showInput = !this.showInput;
  }

  validateForm() {
    return this.stations.indexOf(this.address) !== -1 && this.time;
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
