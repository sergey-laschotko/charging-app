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
  selector: 'app-station-owner',
  templateUrl: './station-owner.component.html',
  styleUrls: ['./station-owner.component.css']
})
export class StationOwnerComponent implements OnInit {
  username: string = 'Поставщик услуг сервиса зарядки';
  balance: string = '2750';
  tokens: number = 10;
  stations: string[] = [];
  tariffs: string[] = [];
  newStation: string = "";
  newTariffFrom: string = "00:00";
  newTariffTo: string = "00:00";
  newTariffPrice: number = 0;
  tokenBuying: boolean = false;
  tokenSaling: boolean = false;
  displayedColumns: string[] = ["date", "operation"];
  dataSource = new MatTableDataSource(operations);

  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor() { }

  ngOnInit() {
    this.getStations();
    this.dataSource.paginator = this.paginator;
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

  buyTokens() {
    if (this.tokenBuying) {
      this.tokenBuying = !this.tokenBuying;
    } else {
      this.tokenBuying = true;
    }
  }

  saleTokens() {
    if (this.tokenSaling) {
      this.tokenSaling = !this.tokenSaling;
    } else {
      this.tokenSaling = true;
    }
  }

  manipulateTokens(val: number) {
    if (this.tokenBuying) {
      this.tokens += Number(val);
    } else if (this.tokenSaling) {
      this.tokens -= Number(val);
    } else {
      this.tokenBuying = false;
      this.tokenSaling = false;
      return false;
    }
    this.tokenBuying = false;
    this.tokenSaling = false;
  }
}
