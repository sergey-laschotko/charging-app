import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatTable } from '@angular/material';
import { stations } from '../mock-data/datasource';

@Component({
  selector: 'app-service-owner',
  templateUrl: './service-owner.component.html',
  styleUrls: ['./service-owner.component.css']
})
export class ServiceOwnerComponent implements OnInit {
  username: string = 'Диспетчер';
  tokens: number = 5000;
  serviceProviders: any[] = [];
  chosen: string = "Никто не выбран";
  isModalOpened: boolean = false;
  stations = stations;
  operations: string[] = [];
  selectedStation = 0;
  displayedColumns: string[] = ["date", "operation"];
  dataSource: any = [];
  stationsBalance: string[] = [];
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

  produceTokens(amount: number) {
    this.tokens += amount;
  }

  removeTokens(amount: number) {
    this.tokens -= amount;
  }
}
