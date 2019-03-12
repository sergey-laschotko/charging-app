import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  @Input() isModalOpened: boolean;
  @Input() action: string;
  @Output() closeAction = new EventEmitter();
  @Output() submitAction = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  closeModal() {
    this.closeAction.emit();
  }

  act(e: Event) {
    this.submitAction.emit();
  }
}
