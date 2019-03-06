import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent implements OnInit {
  @Input() add: string;
  @Input() remove: string;
  @Input() tokens: number;
  @Output() onAdd = new EventEmitter<number>();
  @Output() onRemove = new EventEmitter<number>();
  amountToAdd: number = 0;
  amountToRemove: number = 0;

  constructor() { }

  ngOnInit() {
  }

  increaseAdding() {
    this.amountToAdd += 1;
  }

  decreaseAdding() {
    if (this.amountToAdd === 0) {
      return;
    }
    this.amountToAdd -= 1;
  }

  increaseRemoving() {
    this.amountToRemove += 1;
  }

  decreaseRemoving() {
    if (this.amountToRemove === 0) {
      return;
    }
    this.amountToRemove -= 1;
  }

  addTokens() {
    this.onAdd.emit(this.amountToAdd);
    this.amountToAdd = 0;
  }

  removeTokens() {
    this.onRemove.emit(this.amountToRemove);
    this.amountToRemove = 0;
  }
}
