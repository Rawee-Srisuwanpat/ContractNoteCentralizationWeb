
import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { MatSort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Observable, Observer, of } from 'rxjs';
import { MasterSystemService } from 'src/app/core/services/master-system.service';
import { ManageMasterSystemReqModel } from 'src/app/core/model/ManageMasterSystem/ManageMasterSystemReqModel';
import { MasterResModel } from 'src/app/core/model/Master/MasterResModel';
import { MasterReqModel } from 'src/app/core/model/Master/MasterReqModel';
import { MasterService } from 'src/app/core/services/master.service';
import { PermissionService } from 'src/app/core/services/permission.service';
import { PermissionSystemCodeService } from 'src/app/core/services/permissionSystemCode.service';
import { City } from 'src/app/core/model/City';
import { IdleService } from 'src/app/core/services/IdleService';

@Component({
  selector: 'app-action-code',
  templateUrl: './action-code.component.html',
  styleUrls: ['./action-code.component.scss']
})
export class ActionCodeComponent implements OnInit {
 

  formSubmitted: boolean = false
  visible: boolean = false
  action: string = ''
  user_name: string = ''
  myIndex: number = 0

  


  formSearch: FormGroup
  taskForm: FormGroup

  statusIsActive$: Observable<MasterResModel[]> = of([])
  statusRequest$: Observable<MasterResModel[]> = of([])
  statusIsActive: MasterResModel[]
  statusRequest: MasterResModel[]


  ELEMENT_DATA: ManageMasterSystemReqModel[] = [];


  displayedColumns: string[] = ['Row_no', 'Id', 'System', 'Description', 'create_by', 'create_date', 'update_by', 'update_date', 'status', 'Actions'];
  dataSource = new MatTableDataSource(this.GetAllData());


  pageEvent: PageEvent;
  pageIndex = 0;
  pageSize = 10;
  length = 50;

  is_view : boolean = false
  is_edit : boolean = false
  is_delete : boolean = false
  is_create : boolean = false

  isShowMessageNotify: boolean = false
  messageNotify: string = ''

  isShowMessageNotify2: boolean = false
  messageNotify2: string = ''

  rangeDates: Date[] | undefined;

  selectedStatus: City | undefined;
  filteredStatus: any[] | undefined;


  constructor(
    private confirmationService: ConfirmationService
    , private messageService: MessageService
    , private fb: FormBuilder
    , private _liveAnnouncer: LiveAnnouncer
    , private masterSystemService: MasterSystemService
    , private masterService: MasterService
    , private permissionService : PermissionSystemCodeService
    
  ) { }


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {

    this.user_name = localStorage.getItem('savedUser')

    this.setupRole()

    this.getMasterData()
    this.createFormSearch()
    this.createFormInput()

    let var1 : string = 'aaa'
    let var2  = 'aaa'

    let var3 : any 
    var3 = 'bbb'

    // casting
    var3 = <number> 123
    var3 = {a : 123} as any

    console.log('var1 : ',var1)
    console.log('var2 : ',var2)
    console.log(typeof var2);
    console.log(typeof var3);


    

  }

  @ViewChild('calendar') calendar: any;
   onSelect(){
    if (this.rangeDates[1]) { // If second date is selected
      this.calendar.overlayVisible=false;
    }
  }

