import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';


import {MatTableDataSource} from '@angular/material/table';


import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { MatSort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ManageMasterSystemReqModel } from 'src/app/core/model/ManageMasterSystem/ManageMasterSystemReqModel';
import { Observable, of } from 'rxjs';
import { MasterReqModel } from 'src/app/core/model/Master/MasterReqModel';
import { MasterSystemService } from 'src/app/core/services/master-system.service';
import { MasterService } from 'src/app/core/services/master.service';
import { MasterResModel } from 'src/app/core/model/Master/MasterResModel';
import { LogLoginReqModel } from 'src/app/core/model/log-login/LogLoginReqModel';
import { LogLoginService } from 'src/app/core/services/log-login.service';
import { LogLoginResModel } from 'src/app/core/model/log-login/LogLoginResModel';



@Component({
  selector: 'app-log-login',
  templateUrl: './log-login.component.html',
  styleUrls: ['./log-login.component.scss'],
})
export class LogLoginComponent implements OnInit , AfterViewInit  {
 

  formSubmitted: boolean = false
  visible: boolean = false
  action: string = ''
  user_name: string = ''


  formSearch: FormGroup
  taskForm: FormGroup

  statusIsActive$: Observable<MasterResModel[]> = of([])
  statusRequest$: Observable<MasterResModel[]> = of([])
  statusIsActive: MasterResModel[]
  statusRequest: MasterResModel[]


  ELEMENT_DATA: LogLoginResModel[] = [];


  displayedColumns: string[] = ['Row_no', 'Id', 'User_name' , 'Email', 'authenticate', 'create_by', 'create_date', 'update_by', 'update_date'];
  dataSource = new MatTableDataSource(this.GetAllData());


  pageEvent: PageEvent;
  pageIndex = 0;
  pageSize = 10;
  length = 50;


  constructor(
    private confirmationService: ConfirmationService
    , private messageService: MessageService
    , private fb: FormBuilder
    , private _liveAnnouncer: LiveAnnouncer
    , private masterSystemService: MasterSystemService
    , private masterService: MasterService
    , private logLoginService : LogLoginService
  ) { }


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {

    this.user_name = localStorage.getItem('savedUser')

    this.getMasterData()
    this.createFormSearch()
    this.createFormInput()

  }

  createFormInput() {
    this.taskForm = this.fb.group({
      Id: [0],
      Row_no: [''],
      System: ['', [Validators.required, Validators.maxLength(50)]],
      Description: ['', [Validators.maxLength(500)]],
      create_date: [''],
      update_date: [''],

      create_by: [{
        value: '',
        disabled: true
      }],
      update_by: [{
        value: '',
        disabled: true
      }],


      status: ['']
    })
  }

  createFormSearch() {
    this.formSearch = this.fb.group({
      txtSearch: [''],
      is_active: ['-1'],
      create_end_Date: [''],
    });

  }

  getMasterData() {
    let req: MasterReqModel
    this.masterService.GetAllMaster().subscribe(x => {
      if (x.status_code == '00') {

        // Status-Request
        const result = x.payload.filter(x => {
          return x.master_type == '003'
        })

        //Status is Active
        const resultIsActive = x.payload.filter(x => {
          return x.master_type == '001' || x.master_type == '007'
        })

        this.statusRequest$ = of(result)
        this.statusIsActive$ = of(resultIsActive)

        this.statusRequest = result
        this.statusIsActive = resultIsActive.sort( (a,b) => a.orderList < b.orderList ? -1 : 1 )

        this.formSearch.patchValue({
          //request_status : result[0].master_value ,
          is_active: this.statusIsActive[0].master_value
          //is_active: this.statusIsActive.find(x => x.master_value == '-1').master_value
        })


      } else {
        console.log(x)
      }
    })
  }

