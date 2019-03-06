import { Component, OnInit } from '@angular/core';
import { stations } from '../stations';

@Component({
  selector: 'app-station-owner',
  templateUrl: './station-owner.component.html',
  styleUrls: ['./station-owner.component.css']
})
export class StationOwnerComponent implements OnInit {
  username: string = 'Station Owner';
  balance: string = '2750';
  stations: string[] = [];
  tariffs: string[] = [];
  newStation: string = "";
  newTariffFrom: string = "00:00";
  newTariffTo: string = "00:00";
  newTariffPrice: number = 0;

  constructor() { }

  ngOnInit() {
    this.getStations();
  }

  getStations() {
    this.stations = [...(stations.slice(5, 10))];
  }

  addNewStation() {
    if (this.newStation.length) {
      this.stations.push(this.newStation);
    }
  }

  validateNewStation() {
    return this.newStation.length > 0;
  }

  addNewTariff() {
    let newTariff = `С ${this.newTariffFrom} до ${this.newTariffTo} по цене ${this.newTariffPrice}$`;
    this.tariffs.push(newTariff);
  }
}