  setupRole() {

    this.permissionService.readPermission('Master Data')
    this.is_view = this.permissionService.getViewPermission()
    this.is_edit = this.permissionService.getEditPermission()
    this.is_delete = this.permissionService.getDeletePermission()
    this.is_create = this.permissionService.getCreatePermission()
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
      is_active: [''] , //['-1'],
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
          return x.master_type == '001' //|| x.master_type == '009'
        })

        this.statusRequest$ = of(result)
        this.statusIsActive$ = of(resultIsActive)

        this.statusRequest = result
        this.statusIsActive = resultIsActive.sort( (a,b) => a.orderList < b.orderList ? -1 : 1 )

        // this.formSearch.patchValue({
        //   //request_status : result[0].master_value ,
        //   is_active: this.statusIsActive[0].master_value
        //   //is_active: this.statusIsActive.find(x => x.master_value == '-1').master_value
        // })


      } else {
        console.log(x)
      }
    })
  }

  onSubmit() {

    const expeptChar = ['@', '#' , '$' ,'%' , '&' ,'*' , '!' ,'+']

    const is_expert = expeptChar.some(i => this.taskForm.get('System').value?.includes(i))
    if(is_expert) {
      this.formSubmitted = true

      this.isShowMessageNotify2 = true 
      this.messageNotify2 = 'Please enter your System correctly. Do not use special characters.Example : @#$%&*!+'

      return 
    }


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
      req.create_by = this.user_name + ' | ' + new Date().toISOString()
      req.create_date = new Date().toISOString()
      req.update_by = this.user_name + ' | ' + new Date().toISOString()
      req.update_date = new Date().toISOString()

      this.masterSystemService.createMasterSystem(req).subscribe(x => {
        if (x.status_code == '00') {
          //this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Save successfully' });


          // this.ELEMENT_DATA = x.payload
          // this.dataSource.data = this.ELEMENT_DATA

          this.GetAllData()

          this.isShowMessageNotify = true
          this.messageNotify = 'Save successfully'

        } else {
          //this.messageService.add({ severity: 'error', summary: 'Rejected', detail: x.status_text });
          this.isShowMessageNotify = true
          this.messageNotify = x.status_text

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
      req.update_by = this.user_name + ' | ' + new Date().toISOString()
      req.update_date = new Date().toISOString()
      this.masterSystemService.editMasterSystem(req).subscribe(x => {
        if (x.status_code == '00') {
          // this.dataSource.data = x.payload
          // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Edit successfully' });

          this.GetAllData()
          this.isShowMessageNotify = true
          this.messageNotify = 'Save successfully'
        } else {
          //this.messageService.add({ severity: 'error', summary: 'Rejected', detail: x.status_text });
          this.isShowMessageNotify = true
          this.messageNotify = x.status_text

        }

      });
    }

  }

  GetAllData() {

    let req: ManageMasterSystemReqModel
    //req.Row_no = 0
    // req.Description = ''
    // req.System = ''
    // req.create_by = ''
    // req.create_date = ''
    // req.status = ''
    // req.update_by = ''
    // req.update_date = ''

    this.masterSystemService.searchMasterSystem().subscribe(x => {
      if (x.status_code == '00') {
        this.ELEMENT_DATA = x.payload
        this.dataSource.data = this.ELEMENT_DATA
        //this.dataSource.data = x.payload
      } else {
        console.log(x)
      }
    })
    return this.ELEMENT_DATA
  }

  formatDateToYYYYMMDDHHMMSS(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  showDialogCreateTask() {
    this.formSubmitted = false
    this.taskForm.reset();
    this.action = 'Create Data'
    // this.taskForm.controls['create_by'].setValue(this.user_name + ' | ' + new Date().toLocaleDateString('en-GB'))
    // this.taskForm.controls['update_by'].setValue(this.user_name + ' | ' + new Date().toLocaleDateString('en-GB'))
    
    this.taskForm.controls['create_by'].setValue(this.user_name + ' | ' + this.formatDateToYYYYMMDDHHMMSS(new Date()))
    this.taskForm.controls['update_by'].setValue(this.user_name + ' | ' + this.formatDateToYYYYMMDDHHMMSS(new Date()))
    
    
    
    
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

    this.taskForm.controls['System'].disable()
    this.visible = !this.visible
  }

  showDialogViewTask(row: any) {
    this.setdisableControls()
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
    this.setEnableControls()
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
    this.myIndex = e.pageSize * e.pageIndex
  }

  onSearch() {
    //
    this.myIndex = 0
    console.log(this.formSearch.value.is_active)
    let result = this.ELEMENT_DATA;
    if (this.formSearch.value.txtSearch != '') {
       result = result.filter(s => {
        return s.System.includes( this.formSearch.value.txtSearch) || s.Description?.includes( this.formSearch.value.txtSearch)
      })

    }

    //if (this.formSearch.value.is_active != '-1')
    //result = result.filter(s => s.status == this.formSearch.value.is_active)

    let is_active =  (this.formSearch.value.is_active?.master_value ==  undefined) 
    ?  this.statusIsActive.filter(z => z.master_text?.toLocaleUpperCase() == this.formSearch.value.is_active?.toLocaleUpperCase())[0]?.master_value   
    : this.formSearch.value.is_active.master_value

    console.log(is_active)

    if (this.formSearch.value.is_active != undefined && this.formSearch.value.is_active != '')
         result =  result.filter(s => s.status == is_active)


    if (this.formSearch.value.create_end_Date != '' && this.formSearch.value.create_end_Date != undefined) {
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
     //is_active: this.statusIsActive.find(x => x.master_value == '-1').master_value,
     is_active : '',
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
        // this.ELEMENT_DATA = x.payload
        // this.dataSource.data = this.ELEMENT_DATA
        // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Delete successfully' });

        this.GetAllData()
        this.isShowMessageNotify = true
        this.messageNotify = 'Delete successfully'
      } else {
        //this.messageService.add({ severity: 'error', summary: 'Rejected', detail: `Http Status: ${x.status} , ${x.status_text}` });
        this.isShowMessageNotify = true
        this.messageNotify = x.status_text

      }

    });

  }

  setdisableControls() {
    this.taskForm.controls['Id'].disable()
    this.taskForm.controls['Row_no'].disable()
    this.taskForm.controls['System'].disable()
    this.taskForm.controls['Description'].disable()
    this.taskForm.controls['create_by'].disable()
    this.taskForm.controls['create_date'].disable()
    this.taskForm.controls['update_by'].disable()
    this.taskForm.controls['update_date'].disable()
    this.taskForm.controls['status'].disable()
  }

  setEnableControls() {
    this.taskForm.controls['Id'].enable()
    this.taskForm.controls['Row_no'].enable()
    this.taskForm.controls['System'].enable()
    this.taskForm.controls['Description'].enable()
    // this.taskForm.controls['create_by'].enable()
    // this.taskForm.controls['create_date'].enable()
    // this.taskForm.controls['update_by'].enable()
    // this.taskForm.controls['update_date'].enable()
    this.taskForm.controls['status'].enable()

  }

  onCloseDialogNotifyMessage() {
    //console.log('z')

    this.isShowMessageNotify = false
    this.visible = false
    //this.router.navigate(['/manage-register']);
  }

  onCloseDialogNotifyMessage2() {
    //console.log('z')

    this.isShowMessageNotify2 = false
    //this.visible = false
    //this.router.navigate(['/manage-register']);
  }

  filterStatus(event: any) {
    let filtered: any[] = [];
    let query = event.query;
  
    for (let i = 0; i < (this.statusIsActive as any[]).length; i++) {
        let country = (this.statusIsActive as any[])[i];
        if (country.master_text.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(country);
        }
    }
  
    this.filteredStatus = filtered;
  }

  
}
