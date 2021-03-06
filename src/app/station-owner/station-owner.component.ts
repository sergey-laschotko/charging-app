import { Component, OnInit, ViewChild, ViewChildren, AfterViewInit } from '@angular/core';
import { BalanceComponent } from '../balance/balance.component';
import { MatExpansionPanel } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { BaseService } from '../base.service';
import { HistoryService } from '../util/history.service';
import { IStation, IOperation, ITariff } from '../mock-data/models';
import { formatDate, onlyDigits } from "../../lib/lib";
import { RegisterService } from "../ethContr/register.service";
import { ERC20TokenService } from "../ethContr/erc20Token.service";
import { ChargerService } from "../ethContr/charger.service";
import { FactoryService } from "../ethContr/factory.service";

@Component({
  selector: 'app-station-owner',
  templateUrl: './station-owner.component.html',
  styleUrls: ['./station-owner.component.css']
})
export class StationOwnerComponent implements OnInit, AfterViewInit {
  user: string;
  balance: number;
  stations: IStation[] = [];
  tariffs: string[] = [];
  newStation: string = "";
  adding: boolean = false;
  addingTariff: boolean = false;
  editingStation: boolean = false;
  currentEditingStation: IStation;
  newTariffFrom: string = "00:00";
  newTariffTo: string = "00:00";
  newTariffPrice: number = 0;
  operations: IOperation[] = [];
  displayedColumns: string[] = ["timeStamp", "from", "to"];
  columnsHeaders: string[] = ["Дата", "Отправитель", "Получатель"];
  isLoading: boolean = false;

  @ViewChild('dtpfrom') dtpFrom: any;
  @ViewChild('dtpto') dtpTo: any;
  @ViewChild('priceInput') priceInput: any;
  @ViewChild(BalanceComponent) balanceComponent: any;
  @ViewChildren(MatExpansionPanel) expansionPanels: any;


  constructor(
    private bs: BaseService,
    private rs: RegisterService,
    private e20ts: ERC20TokenService,
    private hs: HistoryService, 
    private fs: FactoryService,
    private chs: ChargerService,
    private sb: MatSnackBar
    ) {
      this.isLoading = true;
      this.user = this.e20ts.getStationOwner();
      this.getBalance();
      this.showChargers();
      this.updateJournal();
    }
    
  ngOnInit() {}
    
  ngAfterViewInit() {}

  showChargers() {
    this.rs.showChargers()
        .then((stations: IStation[]) => {
          this.stations = stations;
          this.stations.forEach((station: any) => {
            station.tariff.forEach((tariff: any) => {
              if (tariff) {
                let fromHours: any = Math.floor(tariff.from / 3600);
                let fromMinutes: any = (tariff.from % 3600) / 60;
                let toHours: any = Math.floor(tariff.to / 3600);
                let toMinutes: any = (tariff.to % 3600) / 60;
                if (fromHours < 10) {
                  fromHours = "0" + fromHours;
                }
                if (fromMinutes < 10) {
                  fromMinutes = "0" + fromMinutes;
                }
                if (toHours < 10) {
                  toHours = "0" + toHours;
                }
                if (toMinutes < 10) {
                  toMinutes = "0" + toMinutes;
                }
                tariff.from = `${fromHours}:${fromMinutes}`;
                tariff.to = `${toHours}:${toMinutes}`;
              }
            });
          });
          this.isLoading = false;
        });
  }

  onTabChange() {
    this.adding = false;
    this.clearInputs();
    this.expansionPanels.forEach((panel: any) => {
      panel.close();
    });
    this.balanceComponent.resetInput();
  }
    
  getBalance() {
    this.e20ts.getBalance(this.user)
      .then((balance: number) => {
      this.balance = balance;
    });
  }
  
