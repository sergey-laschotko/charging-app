import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  address: string = "";
  abi: string = "";

  constructor() { }

  ngOnInit() {
  }

  sendSettings() {
    if (this.address && this.abi) {
      console.log("Address: " + this.address + "\nABI: " + this.abi);
      this.address = "";
      this.abi = "";
    }
  }
}