  onSubmit() {

    if (this.action == "Create Data") // Add
    {
      this.formSubmitted = true
      if (this.taskForm.status == 'INVALID') {
        console.log("INVALID")
        //console.log( this.taskForm.get('Description') )
        return;
      }

      let req: ManageMasterSystemReqModel
      req = this.taskForm.value
      req.create_by = this.user_name + '|' + new Date().toISOString()
      req.create_date = new Date().toISOString()
      req.update_by = this.user_name + '|' + new Date().toISOString()
      req.update_date = new Date().toISOString()

      this.masterSystemService.createMasterSystem(req).subscribe(x => {
        if (x.status_code == '00') {
          this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Save successfully' });


          this.ELEMENT_DATA = x.payload
          this.dataSource.data = this.ELEMENT_DATA

          //this.dataSource.data = x.payload

        } else {
          this.messageService.add({ severity: 'error', summary: 'Rejected', detail: x.status_text });

        }

      })

    }
    else if (this.action == "Edit Data")  // Edit
    {
      this.formSubmitted = true
      if (this.taskForm.status == 'INVALID') {
        console.log("INVALID")
        //console.log( this.taskForm.get('Description') )
        return;
      }

      let req: ManageMasterSystemReqModel
      req = this.taskForm.value
      //req.create_by = 'Manual|' + new Date().toISOString()
      //req.create_date = new Date().toISOString()
      req.update_by = this.user_name + '|' + new Date().toISOString()
      req.update_date = new Date().toISOString()
      this.masterSystemService.editMasterSystem(req).subscribe(x => {
        if (x.status_code == '00') {
          this.dataSource.data = x.payload
          this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Edit successfully' });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Rejected', detail: x.status_text });

        }

      });
    }

  }

  GetAllData() {

    let req: LogLoginReqModel
    this.logLoginService.GetAllLogLogin().subscribe(x => {
      if (x.status_code == '00') {
        this.ELEMENT_DATA = x.payload.sort((a,b) => a.create_date < b.create_date ? 1 : -1)
        this.dataSource.data = this.ELEMENT_DATA
        //this.dataSource.data = x.payload
      } else {
        console.log(x)
      }
    })
    return this.ELEMENT_DATA
  }

  showDialogCreateTask() {
    this.formSubmitted = false
    this.taskForm.reset();
    this.action = 'Create Data'
    this.taskForm.controls['create_by'].setValue(this.user_name + '|' + new Date().toLocaleDateString('en-GB'))
    this.taskForm.controls['update_by'].setValue(this.user_name + '|' + new Date().toLocaleDateString('en-GB'))
    this.taskForm.controls['status'].setValue('1')

    this.visible = !this.visible
  }

  showDialogEditTask(row: any) {
    this.formSubmitted = false
    this.taskForm.reset();
    this.action = 'Edit Data'

    this.taskForm.controls['Id'].setValue(row.Id)
    this.taskForm.controls['Row_no'].setValue(row.Row_no)
    this.taskForm.controls['System'].setValue(row.System)
    this.taskForm.controls['Description'].setValue(row.Description)
    this.taskForm.controls['create_by'].setValue(row.create_by)
    this.taskForm.controls['create_date'].setValue(row.create_date)
    this.taskForm.controls['update_by'].setValue(row.update_by)
    this.taskForm.controls['update_date'].setValue(row.update_date)
    this.taskForm.controls['status'].setValue(row.status)
    this.visible = !this.visible
  }

  showDialogViewTask(row: any) {
    this.formSubmitted = false
    this.taskForm.reset();
    this.action = 'View Data'
    this.taskForm.controls['Id'].setValue(row.Id)
    this.taskForm.controls['Row_no'].setValue(row.Row_no)
    this.taskForm.controls['System'].setValue(row.System)
    this.taskForm.controls['Description'].setValue(row.Description)
    this.taskForm.controls['create_by'].setValue(row.create_by)
    this.taskForm.controls['create_date'].setValue(row.create_date)
    this.taskForm.controls['update_by'].setValue(row.update_by)
    this.taskForm.controls['update_date'].setValue(row.update_date)
    this.taskForm.controls['status'].setValue(row.status)
    this.visible = !this.visible
  }

  onCancel() {
    this.visible = false
  }


  announceSortChange(sortState: any) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handlePageEvent(e: PageEvent) {
    // this.pageEvent = e;
    // this.length = e.length;
    // this.pageSize = e.pageSize;
    // this.pageIndex = e.pageIndex;

    //this.paginator = e
    console.log(e)
  }

  onSearch() {
    let result = this.ELEMENT_DATA;

    console.log(result)

    if (this.formSearch.value.txtSearch != '')
      result = result.filter(s => s.user_name.includes(this.formSearch.value.txtSearch) || s.email.includes(this.formSearch.value.txtSearch))

    // if (this.formSearch.value.is_active != '-1')
    //   result = result.filter(s => s.status == this.formSearch.value.is_active)


    if (this.formSearch.value.create_end_Date != '') {
      let dateStart = (this.formSearch.value.create_end_Date[0] + '').split(" ")
      let dateStart1 = new Date(dateStart[3] + '-' + dateStart[1] + dateStart[2] + " 00:00:00")
      let dateStart2 = new Date(dateStart[3] + '-' + dateStart[1] + dateStart[2] + " 23:59:59")

      let dateEnd = (this.formSearch.value.create_end_Date[1] + '').split(" ")
      let dateEnd1 = new Date(dateEnd[3] + '-' + dateEnd[1] + dateEnd[2] + " 23:59:59")

      // console.log(dateStart1.toDateString())
      // console.log(dateEnd1.toDateString())
      if (dateEnd1.toDateString() != 'Invalid Date') {
        result = result.filter(s => new Date(s.create_date) >= dateStart1
          && new Date(s.create_date) <= dateEnd1)
      } else {
        result = result.filter(s => new Date(s.create_date) >= dateStart1 && new Date(s.create_date) <= dateStart2)
      }


    }


    this.dataSource.data = result

  }

  onClear() {
    this.formSearch.patchValue({
      txtSearch: '',
     is_active: this.statusIsActive.find(x => x.master_value == '-1').master_value,
      create_end_Date: ''
    })

    this.dataSource.data = this.ELEMENT_DATA;
  }

  confirmDelete(row: any) {

    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        //this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
        this.deleteRecord(row)
      },
      reject: (type) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            //this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            break;
          case ConfirmEventType.CANCEL:
            //this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
        }
      }
    });

  }

  deleteRecord(row: any) {
    let req: ManageMasterSystemReqModel
    req = this.taskForm.value
    req.create_by = 'Manual|' + new Date().toISOString()
    req.create_date = new Date().toISOString()
    req.update_by = 'Manual|' + new Date().toISOString()
    req.update_date = new Date().toISOString()
    req.Id = row.Id
    req.Row_no = row.Row_no
    this.masterSystemService.deleteMasterSystem(req).subscribe(x => {
      if (x.status_code == '00') {
        //this.dataSource.data = x.payload
        this.ELEMENT_DATA = x.payload
        this.dataSource.data = this.ELEMENT_DATA
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Delete successfully' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: `Http Status: ${x.status} , ${x.status_text}` });

      }

    });

  }



}
