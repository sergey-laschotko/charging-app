import { Injectable } from '@angular/core';
import { DataSource, stations, stationsOwners, users, operations } from './mock-data/datasource';
import { IOperation, IUser, IStation } from "./mock-data/models";

const data = new DataSource(stations, operations, stationsOwners, users).generate();

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  constructor() { 

  }

  getCurrentDate() {
    let currentDate = new Date();
    let hours = currentDate.getHours() < 10 ? "0" + currentDate.getHours() : currentDate.getHours();
    let minutes = currentDate.getMinutes() < 10 ? "0" + currentDate.getMinutes() : currentDate.getMinutes();
    let date = currentDate.getDate() < 10 ? "0" + currentDate.getDate() : currentDate.getDate();
    let month = (currentDate.getMonth() + 1) < 10 ? "0" + (currentDate.getMonth() + 1) : currentDate.getMonth() + 1;
    let year = currentDate.getFullYear();
    return `${hours}:${minutes} ${date}.${month}.${year}`;
  }

  getUser() {
    for (let user of data.users) {
      if (!user.stations) {
        return user;
      }
    }
  }

  getStationOwner() {
    for (let user of data.users) {
      if (user.stations) {
        return user;
      }
    }
  }

  getStations() {
    let stations: IStation[] = [];
    for (let user of data.users) {
      if (user.stations) {
        user.stations.map((station: IStation) => {
          if (stations.indexOf(station) < 0) {
            stations.push(station);
          }
        });
      }
    }

    return stations;
  }

  getUsersOperations(name: string) {
    let results: IOperation[] = [];

    for (let operation of data.operations) {
      if (operation.operator === name) {
        results.push(operation);
      }
    }

    return results;
  }

  addTokens(name: string, amount: number) {
    data.users.map((user: IUser) => {
      if (user.name === name) {
        user.balance += amount;
        data.operations.push({
          type: "Покупка токенов",
          operator: name,
          date: this.getCurrentDate()
        });
      }
    });
  }

  removeTokens(name: string, amount: number) {
    data.users.map((user: IUser) => {
      if (user.name === name) {
        user.balance -= amount;
        data.operations.push({
          type: "Продажа токенов",
          operator: name,
          date: this.getCurrentDate()
        });
      }
    });
  }
}
