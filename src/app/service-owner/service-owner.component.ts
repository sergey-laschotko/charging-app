import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseService } from '../base.service';
import { IStation, IOperation } from '../mock-data/models';
import { formatDate } from '../../lib/lib';

@Component({
  selector: 'app-service-owner',
  templateUrl: './service-owner.component.html',
  styleUrls: ['./service-owner.component.css']
})
export class ServiceOwnerComponent implements OnInit {
  username: string = 'Диспетчер';
  tokens: number = 5000;
  serviceProviders: any[] = [];
  operations: IOperation[] = [];
  selectedStation: string = "";
  displayedColumns: string[] = ["date", "type", "operator", "data"];
  columnsHeaders: string[] = ["Дата", "Тип", "Исполнитель", "Детали"];
  stations: IStation[] = [];
  balanceColumns: string[] = ["address", "balance"];
  balanceHeaders: string[] = ["Адрес", "Баланс"];

  constructor(private bs: BaseService) { 
    this.serviceProviders = this.bs.getStationsOwners();
    this.stations = this.bs.getStations();
    this.selectedStation = this.stations[0].address;
    this.operations = this.bs.getOperations();
  }

  ngOnInit() {
    this.showStationJournal();
  }

  showStationJournal() {
    this.operations = this.bs.getOperations().filter((operation: any) => {
      return operation.location === this.selectedStation;
    });
  }

  produceTokens(amount: number) {
    this.tokens += amount;
  }

  removeTokens(amount: number) {
    this.tokens -= amount;
  }
}
