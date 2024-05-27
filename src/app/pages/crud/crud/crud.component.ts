import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';

import {Hero } from 'src/app/core/model/hero' 
import { Course } from 'src/app/core/model/Course' 

import {PeriodicElement} from 'src/app/core/model/PeriodicElement' 
import {MatTableDataSource} from '@angular/material/table';


import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, ParamMap } from '@angular/router';



//import {  DynamicDialogRef } from 'primeng/dynamicdialog';
@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.scss'],
})
export class CrudComponent implements OnInit {
  model: any = Object.assign({});
  isUser = false;
  isPass = false;

  formdata;
  userName; 
  email;

  istoggle: boolean = false
  visible: boolean = false

  favoriteColorControl = new FormControl('');
  favoriteColor = '123';

  heroData : Hero []

  ELEMENT_DATA: PeriodicElement[] = [
    {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
    {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
    {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
    {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
    {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
    {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
    {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
    {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
    {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
    {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  ];


  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);

  date : Date
  courses: Course[] = [];
  selected: Course[] = [];

  public tong : string = 'init data';

  name: string = ''

  constructor(private apiService : ApiService 
    ,private confirmationService: ConfirmationService
    , private messageService: MessageService
    //, private ref: DynamicDialogRef
    ,private route: ActivatedRoute
    ) { }

  ngOnInit() {
    this.formdata = new FormGroup({ 
      userName: new FormControl("Tutorialspoint"),
      email: new FormControl("Tutorialspoint")
   });


   this.route.paramMap.subscribe((params: ParamMap) => {
    this.name = params.get('name')
  })
   
   this.date = new Date()

   //this.heroData = this.apiService.getHeroData()
  //  this.apiService.getHeroData()
  //  .subscribe(heros => 
  //     this.heroData = heros
  //   )

    this.apiService.getHeroDataFromURL()
    .subscribe(heros => 
       this.heroData = heros
     )


     this.courses = [
      {
          id: 1,
          name: "Self Paced DSA",
          price: "3,899"
      },
      {
          id: 2,
          name: "CIP - Self Paced",
          price: "6,999"
      },
      {
          id: 3,
          name: "System Design - Live",
          price: "10,999"
      },
      {
          id: 4,
          name: "CP - Live",
          price: "10,999"
      },
      {
          id: 5,
          name: "C++ Self Paced",
          price: "1,699"
      },
      {
          id: 6,
          name: "GATE 2024",
          price: "11,999"
      }
  ];
    
  }

  onClickSubmit(data) {
    this.userName = data.userName;
    this.email = data.email;

    console.log(this.favoriteColor)
    console.log(this.favoriteColorControl.value)
  }


showDialog()
{
  this.visible = !this.visible

}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

confirm(event: Event) {
  this.confirmationService.confirm({
    target: event.target as EventTarget,
    message: 'Are you sure that you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
        this.visible = false
    },
    reject: () => {
        //this.ref.destroy() // cannot use 555
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
    }
});

}

}
