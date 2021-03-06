import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { OwnerBalanceComponent } from '../owner-balance/owner-balance.component';
import { MatExpansionPanel } from '@angular/material';
import { BaseService } from '../base.service';
import { IStation, IOperation } from '../mock-data/models';
import { RegisterService } from "../ethContr/register.service";
import { ERC20TokenService } from "../ethContr/erc20Token.service";
import { HistoryService } from '../util/history.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-service-owner',
  templateUrl: './service-owner.component.html',
  styleUrls: ['./service-owner.component.css']
})
export class ServiceOwnerComponent implements OnInit {
  user: string;
  balance: number;
  tokens: number = 5000;
  producingProcess: boolean = false;
  removingProcess: boolean = false;
  serviceProviders: any[] = [];
  operations: IOperation[] = [];
  operationsCopy: IOperation[] = [];
  displayedColumns: string[] = ["timeStamp", "from", "to"];
  columnsHeaders: string[] = ["Дата", "Отправитель", "Получатель"];
  stations: IStation[] = [];
  selectedStation: string = "";
  balanceColumns: string[] = ["address", "balance"];
  balanceHeaders: string[] = ["Адрес", "Баланс"];
  isLoading: boolean = false;

  @ViewChild(OwnerBalanceComponent) ownerBalanceComponent: any;
  @ViewChildren(MatExpansionPanel) expansionPanels: any;

  constructor(
    private bs: BaseService,
    private rs: RegisterService,
    private e20ts: ERC20TokenService,
    private hs: HistoryService,
    private sb: MatSnackBar
  ) { 
    this.isLoading = true;
    this.user = this.e20ts.getServiceOwner();
    this.getBalance();
    this.rs.showChargers()
      .then((stations: IStation[]) => {
        this.stations = stations;
        this.selectedStation = this.stations[0].address;
        this.showStationJournal();
        let serviceProvider = {
          name: "",
          balance: 0,
          stations: []
        };
        serviceProvider.name = this.e20ts.getStationOwner();
        this.e20ts.getBalance(serviceProvider.name)
          .then((balance: number) => {
            serviceProvider.balance = balance;
          });
        serviceProvider.stations = [...this.stations];
        this.serviceProviders.push(serviceProvider);
      });
    this.hs.getHistory()
      .subscribe((result: any) => {
        result.result.forEach((op: any) => {
          op.timeStamp = new Date(Number(op.timeStamp * 1000));
        });
        this.operations = result.result;
        this.isLoading = false;
      });
  }

  ngOnInit() {}

  onTabChange() {
    this.ownerBalanceComponent.resetInput();
    this.expansionPanels.forEach((panel: any) => {
      panel.close();
    });
  }

  getBalance() {
    this.e20ts.totalSupply()
      .then((balance: number) => {
      this.balance = balance;
    });
  }

  showStationJournal() {
      this.operationsCopy = [...this.operations];
      let id = this.stations.filter((station: IStation) => {
        return station.address === this.selectedStation;
      })[0].id;
      this.operationsCopy = this.operationsCopy.filter((op: any) => {
        return op.to == id.toLowerCase();
      });
  }

  produceTokens(amount: number) {
    this.producingProcess = true;
    this.e20ts.mint(amount)
      .then(() => {
        this.producingProcess = false;
        this.sb.open("Выпущено токенов: ", `${amount}`, {
          duration: 3000
        });
        this.getBalance();
      });
  }

  removeTokens(amount: number) {
    this.removingProcess = true;
    this.e20ts.burn(amount)
      .then(() => {
        this.removingProcess = false;
        this.sb.open("Сожжено токенов: ", `${amount}`, {
          duration: 3000
        });
        this.getBalance();
      });
  }
}
