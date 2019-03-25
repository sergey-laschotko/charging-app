import { Component, OnInit, ViewChild } from '@angular/core';
import { BalanceComponent } from '../balance/balance.component';
import { MatSnackBar } from '@angular/material';
import { BaseService } from '../base.service';
import { IOperation, IUser, IStation, ITariff } from '../mock-data/models';
import { formatDate } from "../../lib/lib";
import { RegisterService } from "../ethContr/register.service";
import { ERC20TokenService } from "../ethContr/erc20Token.service";
import { ChargerService } from "../ethContr/charger.service";
import { HistoryService } from "../util/history.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: any;
  balance: number;
  address: string = "";
  currentTariff: number = 0;
  variants: IStation[] = [];
  stations: IStation[] = [];
  date: Date = new Date;
  operations: IOperation[] = [];
  tableColumns: string[] = ['timeStamp', 'from', 'to'];
  columnsHeaders: string[] = ['Дата', 'Отправитель', 'Получатель'];
  dataSource: any;
  reserveMinutes: number = 30;
  isModalOpened: boolean = false;
  buyingProcess: boolean = false;
  paymentProcess: boolean = false;
  chargingProcess: boolean = false;
  isLoading: boolean = false;

  @ViewChild(BalanceComponent) balanceComponent: any;

  constructor(
    private bs: BaseService, 
    private sb: MatSnackBar, 
    private rs: RegisterService,
    private e20ts: ERC20TokenService,
    private chs: ChargerService,
    private hs: HistoryService,
  ) {
    this.isLoading = true;
    this.user = this.e20ts.getUser();
    this.getBalance();
    this.updateJournal();
    this.rs.showChargers()
      .then((stations: IStation[]) => {
        this.stations = stations;
        this.variants = stations;
        this.isLoading = false;
      });
  }

  ngOnInit() {
  }

  onTabChange() {
    this.balanceComponent.resetInput();
    this.address = "";
  }

  getBalance() {
    this.e20ts.getBalance(this.user)
      .then((balance: number) => {
      this.balance = balance;
    });
  }

  onBuy(amount: number) {
    this.buyingProcess = true;
    this.e20ts.buyTokens(amount, this.user)
      .then((status: any) => {
        if (status) {
          this.sb.open("Покупка токенов", "Готово", {
            duration: 3000
          });
          this.getBalance();
          this.buyingProcess = false;
        } else {
          this.sb.open("Покупка не удалась", "Ошибка", {
            duration: 3000
          })
          this.buyingProcess = false;
        }
      });
    this.updateJournal();
  }

  formatDate(date: Date) {
    return formatDate(date).string;
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

  validateAddress() {
    let arr = this.stations.filter((station: IStation) => station.address === this.address);
    return arr.length; 
  }

  setAddress(variant: IStation) {
    this.address = variant.address;
  }

  openReserveDialog() {
    this.isModalOpened = true;
  }

  setDate(date: Date) {
    this.date = date;
  }

  increaseReserveMinutes() {
    this.reserveMinutes += 10;
  }

  decreaseReserveMinutes() {
    if (this.reserveMinutes === 30) {
      return;
    }
    this.reserveMinutes -= 10;
  }

  reserve() {
    let reserveFinish = this.reserveMinutes * 60000;
    let start = this.date.valueOf();
    let end = start + reserveFinish;
    let charger: IStation = null; 
    this.stations.map((station: IStation) => {
      if (station.address === this.address){
        charger = station;
      }
    });
    this.chs.reserve(start, end, charger.id)
      .then((result: any) => {
        console.log(result);
        this.sb.open("Бронирование", "Готово", {
          duration: 3000
        });
      });
    this.reserveMinutes = 30;
    this.address = "";
    this.closeModal();
    this.updateJournal();
    this.variants = [...this.stations];
  }

  charge() {
    if (this.balance < 150) {
      this.sb.open("Недостаточно токенов", "Нужно не менее 150", {
        duration: 3000
      })
      return;
    }
    let charger: IStation = null; 
    this.stations.map((station: IStation) => {
      if (station.address === this.address){
        charger = station;
      }
    });
    this.paymentProcess = true;
    this.chs.startCharging(charger.id)
      .then(() => {
          this.chargingProcess = true;
          this.paymentProcess = false;
          setTimeout(() => {
            this.chargingProcess = false;
            this.address = "";
          }, 12000);
      });
  }

  closeModal() {
    this.isModalOpened = false;
  }

  updateJournal() {
    this.hs.getHistory()
      .subscribe((result: any) => {
        result.result.forEach((op: any) => {
          op.timeStamp = new Date(Number(op.timeStamp * 1000));
        });
        this.operations = result.result.filter((op: any) => {
          return op.from === this.user.toLowerCase();
        });;
      });
  }
}
