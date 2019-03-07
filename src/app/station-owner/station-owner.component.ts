import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatTable } from '@angular/material';
import { stations } from '../mock-data/datasource';

@Component({
  selector: 'app-station-owner',
  templateUrl: './station-owner.component.html',
  styleUrls: ['./station-owner.component.css']
})
export class StationOwnerComponent implements OnInit {
  username: string = 'Поставщик услуг сервиса зарядки';
  tokens: number = 10;
  stations: string[] = [];
  tariffs: string[] = [];
  newStation: string = "";
  adding: boolean = false;
  newTariffFrom: string = "00:00";
  newTariffTo: string = "00:00";
  newTariffPrice: number = 0;
  displayedColumns: string[] = ["date", "operation"];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor() { }

  ngOnInit() {
    this.getStations();
    this.dataSource.paginator = this.paginator;
  }

  toggleAdding() {
    this.adding = !this.adding;
  }

  getStations() {
    this.stations = [...(stations.slice(5, 10))];
  }

  addNewStation() {
    if (this.newStation.length) {
      this.stations.push(this.newStation);
      this.tariffs = [];
    }
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
    this.tokens += amount;
  }

  saleTokens(amount: number) {
    this.tokens -= amount;
  }
}
