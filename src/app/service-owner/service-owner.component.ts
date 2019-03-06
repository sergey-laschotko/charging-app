import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-service-owner',
  templateUrl: './service-owner.component.html',
  styleUrls: ['./service-owner.component.css']
})
export class ServiceOwnerComponent implements OnInit {
  username: string = 'SERVICE Owner';
  balance: string = '23750';
  serviceProviders: any[] = [
    'Service Provider 1',
    'Service Provider 2',
    'Service Provider 3',
    'Service Provider 4',
    'Service Provider 5',
  ];
  smartContracts: any[] = [
    'Contract 1',
    'Contract 1',
    'Contract 1',
    'Contract 1',
    'Contract 1',
    'Contract 1'
  ];
  chosen: string = "Никто не выбран";
  isModalOpened: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  openModel(sp: any) {
    this.chosen = sp;
    this.isModalOpened = true;
  }

  closeModal() {
    this.chosen = "Никто не выбран";
    this.isModalOpened = false;
  }
}
