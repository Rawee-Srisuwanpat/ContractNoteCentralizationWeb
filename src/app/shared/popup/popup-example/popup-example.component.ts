import { Component, EventEmitter, OnInit, Output } from '@angular/core';
declare const $: any;

@Component({
  selector: 'app-popup-example',
  templateUrl: './popup-example.component.html',
  styleUrls: ['./popup-example.component.css']
})
export class PopupExampleComponent implements OnInit {
  model = Object.assign({})
  @Output() output = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  Summit() {
    this.output.emit(this.model)
    this.model = Object.assign({})
    $('#staticBackdrop').modal('toggle');
  }
}
