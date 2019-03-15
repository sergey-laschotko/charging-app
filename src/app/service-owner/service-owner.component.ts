import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseService } from '../base.service';
import { IStation, IOperation } from '../mock-data/models';
import { RegisterService } from "../ethContr/register.service";
import { ERC20TokenService } from "../ethContr/erc20Token.service";

@Component({
  selector: 'app-service-owner',
  templateUrl: './service-owner.component.html',
  styleUrls: ['./service-owner.component.css']
})
export class ServiceOwnerComponent implements OnInit {
  user: string;
  balance: number;
  tokens: number = 5000;
  serviceProviders: any[] = [];
  operations: IOperation[] = [];
  displayedColumns: string[] = ["date", "type", "operator", "data"];
  columnsHeaders: string[] = ["Дата", "Тип", "Исполнитель", "Детали"];
  stations: IStation[] = [];
  selectedStation: string = "";
  balanceColumns: string[] = ["address", "balance"];
  balanceHeaders: string[] = ["Адрес", "Баланс"];

  constructor(
    private bs: BaseService,
    private rs: RegisterService,
    private e20ts: ERC20TokenService
  ) { 
    this.user = this.e20ts.getUser();
    this.getBalance();
    this.serviceProviders = this.bs.getStationsOwners();
    this.rs.showChargers()
      .then((stations: IStation[]) => {
        this.stations = stations;
      });
    this.operations = this.bs.getOperations();
  }

  ngOnInit() {}

  getBalance() {
    this.e20ts.getBalance(this.user)
      .then((balance: number) => {
      this.balance = balance;
    });
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
