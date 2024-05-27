import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  model: any = Object.assign({});
  isUser = false;
  isPass = false;

  constructor() { }

  ngOnInit() {
  }

}
