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

  addTokens(operator: IUser, amount: number) {
    data.users.map((user: IUser) => {
      if (user.id === operator.id) {
        user.balance += amount;
        data.operations.push({
          id: genID(),
          type: "Покупка токенов",
          operator: operator.name,
          date: new Date(),
          data: `Куплено ${amount} токенов`,
          location: ""
        });
      }
    });
  }

  removeTokens(operator: IUser, amount: number) {
    data.users.map((user: IUser) => {
      if (user.id === operator.id) {
        user.balance -= amount;
        data.operations.push({
          id: genID(),
          type: "Продажа токенов",
          operator: operator.name,
          date: new Date(),
          data: `Продано ${amount} токенов`,
          location: ""
        });
      }
    });
  }

  reserve(operator: IUser, address: string, reserveDate: string) {
    data.operations.push({
      id: genID(),
      operator: operator.name,
      type: "Бронь",
      data: `${reserveDate} по адресу ${address}`,
      date: new Date,
      location: address
    });
  }

  charge(operator: IUser, address: string) {
    data.operations.push({
      id: genID(),
      operator: operator.name,
      type: "Зарядка",
      data: `Зарядка по адресу ${address}`,
      date: new Date,
      location: address
    });
  }

  addStation(operator: IUser, address: string) {
    data.users.map((user: IUser) => {
      if (user.id === operator.id) {
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
          operator: operator.name,
          location: ""
        });
      }
    });
  }

  editStation(operator: IUser, editedStation: IStation) {
    data.users.map((user: IUser) => {
      if (user.id === operator.id) {
        user.stations.map((station: IStation) => {
          let oldAddress = station.address;
          if (station.id === editedStation.id) {
            station.address = editedStation.address;
            data.operations.push({
              id: genID(),
              date: new Date(),
              type: "Редактирование адреса станции",
              data: `${oldAddress} -> ${station.address}`,
              operator: operator.name,
              location: ""
            });
          }
        });
      }
    });
  }

  deleteStation(user: IUser, deletedStation: IStation) {
    data.users.map((u: IUser) => {
      if (user.id === u.id) {
        u.stations = u.stations.filter((station: IStation) => station.id !== deletedStation.id);
        data.operations.push({
          id: genID(),
          date: new Date(),
          type: "Удаление станции",
          data: `Удалена станция по адресу ${deletedStation.address}`,
          operator: user.name,
          location: ""
        });
      }
    });
  }

  addTariff(operator: IUser, address: string, from: string, to: string, price: number ) {
    data.users.map((user: IUser) => {
      if (user.id === operator.id) {
        user.stations.map((station: IStation) => {
          if (station.address === address) {
            station.tariffs.push({
              id: genID(),
              from,
              to,
              price
            });
            data.operations.push({
              id: genID(),
              operator: operator.name,
              type: "Добавление тарифа",
              data: `Добавлен тариф на станцию ${address}`,
              date: new Date(),
              location: ""
            });
          }
        });
      }
    });
  }

  deleteTariff(operator: IUser, currentStation: IStation, currentTariff: ITariff) {
    data.users.map((user: IUser) => {
      if (user.id === operator.id) {
        user.stations.map((station: IStation) => {
          if (station.id === currentStation.id) {
            station.tariffs.map((tariff: ITariff) => {
              station.tariffs = station.tariffs.filter((tariff: ITariff) => tariff.id !== currentTariff.id);
              data.operations.push({
                id: genID(),
                operator: operator.name,
                type: "Удаление тарифа",
                data: `Удален тариф с id ${currentTariff.id}`,
                date: new Date(),
                location: ""
              });
            });
          }
        });
      }
    });
  }
}
