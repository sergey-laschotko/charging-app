import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatTable } from '@angular/material';
import { BaseService } from '../base.service';
import { IStation, IOperation } from '../mock-data/models';
import { formatDate } from '../../lib/lib';

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
  operations: IOperation[] = [];
  selectedStation;
  displayedColumns: string[] = ["date", "type", "operator", "data"];
  dataSource: any = null;
  stations: IStation[] = [];
  balanceColumns: string[] = ["address", "balance"];
  balanceSource: any = null;

  @ViewChild('opPaginator') opPaginator: MatPaginator;
  @ViewChild('bPaginator') bPaginator: MatPaginator;

  constructor(private bs: BaseService) { 
    this.serviceProviders = this.bs.getStationsOwners();
    this.stations = this.bs.getStations();
    this.balanceSource = new MatTableDataSource(this.stations);
    this.selectedStation = this.stations[0].address;
    this.operations = this.bs.getOperations();
    let selectedStationOperations = this.operations.filter((operation: IOperation) => {
      return operation.location === this.selectedStation;
    });
    this.dataSource = new MatTableDataSource(selectedStationOperations);
  }

  ngOnInit() {
    this.showStationJournal();
    this.balanceSource.paginator = this.bPaginator;
  }

  formatDate(date: Date) {
    return formatDate(date).string;
  }

  showStationJournal() {
    console.log(this.selectedStation);
    let newJournal = this.operations.filter((operation: any) => {
      return operation.location === this.selectedStation;
    })
    this.dataSource = new MatTableDataSource(newJournal);
    this.dataSource.paginator = this.opPaginator;
  }

  produceTokens(amount: number) {
    this.tokens += amount;
  }

  removeTokens(amount: number) {
    this.tokens -= amount;
  }
}
