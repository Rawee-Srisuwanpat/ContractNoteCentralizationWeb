import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';


import {PeriodicElement} from 'src/app/core/model/PeriodicElement' 
import {MatTableDataSource} from '@angular/material/table';


import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator, PageEvent } from '@angular/material/paginator';



@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit , AfterViewInit  {
 

  visible: boolean = false

  isEdit : boolean = false




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


  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol','actions'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
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

      this.ELEMENT_DATA.push({position: this.ELEMENT_DATA.length +1
      , name: this.taskForm.value['name']
      , weight: this.taskForm.value['weight']
      , symbol: this.taskForm.value['symbol']})

    }
    else // Edit
    {
      console.log(2)
      var foundIndex = this.ELEMENT_DATA.findIndex(x => x.position == this.taskForm.value['position']);
      this.ELEMENT_DATA[foundIndex] = {position: this.taskForm.value['position']
                                      , name: this.taskForm.value['name']
                                      , weight: this.taskForm.value['weight']
                                      , symbol: this.taskForm.value['symbol']}
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
