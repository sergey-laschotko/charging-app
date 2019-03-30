import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IOperation, IUser, IStation, ITariff } from "./models";

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  url = "http://localhost:3000";

  constructor(private http: HttpClient) { 

  }

  getUser() {
    return this.http.get(`${this.url}/user`);
  }

  getStationOwner() {
    return this.http.get(`${this.url}/station-owner`);
  }

  getStationsOwners() {
    return this.http.get(`${this.url}/service-owner`);
  }

  getBalance(user: string) {
    const address = {
      address: user
    };
    return this.http.post(`${this.url}/get-balance`, address);
  }

  getHistory() {
    return this.http.get(`${this.url}/history`);
  }

  buyTokens(amount: number, address: string) {
    return this.http.post(`${this.url}/buy-tokens`, { amount, address });
  }

  reserve(from: number, to: number, address: string) {
    return this.http.post(`${this.url}/reserve`, { from, to, address });
  }

  charge(address: string) {
    return this.http.post(`${this.url}/start-charging`, { address });
  }

  getStations() {
    return this.http.get(`${this.url}/show-chargers`);
  }
}
