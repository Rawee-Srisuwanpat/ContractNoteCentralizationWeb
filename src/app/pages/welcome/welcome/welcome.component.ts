import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { IdleService } from 'src/app/core/services/IdleService';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  model: any = Object.assign({});
  isUser = false;
  isPass = false;

  formdata;
  userName; 
  email;

  istoggle: boolean = false
  visible: boolean = false

  constructor(private idleService : IdleService) { }

  ngOnInit() {
    this.formdata = new FormGroup({ 
      userName: new FormControl("Tutorialspoint"),
      email: new FormControl("Tutorialspoint")
   }); 

   this.idleService.onFristTimeComein()
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
