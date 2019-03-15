import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { BaseService } from '../base.service';
import { IOperation, IUser, IStation, ITariff } from '../mock-data/models';
import { formatDate } from "../../lib/lib";
import { RegisterService } from "../ethContr/register.service";
import { ERC20TokenService } from "../ethContr/erc20Token.service";
import { ChargerService } from "../ethContr/charger.service";

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
  tableColumns: string[] = ['date', 'type', 'data'];
  columnsHeaders: string[] = ['Дата', 'Операция', 'Детали'];
  dataSource: any;
  isModalOpened: boolean = false;
  buyingProcess: boolean = false;
  chargingProcess: boolean = false;

  constructor(
    private bs: BaseService, 
    private sb: MatSnackBar, 
    private rs: RegisterService,
    private e20ts: ERC20TokenService,
  ) {
    this.user = this.e20ts.getUser();
    this.getBalance();
    this.operations = this.bs.getOperations().reverse();
    this.rs.showChargers()
    .then((stations: IStation[]) => {
      this.stations = stations;
      this.variants = stations;
    });
  }

  ngOnInit() {
  }

  getBalance() {
    this.e20ts.getBalance(this.user)
      .then((balance: number) => {
      this.balance = balance;
    });
  }

  onBuy(amount: number) {
    this.buyingProcess = true;
    this.e20ts.buyTokens(amount)
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

  reserve() {
    this.bs.reserve(this.user, this.address, formatDate(this.date).string);
    this.sb.open("Бронирование", "Готово", {
      duration: 3000
    });
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
    this.chargingProcess = true;
    setInterval(() => {
      this.chargingProcess = false;
    }, 12000);
  }

  closeModal() {
    this.isModalOpened = false;
  }

  updateJournal() {
    this.operations = this.bs.getUsersOperations(this.user.name).reverse();
  }
}
