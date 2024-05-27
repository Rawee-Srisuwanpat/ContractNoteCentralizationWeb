import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-do-something',
  templateUrl: './do-something.component.html',
  styleUrls: ['./do-something.component.scss'],
})
export class DoSomethingComponent implements OnInit {
  model: any = Object.assign({});
  isUser = false;
  isPass = false;

  formdata;
  userName; 
  email;

  istoggle: boolean = false
  visible: boolean = false

  constructor() { }

  ngOnInit() {
    this.formdata = new FormGroup({ 
      userName: new FormControl("Tutorialspoint"),
      email: new FormControl("Tutorialspoint")
   }); 
  }

  onClickSubmit(data) {
    this.userName = data.userName;
    this.email = data.email;
  }

  toggle() {
    console.log('aaaaaaaa')
    this.istoggle = !this.istoggle
}

showDialog()
{
  this.visible = !this.visible

}

}
