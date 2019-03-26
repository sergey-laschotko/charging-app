import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { onlyDigits } from 'src/lib/lib';

@Component({
  selector: 'app-owner-balance',
  templateUrl: './owner-balance.component.html',
  styleUrls: ['./owner-balance.component.css']
})
export class OwnerBalanceComponent implements OnInit {
  @Input() add: string;
  @Input() remove: string;
  @Input() tokens: number;
  @Input() addingProcess: boolean = false;
  @Input() removingProcess: boolean = false;
  @Output() onAdd = new EventEmitter<number>();
  @Output() onRemove = new EventEmitter<number>();
  amountToAdd: number = 0;
  amountToRemove: number = 0;
  isAddOpened: boolean = false;
  isRemoveOpened: boolean = false;

  @ViewChild('addInput') addInput: ElementRef;
  @ViewChild('removeInput') removeInput: ElementRef;

  constructor() { }

  ngOnInit() {}

  addTokens() {
    if (!this.isAddOpened) {
      this.isAddOpened = true;
      this.addInput.nativeElement.focus();
      return;
    }
    if (!this.amountToAdd) {
      this.isAddOpened = false;
      return;
    }
    this.onAdd.emit(Number(this.amountToAdd));
    this.amountToAdd = 0;
    this.isAddOpened = false;
  }

  removeTokens() {
    if (!this.isRemoveOpened) {
      this.isRemoveOpened = true;
      this.removeInput.nativeElement.focus();
      return;
    }
    if (!this.amountToRemove) {
      this.isRemoveOpened = false;
      return;
    }
    this.onRemove.emit(Number(this.amountToRemove));
    this.amountToRemove = 0;
    this.isRemoveOpened = false;
  }

  checkInput(e: any) {
    return onlyDigits(e);
  }

  amountToNumber() {
    this.amountToAdd *= 1;
    this.addInput.nativeElement.value = this.amountToAdd;
    this.amountToRemove *= 1;
    this.removeInput.nativeElement.value = this.amountToRemove;
  }

  resetInput() {
    this.amountToAdd = 0;
    this.amountToRemove = 0;
    this.isAddOpened = false;
    this.isRemoveOpened = false;
  }
}