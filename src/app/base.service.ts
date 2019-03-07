import { Injectable } from '@angular/core';
import { DataSource, stations, stationsOwners, users, operations } from './journal';

const data = new DataSource(stations, operations, stationsOwners, users).generate();

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  constructor() { 
    console.log(data);
  }
}
