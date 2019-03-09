import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSnackBar } from '@angular/material';
import { BaseService } from '../base.service';
import { IUser, IStation, IOperation } from '../mock-data/models';
import { formatDate } from "../../lib/lib";

@Component({
  selector: 'app-station-owner',
  templateUrl: './station-owner.component.html',
  styleUrls: ['./station-owner.component.css']
})
export class StationOwnerComponent implements OnInit, AfterViewInit {
  user: IUser;
  stations: IStation[] = [];
  tariffs: string[] = [];
  newStation: string = "";
  adding: boolean = false;
  newTariffFrom: string = "00:00";
  newTariffTo: string = "00:00";
  newTariffPrice: number = 0;
  operations: IOperation[] = [];
  displayedColumns: string[] = ["date", "type", "data"];
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private bs: BaseService, private sb: MatSnackBar) {
  }

  ngOnInit() {
    this.user = this.bs.getStationOwner();
    this.stations = this.user.stations;
    this.operations = this.bs.getUsersOperations(this.user.name).reverse();
    this.dataSource = new MatTableDataSource(this.operations);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  formatDate(date: Date) {
    return formatDate(date).string;
  }

  toggleAdding() {
    this.adding = !this.adding;
  }

  addNewStation() {
    this.bs.addStation(this.user.name, this.newStation);
    this.sb.open("Добавление станции", "Готово", {
      duration: 3000
    });
    this.updateJournal();
  }

  validateNewStation() {
    return this.newStation.length > 0;
  }

  addNewTariff() {
    let newTariff = `С ${this.newTariffFrom} до ${this.newTariffTo} по цене ${this.newTariffPrice}$`;
    this.tariffs.push(newTariff);
    this.newTariffFrom = "00:00";
    this.newTariffTo = "00:00";
    this.newTariffPrice = 0
  }

  buyTokens(amount: number) {
    this.bs.addTokens(this.user.name, amount);
    this.sb.open("Покупка токенов", "Готово", {
      duration: 3000
    });
    this.updateJournal();
  }

  saleTokens(amount: number) {
    this.bs.removeTokens(this.user.name, amount);
    this.sb.open("Продажа токенов", "Готово", {
      duration: 3000
    });
    this.updateJournal();
  }

  updateJournal() {
    this.operations = this.bs.getUsersOperations(this.user.name).reverse();
    this.dataSource = new MatTableDataSource(this.operations);
  }
}
