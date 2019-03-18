import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { onlyDigits } from 'src/lib/lib';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent implements OnInit {
  @Input() add: string;
  @Input() remove: string;
  @Input() tokens: number;
  @Input() buyingProcess: boolean = false;
  @Output() onAdd = new EventEmitter<number>();
  @Output() onRemove = new EventEmitter<number>();
  amountToAdd: number = 0;
  isInputOpened: boolean = false;

  @ViewChild('amountInput') amountInput: ElementRef;

  constructor() { }

  ngOnInit() {}

  addTokens() {
    if (!this.isInputOpened) {
      this.isInputOpened = true;
      this.amountInput.nativeElement.focus();
      return;
    }
    if (!this.amountToAdd) {
      this.isInputOpened = false;
      return;
    }
    this.onAdd.emit(Number(this.amountToAdd));
    this.amountToAdd = 0;
    this.isInputOpened = false;
  }

  checkInput(e: any) {
    return onlyDigits(e);
  }

  amountToNumber() {
    this.amountToAdd *= 1;
    this.amountInput.nativeElement.value = this.amountToAdd;
  }
}
