import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { BaseService } from '../base.service';
import { IOperation, IUser, IStation } from '../mock-data/models';
import { formatDate } from "../../lib/lib";
import { RegisterService } from "../ethContr/register.service";
import { ERC20TokenService } from "../ethContr/erc20Token.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: any;
  balance: number;
  address: string = "";
  variants: IStation[] = [];
  stations: IStation[] = [];
  date: Date = new Date;
  operations: IOperation[] = [];
  tableColumns: string[] = ['date', 'type', 'data'];
  columnsHeaders: string[] = ['Дата', 'Операция', 'Детали'];
  dataSource: any;
  isModalOpened: boolean = false;

  constructor(
    private bs: BaseService, 
    private sb: MatSnackBar, 
    private rs: RegisterService,
    private e20ts: ERC20TokenService
  ) {
    this.user = this.e20ts.getUser();
    let tryGetBalance = (stopper: any) => {
      if (!this.e20ts.isReady) {
        setTimeout(() => {
          tryGetBalance(stopper);
        }, 1000);
      } else {
        clearInterval(stopper);
        this.e20ts.getBalance(this.user)
          .then((balance: number) => {
          this.balance = balance;
        })
      }
    };
    let reconnect = setInterval(() => {
      tryGetBalance(reconnect)
    }, 1000);
    this.operations = this.bs.getOperations().reverse();
    this.rs.showChargers()
    .then((stations: IStation[]) => {
      this.stations = stations;
      this.variants = stations;
    });
  }

  ngOnInit() {
  }

  onBuy(amount: number) {
    this.bs.addTokens(this.user, amount);
    this.sb.open("Покупка токенов", "Готово", {
      duration: 3000
    });
    this.updateJournal();
  }

  onSale(amount: number) {
    this.bs.removeTokens(this.user, amount);
    this.sb.open("Продажа токенов", "Готово", {
      duration: 3000
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
    this.bs.charge(this.user, this.address);
    this.address = "";
    this.updateJournal();
    this.variants = [...this.stations];
  }

  closeModal() {
    this.isModalOpened = false;
  }

  updateJournal() {
    this.operations = this.bs.getUsersOperations(this.user.name).reverse();
  }
}
