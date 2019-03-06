import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatTable } from '@angular/material';
import { stations } from '../stations';
import { journal, stationsBalance } from '../locations-journal';

@Component({
  selector: 'app-service-owner',
  templateUrl: './service-owner.component.html',
  styleUrls: ['./service-owner.component.css']
})
export class ServiceOwnerComponent implements OnInit {
  username: string = 'Диспетчер';
  balance: string = '23750';
  tokens: number = 500;
  tokenCreating: boolean = false;
  tokenDeleting: boolean = false;
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
  stations = stations;
  operations = journal;
  selectedStation = 0;
  displayedColumns: string[] = ["date", "operation"];
  dataSource: any = [];
  stationsBalance = stationsBalance;
  balanceColumns: string[] = ["station", "balance"];
  balanceSource = new MatTableDataSource(this.stationsBalance);

  @ViewChild('opPaginator') opPaginator: MatPaginator;
  @ViewChild('bPaginator') bPaginator: MatPaginator;

  constructor() { }

  ngOnInit() {
    this.showStationJournal();
    this.balanceSource.paginator = this.bPaginator;
  }

  showStationJournal() {
    let newJournal = this.operations.filter((operation: any) => {
      return operation.station === this.stations[this.selectedStation];
    })
    this.dataSource = new MatTableDataSource(newJournal);
    this.dataSource.paginator = this.opPaginator;
  }

  switchStation() {
    this.showStationJournal();
  }

  openModel(sp: any) {
    this.chosen = sp;
    this.isModalOpened = true;
  }

  closeModal() {
    this.chosen = "Никто не выбран";
    this.isModalOpened = false;
  }

  createTokens() {
    if (this.tokenCreating) {
      this.tokenCreating = !this.tokenCreating;
    } else {
      this.tokenCreating = true;
    }
  }

  deleteTokens() {
    if (this.tokenDeleting) {
      this.tokenDeleting = !this.tokenDeleting;
    } else {
      this.tokenDeleting = true;
    }
  }

  manipulateTokens(val: number) {
    if (this.tokenCreating) {
      this.tokens += Number(val);
    } else if (this.tokenDeleting) {
      this.tokens -= Number(val);
    } else {
      this.tokenCreating = false;
      this.tokenDeleting = false;
      return false;
    }
    this.tokenCreating = false;
    this.tokenDeleting = false;
  }
}
