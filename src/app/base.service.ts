import { Injectable } from '@angular/core';
import { DataSource, stations, stationsOwners, users, operations } from './mock-data/datasource';
import { IOperation, IUser, IStation, ITariff } from "./mock-data/models";
import { genID } from "../lib/lib";

const data = new DataSource(stations, operations, stationsOwners, users).generate();
console.log(data);

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  constructor() { 

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

  getStationsOwners() {
    return data.users.filter((user: IUser) => user.stations);
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

  getOperations() {
    return data.operations;
  }

  addTokens(name: string, amount: number) {
    data.users.map((user: IUser) => {
      if (user.name === name) {
        user.balance += amount;
        data.operations.push({
          id: genID(),
          type: "Покупка токенов",
          operator: name,
          date: new Date(),
          data: `Куплено ${amount} токенов`,
          location: ""
        });
      }
    });
  }

  removeTokens(name: string, amount: number) {
    data.users.map((user: IUser) => {
      if (user.name === name) {
        user.balance -= amount;
        data.operations.push({
          id: genID(),
          type: "Продажа токенов",
          operator: name,
          date: new Date(),
          data: `Продано ${amount} токенов`,
          location: ""
        });
      }
    });
  }

  reserve(name: string, address: string, reserveDate: string) {
    data.operations.push({
      id: genID(),
      operator: name,
      type: "Бронь",
      data: `${reserveDate} по адресу ${address}`,
      date: new Date,
      location: address
    });
  }

  charge(name: string, address: string) {
    data.operations.push({
      id: genID(),
      operator: name,
      type: "Зарядка",
      data: `Зарядка по адресу ${address}`,
      date: new Date,
      location: address
    });
  }

  addStation(name: string, address: string) {
    data.users.map((user: IUser) => {
      if (user.name === name) {
        user.stations.push({
          id: genID(),
          address: address,
          balance: 0,
          tariffs: []
        });
        data.operations.push({
          id: genID(),
          date: new Date(),
          type: "Добавление станции",
          data: `Новая станция по адресу ${address}`,
          operator: name,
          location: ""
        });
      }
    });
  }

  addTariff(name: string, address: string, from: string, to: string, price: number ) {
    data.users.map((user: IUser) => {
      if (user.name === name) {
        user.stations.map((station: IStation) => {
          if (station.address === address) {
            station.tariffs.push({
              id: genID(),
              from,
              to,
              price
            });
            station.tariffs.sort((a: ITariff, b: ITariff) => {
              if (`${a.from}${a.to}` > `${b.from}${b.to}`) return 1;
              else return -1;
            });
            console.log(station.tariffs);
          }
        });
        data.operations.push({
          id: genID(),
          operator: name,
          type: "Добавление тарифа",
          data: `Добавлен тариф на станцию ${address}`,
          date: new Date(),
          location: ""
        });
      }
    });
  }
}
