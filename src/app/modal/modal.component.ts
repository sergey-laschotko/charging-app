import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  @Input() visible: boolean;
  @Output() shutModal = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  closeModal() {
    this.visible = false;
    this.shutModal.emit();
  }
}
