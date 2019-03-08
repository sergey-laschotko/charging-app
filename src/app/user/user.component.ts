import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSnackBar } from '@angular/material';
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
  date: string;
  operations: IOperation[] = [];
  displayedColumns: string[] = ['date', 'type'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private bs: BaseService, private sb: MatSnackBar) { 
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
    this.sb.open("Покупка токенов", "Готово", {
      duration: 3000
    });
  }

  onSale(amount: number) {
    this.bs.removeTokens(this.user.name, amount);
    this.sb.open("Продажа токенов", "Готово", {
      duration: 3000
    });
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

  setAddress(variant: IStation) {
    this.address = variant.address;
    this.sb.open("Выбор станции", "Готово", {
      duration: 3000
    });
  }

  reserve() {
    this.bs.reserve(this.user.name, this.address, this.date);
    this.sb.open("Бронирование", "Готово", {
      duration: 3000
    });
    this.address = "";
    this.date = "00:00";
  }

  charge() {
    console.log("Идет зарядка");
  }
}