  buyTokens(amount: number) {
    this.e20ts.buyTokens(amount, this.user)
      .then((status: any) => {
        if (status) {
          this.sb.open("Покупка токенов", "Готово", {
            duration: 3000
          });
          this.getBalance();
          this.updateJournal();
        } else {
          this.sb.open("Покупка не удалась", "Ошибка", {
            duration: 3000
          })
        }
      });
  }
  
  formatDate(date: Date) {
    return formatDate(date).string;
  }

  toggleAdding() {
    this.adding = !this.adding;
  }

  toggleAddingTariff() {
    this.addingTariff = !this.addingTariff;
    this.dtpFrom.resetTime();
    this.dtpTo.resetTime();
  }

  checkPriceInput(e: any) {
    return onlyDigits(e);
  }

  priceToNumber(e: any) {
    this.newTariffPrice *= 1;
    this.priceInput.nativeElement.value = this.newTariffPrice;
  }

  setFromTime(date: Date) {
    let hours = date.getHours() < 10 ? "0" + date.getHours() : String(date.getHours());
    let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : String(date.getMinutes());
    this.newTariffFrom = `${hours}:${minutes}`;
  }

  setToTime(date: Date) {
    let hours = date.getHours() < 10 ? "0" + date.getHours() : String(date.getHours());
    let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : String(date.getMinutes());
    this.newTariffTo = `${hours}:${minutes}`;
  }

  clearInputs() {
    this.addingTariff = false;
    this.newTariffFrom = "00:00";
    this.newTariffTo = "00:00";
    this.newTariffPrice = 0;
    this.dtpFrom.resetTime();
    this.dtpTo.resetTime();
    this.currentEditingStation = null;
    this.editingStation = false;
  }

  sortTariff(a: any, b: any) {
    if (`${a.from}${a.to}` > `${b.from}${b.to}`) return 1;
    else return -1;
  }

  addNewStation() {
    if (!this.newStation) {
      return;
    }
    this.fs.createCharger(this.newStation, this.newStation, this.user)
      .then((result) => {
        this.sb.open("Добавление станции", "Готово", {
          duration: 3000
        });
        this.updateJournal();
      });
    this.toggleAdding();
  }

  validateNewStation() {
    return this.newStation.length > 0;
  }

  addNewTariff(address: string) {
    let [fromHour, fromMinute] = this.newTariffFrom.split(":");
    let [toHour, toMinute] = this.newTariffTo.split(":");
    let from = Number(fromHour) * 3600 + Number(fromMinute) * 60;
    let to = Number(toHour) * 3600 + Number(toMinute) * 60;
    this.chs.addRate(from, to, this.newTariffPrice)
      .then((result: any) => {
        this.showChargers();
        this.sb.open("Добавление тарифа", "Готово", {
          duration: 3000
        });
        this.updateJournal();
      });
    this.newTariffFrom = "00:00";
    this.newTariffTo = "00:00";
    this.newTariffPrice = 0;
    this.addingTariff = !this.addingTariff;
  }

  setEditingStation(station: IStation) {
    this.currentEditingStation = Object.assign({ ...station });
    this.editingStation = true;
  }

  finishEditingStation() {
    this.currentEditingStation = null;
    this.editingStation = false;
  }

  editStation() {
    this.sb.open("Редактирование адреса станции", "Готово", {
      duration: 3000
    });
    this.finishEditingStation();
    this.updateJournal();
  }

  deleteStation(station: IStation) {
    this.sb.open("Удаление станции", "Готово", {
      duration: 3000
    });
    this.updateJournal();
  }

  deleteTariff(station: IStation, tariff: ITariff) {
    this.sb.open("Удаление тарифа", "Готово", {
      duration: 3000
    });
    this.updateJournal();
  }

  updateJournal() {
    this.hs.getHistory()
        .subscribe((result: any) => {
          result.result.forEach((op: any) => {
            op.timeStamp = new Date(Number(op.timeStamp * 1000));
          });
          this.operations = result.result.filter((op: any) => {
            return op.from === this.user.toLowerCase();
          });
        });
  }
}
