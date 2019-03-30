import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { OwnerBalanceComponent } from '../owner-balance/owner-balance.component';
import { MatExpansionPanel } from '@angular/material';
import { BaseService } from '../base.service';
import { IStation, IOperation } from '../models';
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
    private sb: MatSnackBar
  ) { 
    this.isLoading = true;
    this.getUser();
    this.getBalance();
    this.bs.getStations()
    .subscribe((stations: IStation[]) => {
      this.stations = stations;
      this.selectedStation = this.stations[0].address;
      this.bs.getHistory()
      .subscribe((result: any) => {
        result.forEach((op: any) => {
          op.timeStamp = new Date(Number(op.timeStamp * 1000));
        });
        this.operations = result;
        this.showStationJournal();
        this.isLoading = false;
      });
      let serviceProvider = {
        name: "",
        balance: 0,
        stations: []
      };
      this.bs.getStationOwner()
        .subscribe((result: any) => {
          serviceProvider.name = result;
          this.bs.getBalance(serviceProvider.name)
            .subscribe((balance: number) => {
              serviceProvider.balance = balance;
            });
        });
      serviceProvider.stations = [...this.stations];
      this.serviceProviders.push(serviceProvider);
    });
  }

  ngOnInit() {}

  getUser() {
    this.bs.getServiceOwner()
      .subscribe((result: any) => {
        this.user = result;
      });
  }

  onTabChange() {
    this.ownerBalanceComponent.resetInput();
    this.expansionPanels.forEach((panel: any) => {
      panel.close();
    });
  }

  getBalance() {
    this.bs.getTotalSupply()
      .subscribe((balance: number) => {
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
    this.bs.mint(amount)
      .subscribe(() => {
        this.producingProcess = false;
        this.sb.open("Выпущено токенов: ", `${amount}`, {
          duration: 3000
        });
        this.getBalance();
      });
  }

  removeTokens(amount: number) {
    this.removingProcess = true;
    this.bs.burn(amount)
      .subscribe(() => {
        this.removingProcess = false;
        this.sb.open("Сожжено токенов: ", `${amount}`, {
          duration: 3000
        });
        this.getBalance();
      });
  }
}
