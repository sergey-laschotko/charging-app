import { Component, OnInit } from '@angular/core';

import { stations } from '../stations';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  public username: string = "John Doe";
  public balance: string = "250";
  public showInput: boolean = true;
  public address: string = "";
  public variants: string[] = [];
  public stations: string[] = stations;
  public time: string;

  constructor() { }

  ngOnInit() {
  }

  findVariants() {
    if (this.address.length) {
      this.variants = this.stations.filter((station: string) => {
        return station.toLowerCase().indexOf(this.address) === 0;
      });
    } else {
      this.variants = [];
    }
  }

  setAddress(address: string) {
    this.address = address;
    this.variants = [];
  }

  toggleForm() {
    this.showInput = !this.showInput;
  }

  validateForm() {
    return this.stations.indexOf(this.address) !== -1 && this.time;
  }

  reserve() {
    console.log(`Зарядка по адресу ${this.address} в ${this.time}`);
  }

  charge() {
    console.log("Идет зарядка");
  }
}
