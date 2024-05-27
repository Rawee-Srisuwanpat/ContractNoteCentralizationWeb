import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';


import {FollowUpHistoryModel } from 'src/app/core/model/FollowUpHistory' 
import { BillingInvoiceDetailsModel } from 'src/app/core/model/BillingInvoiceDetails';

import {MatTableDataSource} from '@angular/material/table';


import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';



@Component({
  selector: 'app-contract-note-detail',
  templateUrl: './contract-note-detail.component.html',
  styleUrls: ['./contract-note-detail.component.scss'],
})
export class ContractNoteDetailComponent implements OnInit , AfterViewInit  {
 

  visible: boolean = false

  isEdit : boolean = false


 

  


  ELEMENT_DATA: FollowUpHistoryModel[] = [
    {position: 1,  ActionCode_ActionName : 'Hydrogen'   , Result: '' , Next_Action: 'H'   ,Next_Action_Date : '', Remask : '' ,Action : ''},
    {position: 2,  ActionCode_ActionName : 'Helium'     , Result: '' , Next_Action: 'He'  ,Next_Action_Date : '', Remask : '' ,Action : ''},
    {position: 3,  ActionCode_ActionName : 'Lithium'    , Result: '' , Next_Action: 'Li'  ,Next_Action_Date : '', Remask : '' ,Action : ''},
    {position: 4,  ActionCode_ActionName : 'Beryllium'  , Result: '' , Next_Action: 'Be'  ,Next_Action_Date : '', Remask : '' ,Action : ''},
    {position: 5,  ActionCode_ActionName : 'Boron'      , Result: '' , Next_Action: 'B'   ,Next_Action_Date : '', Remask : '' ,Action : ''},
    {position: 6,  ActionCode_ActionName : 'Carbon'     , Result: '' , Next_Action: 'C'   ,Next_Action_Date : '', Remask : '' ,Action : ''},
    {position: 7,  ActionCode_ActionName : 'Nitrogen'   , Result: '' , Next_Action: 'N'   ,Next_Action_Date : '', Remask : '' ,Action : ''},
    {position: 8,  ActionCode_ActionName : 'Oxygen'     , Result: '' , Next_Action: 'O'   ,Next_Action_Date : '', Remask : '' ,Action : ''},
    {position: 9,  ActionCode_ActionName : 'Fluorine'   , Result: '' , Next_Action: 'F'   ,Next_Action_Date : '', Remask : '' ,Action : ''},
    {position: 10, ActionCode_ActionName : 'Neon'       , Result: '' , Next_Action: 'Ne'  ,Next_Action_Date : '', Remask : '' ,Action : ''},
  ];



  ELEMENT_DATA2: BillingInvoiceDetailsModel[] = [
    {position: 1,  TransactionDate : 'Hydrogen'   , Model: '' , Amount: 'H'   ,Date : '', Remask : '' ,Action : ''},
    {position: 2,  TransactionDate : 'Helium'     , Model: '' , Amount: 'He'  ,Date : '', Remask : '' ,Action : ''},
    {position: 3,  TransactionDate : 'Lithium'    , Model: '' , Amount: 'Li'  ,Date : '', Remask : '' ,Action : ''},
    {position: 4,  TransactionDate : 'Beryllium'  , Model: '' , Amount: 'Be'  ,Date : '', Remask : '' ,Action : ''},
    {position: 5,  TransactionDate : 'Boron'      , Model: '' , Amount: 'B'   ,Date : '', Remask : '' ,Action : ''},
    {position: 6,  TransactionDate : 'Carbon'     , Model: '' , Amount: 'C'   ,Date : '', Remask : '' ,Action : ''},
    {position: 7,  TransactionDate : 'Nitrogen'   , Model: '' , Amount: 'N'   ,Date : '', Remask : '' ,Action : ''},
    {position: 8,  TransactionDate : 'Oxygen'     , Model: '' , Amount: 'O'   ,Date : '', Remask : '' ,Action : ''},
    {position: 9,  TransactionDate : 'Fluorine'   , Model: '' , Amount: 'F'   ,Date : '', Remask : '' ,Action : ''},
    {position: 10, TransactionDate : 'Neon'       , Model: '' , Amount: 'Ne'  ,Date : '', Remask : '' ,Action : ''},
  ];


  displayedColumns: string[] = ['position', 'ActionCode_ActionName', 'Result', 'Next_Action','Next_Action_Date' ,'Remask' , 'Action'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);


  displayedColumns2: string[] = ['position', 'TransactionDate', 'Model', 'Amount','Date' ,'Remask' , 'Action'];
  dataSource2 = new MatTableDataSource(this.ELEMENT_DATA2);
  taskForm : FormGroup

  pageEvent: PageEvent;
  pageIndex = 0;
  pageSize = 10;
  length = 50;
 
  
  constructor(private apiService : ApiService 
    ,private confirmationService: ConfirmationService
    , private messageService: MessageService
    ,private route: ActivatedRoute
    ,private fb : FormBuilder
    ,private _liveAnnouncer: LiveAnnouncer
    ) { }


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;

    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
   

  //  this.taskForm = new FormGroup({
  //   name : new FormControl('',Validators.required),
  //   weight : new FormControl('',Validators.maxLength(3)),
  //   symbol : new FormControl('')
  //  })

  this.taskForm =  this.fb.group({
    position : [''] ,
    name : ['default name',[Validators.required , Validators.maxLength(3)]],
    weight : ['170' , [Validators.maxLength(3)]],
    symbol : ['AAAA']
  })




  }

  announceSortChange(sortState: any) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  onSubmit(){
    console.log(this.taskForm)


    if (this.taskForm.status == "INVALID")
    {
      console.log(this.taskForm.controls['name'].status)

      console.log(this.taskForm.controls['name'].errors)


    }
    console.log(this.taskForm.value['name'])
    console.log(this.taskForm.value['position'])

    if (this.taskForm.value['position'] == null) // Add
    {
      console.log(1)

      // this.ELEMENT_DATA.push({position: this.ELEMENT_DATA.length +1
      // , name: this.taskForm.value['name']
      // , weight: this.taskForm.value['weight']
      // , symbol: this.taskForm.value['symbol']})

    }
    else // Edit
    {
      console.log(2)
      var foundIndex = this.ELEMENT_DATA.findIndex(x => x.position == this.taskForm.value['position']);
      // this.ELEMENT_DATA[foundIndex] = {position: this.taskForm.value['position']
      //                                 , name: this.taskForm.value['name']
      //                                 , weight: this.taskForm.value['weight']
      //                                 , symbol: this.taskForm.value['symbol']}
    }

   

    this.dataSource.data = this.ELEMENT_DATA

  }

 

showDialogCreateTask(row : any)
{
  this.taskForm.reset();
  console.log(row)
  if (row === 0) 
    this.isEdit = false 
    //this.taskForm.controls['position'].setValue('0')
  else  
  {
    this.isEdit = true
    this.taskForm.controls['position'].setValue(row.position)
    this.taskForm.controls['name'].setValue(row.name)  
    this.taskForm.controls['weight'].setValue(row.weight) 
    this.taskForm.controls['symbol'].setValue(row.symbol) 
  }


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


handlePageEvent(e: PageEvent) {

 
  // this.pageEvent = e;
  // this.length = e.length;
  // this.pageSize = e.pageSize;
  // this.pageIndex = e.pageIndex;
  
  //this.paginator = e
  console.log(e)
}


}
